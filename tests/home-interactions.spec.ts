import { test, expect } from "./helpers/fixtures";
import type { Locator, Page } from "@playwright/test";

const playStates = (locator: Locator) =>
  locator.evaluate((el) => el.getAnimations().map((a) => a.playState));
const transformOf = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el).transform);

test("hero mascot is preloaded with the same hashed asset the image uses", async ({
  page,
}) => {
  await page.goto("/");
  const preload = page.locator('link[rel="preload"][as="image"]');
  await expect(preload).toHaveCount(1);
  const mascot = page.getByTestId("hero-mascot");
  await expect(mascot).toBeVisible();
  const current = await mascot.evaluate((img: HTMLImageElement) =>
    new URL(img.currentSrc).pathname,
  );
  expect(await preload.getAttribute("imagesrcset")).toContain(current);
  expect(await preload.getAttribute("imagesizes")).toBe(await mascot.getAttribute("sizes"));
});

test.describe("hero motion", () => {
  test("mascot and ticker animate, pause and resume from one bilingual control", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const mascot = page.getByTestId("hero-mascot");
    const ticker = page.getByTestId("marquee-track");
    await expect.poll(() => playStates(mascot)).toEqual(["running"]);
    await expect.poll(() => playStates(ticker)).toEqual(["running"]);

    await page.getByRole("button", { name: "Pause animation", exact: true }).click();
    await expect.poll(() => playStates(mascot)).toEqual(["paused"]);
    await expect.poll(() => playStates(ticker)).toEqual(["paused"]);
    const frozen = await transformOf(mascot);
    // Two animation frames later the paused mascot has not moved.
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    expect(await transformOf(mascot)).toBe(frozen);

    await page.getByRole("button", { name: "TH", exact: true }).click();
    const play = page.getByRole("button", { name: "เล่นภาพเคลื่อนไหว", exact: true });
    await expect(play).toBeVisible();
    await play.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "หยุดภาพเคลื่อนไหว", exact: true }),
    ).toBeVisible();
    await expect.poll(() => playStates(mascot)).toEqual(["running"]);
    await expect.poll(() => playStates(ticker)).toEqual(["running"]);
  });

  test("reduced motion stops all continuous motion and hides the pause control", async ({
    page,
  }) => {
    // playwright.config.ts already emulates reduced motion; make it explicit here.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("hero-mascot")).toBeVisible();
    expect(await playStates(page.getByTestId("hero-mascot"))).toEqual([]);
    expect(await playStates(page.getByTestId("marquee-track"))).toEqual([]);
    await expect(page.getByRole("button", { name: /animation/i })).toHaveCount(0);
    // Duplicate ticker copies used for the seamless loop are removed.
    await expect(page.locator(".marquee-copy").first()).toBeHidden();
    await expect(page.getByRole("list", { name: "Focus areas" })).toBeVisible();
  });
});

test.describe("01 expertise cards", () => {
  test("selecting a card updates the detail panel, with mouse and keyboard", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Areas of expertise" });
    const fullStack = tabs.getByRole("tab", { name: /Full-stack development/ });
    const architecture = tabs.getByRole("tab", { name: /Software architecture/ });
    const ai = tabs.getByRole("tab", { name: /AI & automation/ });
    const panel = page.getByRole("tabpanel");

    await expect(fullStack).toHaveAttribute("aria-selected", "true");
    await expect(panel).toHaveCount(1);
    await expect(panel).toContainText("Full-stack development");
    await expect(panel).toContainText("React Native / Tauri");

    await architecture.click();
    await expect(architecture).toHaveAttribute("aria-selected", "true");
    await expect(fullStack).toHaveAttribute("aria-selected", "false");
    await expect(panel).toContainText("domain-driven design");
    await expect(panel).toContainText("Docker / Kubernetes");
    await expect(panel).not.toContainText("React Native / Tauri");

    // Cards stack on desktop (vertical tabs) and sit in a row on mobile.
    const nextKey = testInfo.project.name === "mobile" ? "ArrowRight" : "ArrowDown";
    await architecture.focus();
    await page.keyboard.press(nextKey);
    await expect(ai).toBeFocused();
    await expect(ai).toHaveAttribute("aria-selected", "true");
    await expect(panel).toContainText("Langfuse");

    await page.getByRole("button", { name: "TH", exact: true }).click();
    await expect(page.getByRole("tablist", { name: "ด้านความเชี่ยวชาญ" })).toBeVisible();
    await expect(page.getByRole("tabpanel")).toContainText("AI และระบบอัตโนมัติ");
  });

  test.describe("with motion", () => {
    test.use({ reducedMotion: "no-preference" });

    test("the selection indicator moves to the new card and the panel fades in", async ({
      page,
    }) => {
      await page.goto("/");
      const tabs = page.getByRole("tablist", { name: "Areas of expertise" });
      const fullStack = tabs.getByRole("tab", { name: /Full-stack development/ });
      const architecture = tabs.getByRole("tab", { name: /Software architecture/ });
      const indicator = page.getByTestId("expertise-indicator");
      await expect(indicator).toHaveCount(1);
      await expect(fullStack.getByTestId("expertise-indicator")).toHaveCount(1);

      await architecture.click();
      await expect(architecture).toHaveAttribute("aria-selected", "true");
      await expect(indicator).toHaveCount(1);
      await expect(architecture.getByTestId("expertise-indicator")).toHaveCount(1);
      const panel = page.getByRole("tabpanel");
      await expect(panel).toContainText("domain-driven design");
      await expect.poll(() => panel.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      await expect
        .poll(() => panel.evaluate((el) => getComputedStyle(el).transform))
        .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    });
  });

  test("reduced motion swaps the panel instantly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /AI & automation/ }).click();
    const panel = page.getByRole("tabpanel");
    await expect(panel).toContainText("Langfuse");
    expect(await panel.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    // Only the 0.01ms reduced-motion colour transitions may exist, and they end at once.
    await expect
      .poll(() =>
        page.evaluate(
          () => document.getAnimations().filter((a) => a.playState === "running").length,
        ),
      )
      .toBe(0);
  });
});

async function trackScroll(page: Page) {
  return page.locator("#project-track").evaluate((el) => el.scrollLeft);
}

// Scroll offsets the carousel rests on: each slide's start, clamped to the end.
async function carouselStops(page: Page) {
  return page.locator("#project-track").evaluate((el) => {
    const max = el.scrollWidth - el.clientWidth;
    const stops: number[] = [];
    for (const slide of el.children) {
      const left = Math.round(Math.min((slide as HTMLElement).offsetLeft, max));
      if (stops.length === 0 || left - stops[stops.length - 1] > 1) stops.push(left);
    }
    return stops;
  });
}

async function expectTrackAt(page: Page, left: number) {
  await expect
    .poll(async () => Math.abs((await trackScroll(page)) - left))
    .toBeLessThanOrEqual(1);
}

test.describe("03 selected projects", () => {
  test("carousel arrows step one card at a time and wrap at both ends", async ({
    page,
  }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Project slides" });
    await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    await expect(carousel.getByRole("group")).toHaveCount(3);
    await expect(carousel.getByRole("group").first()).toHaveAttribute("aria-label", "1 of 3");
    const prev = page.getByRole("button", { name: "Previous projects" });
    const next = page.getByRole("button", { name: "Next projects" });
    await expect(prev).toBeEnabled();
    await expect(next).toBeEnabled();

    const stops = await carouselStops(page);
    expect(stops.length).toBeGreaterThan(1);
    expect(stops[0]).toBe(0);
    // Each press moves to the next card's start; past the last it wraps to the first.
    const status = page.getByTestId("carousel-status");
    await expect(status).toHaveText("Slide 1 of 3");
    for (const target of [...stops.slice(1), 0]) {
      await next.click();
      await expectTrackAt(page, target);
    }
    await expect(next).toBeFocused();
    await expect(status).toHaveText("Slide 1 of 3");

    await prev.focus();
    await page.keyboard.press("Enter");
    await expectTrackAt(page, stops[stops.length - 1]);
    await expect(prev).toBeFocused();
    // The status names the first card in view; the last stop always shows a later card.
    await expect(status).toHaveText(/^Slide [23] of 3$/);
    await page.keyboard.press("Enter");
    await expectTrackAt(page, stops[stops.length - 2]);

    await page.getByRole("button", { name: "TH", exact: true }).click();
    await expect(page.getByRole("button", { name: "โปรเจกต์ถัดไป" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "โปรเจกต์ก่อนหน้า" })).toBeEnabled();
    await expect(status).toHaveText(/^สไลด์ \d จาก 3$/);
  });

  test("mobile shows one card per view and swipes between cards", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "desktop",
      "Checks the one-card-per-view phone layout; desktop shows several cards.",
    );
    await page.goto("/");
    const track = page.locator("#project-track");
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(3);
    const view = await track.boundingBox();
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(Math.abs(first!.width - view!.width)).toBeLessThanOrEqual(1);
    // The second card sits beside the first, outside the view, not below it.
    expect(Math.abs(second!.y - first!.y)).toBeLessThanOrEqual(1);
    expect(second!.x).toBeGreaterThanOrEqual(view!.x + view!.width);
    // Manual scrolling still works and snaps to a card.
    await track.evaluate((el) => el.scrollBy({ left: el.clientWidth * 0.8 }));
    const stops = await carouselStops(page);
    await expectTrackAt(page, stops[1]);
  });

  test("no autoplay and no slide pause control under reduced motion", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: "Next projects" })).toBeVisible();
    await expect(page.getByRole("button", { name: /project slides/ })).toHaveCount(0);
    await expect(page.getByTestId("carousel-status")).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(12_000);
    expect(await trackScroll(page)).toBe(0);
  });
});

test.describe("03 carousel autoplay", () => {
  test.use({ reducedMotion: "no-preference" });

  test("advances every 4 seconds, wraps, and stops with the pause control", async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const track = page.locator("#project-track");
    const status = page.getByTestId("carousel-status");
    const pause = page.getByRole("button", { name: "Pause project slides" });
    await expect(pause).toBeVisible();
    await expect(status).toHaveAttribute("aria-live", "off");
    const stops = await carouselStops(page);

    for (const target of [...stops.slice(1), 0]) {
      await page.clock.runFor(4_100);
      await expectTrackAt(page, target);
    }

    await pause.click();
    const play = page.getByRole("button", { name: "Play project slides" });
    await expect(play).toBeVisible();
    await expect(status).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(12_000);
    expect(await trackScroll(page)).toBe(0);

    await page.getByRole("button", { name: "TH", exact: true }).click();
    // Longer Thai copy above pushes the carousel down; bring it back into view.
    await track.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "เล่นสไลด์โปรเจกต์" }).click();
    await expect(page.getByRole("button", { name: "หยุดสไลด์โปรเจกต์" })).toBeVisible();
    await page.clock.runFor(4_100);
    await expectTrackAt(page, stops[1]);
  });

  test("waits while hovered, while focus is inside, and when page motion is paused", async ({
    page,
  }) => {
    await page.clock.install();
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const track = page.locator("#project-track");
    const status = page.getByTestId("carousel-status");
    await expect(page.getByRole("button", { name: "Pause project slides" })).toBeVisible();

    await track.hover();
    await expect(status).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(8_000);
    expect(await trackScroll(page)).toBe(0);
    await page.mouse.move(0, 0);
    await expect(status).toHaveAttribute("aria-live", "off");

    // Keyboard focus on an arrow holds it (reached with Tab from Previous).
    await page.getByRole("button", { name: "Previous projects" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Next projects" })).toBeFocused();
    await expect(status).toHaveAttribute("aria-live", "polite");
    await page.clock.runFor(8_000);
    expect(await trackScroll(page)).toBe(0);
    await page.getByRole("button", { name: "Next projects" }).blur();
    await expect(status).toHaveAttribute("aria-live", "off");

    // The hero's page-level pause control also stops the carousel.
    await page.getByRole("button", { name: "Pause animation", exact: true }).click();
    await expect(page.getByRole("button", { name: "Play project slides" })).toBeAttached();
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.clock.runFor(8_000);
    expect(await trackScroll(page)).toBe(0);
  });
});

test.describe("03 carousel autoplay after manual moves", () => {
  test.use({ reducedMotion: "no-preference" });

  test("a mouse click on an arrow steps once and autoplay carries on", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    const status = page.getByTestId("carousel-status");
    const stops = await carouselStops(page);
    const next = page.getByRole("button", { name: "Next projects" });
    // Click once the header has finished revealing. A click on a still-moving target
    // makes Playwright re-scroll the page, which would move the carousel offscreen.
    await expect
      .poll(() =>
        next.evaluate((el) => getComputedStyle(el.closest("[data-reveal]")!).transform),
      )
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await next.click();
    await expectTrackAt(page, stops[1]);
    // Focus stays on the clicked arrow, but a pointer click does not hold the carousel.
    await expect(page.getByRole("button", { name: "Pause project slides" })).toBeVisible();
    await expect(status).toHaveAttribute("aria-live", "off");
    await page.clock.runFor(4_100);
    await expectTrackAt(page, stops.length > 2 ? stops[2] : 0);
  });
});

test.describe("full-page sections and navigation", () => {
  const ids = ["top", "about", "experience", "projects", "recognition", "education", "contact"];

  test("every section is at least one viewport tall below the header and never clips", async ({
    page,
  }) => {
    await page.goto("/");
    const header = await page.locator("header").evaluate((el) => el.offsetHeight);
    const viewport = page.viewportSize()!.height;
    for (const id of ids) {
      const box = await page.locator(`#${id}`).evaluate((el) => ({
        height: el.getBoundingClientRect().height,
        overflow: el.scrollHeight - el.clientHeight,
      }));
      // The 1px header border may overlap the section; allow it.
      expect(box.height, id).toBeGreaterThanOrEqual(viewport - header);
      expect(box.overflow, id).toBeLessThanOrEqual(1);
    }
  });

  test("reduced motion keeps in-page navigation instant", async ({ page }) => {
    await page.goto("/");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe("auto");
  });
});

test.describe("smooth navigation", () => {
  test.use({ reducedMotion: "no-preference" });

  const sectionTop = (page: Page, id: string) =>
    page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top));
  const headerHeight = (page: Page) =>
    page.locator("header").evaluate((el) => el.getBoundingClientRect().height);

  test("desktop nav links scroll smoothly and land under the header", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "The inline nav only renders at lg; the mobile project covers the sheet menu.",
    );
    await page.goto("/");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe("smooth");
    const header = await headerHeight(page);
    const nav = page.getByRole("navigation", { name: "Navigation" });
    await nav.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect.poll(() => sectionTop(page, "projects")).toBeGreaterThanOrEqual(header - 2);
    await expect.poll(() => sectionTop(page, "projects")).toBeLessThanOrEqual(header);
    await expect(nav.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("mobile menu closes, then scrolls smoothly to the section and focuses it", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "desktop",
      "The sheet menu only renders below lg; the desktop project covers inline links.",
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    const menu = page.getByRole("dialog");
    await menu.getByRole("link", { name: "Recognition", exact: true }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#recognition$/);
    const header = await headerHeight(page);
    await expect.poll(() => sectionTop(page, "recognition")).toBeGreaterThanOrEqual(header - 2);
    await expect.poll(() => sectionTop(page, "recognition")).toBeLessThanOrEqual(header);
    await expect(page.locator("#recognition")).toBeFocused();
  });
});

test.describe("scroll reveals", () => {
  test("reduced motion renders every section without reveal styles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".experience-row")).toHaveCount(3);
    await expect(page.locator("[data-reveal]")).toHaveCount(0);
    expect(
      await page.locator(".achievement-row").last().evaluate((el) => getComputedStyle(el).opacity),
    ).toBe("1");
  });

  test.describe("with motion", () => {
    test.use({ reducedMotion: "no-preference" });

    test("content fades in when reached, including after a direct anchor jump", async ({
      page,
    }) => {
      await page.goto("/#contact");
      // A deep link brings its section into view even though sections render after load.
      await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
      const heading = page.getByRole("heading", { name: "Good work starts with a conversation" });
      await expect.poll(() => heading.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      const row = page.locator(".experience-row").first();
      expect(await row.getAttribute("data-reveal")).toBe("");
      await row.scrollIntoViewIfNeeded();
      await expect.poll(() => row.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    });

    test("print shows content that was never scrolled into view", async ({ page }) => {
      await page.goto("/");
      await page.emulateMedia({ media: "print" });
      const last = page.locator(".achievement-row").last();
      expect(await last.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      expect(await last.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    });
  });
});

test.describe("03 project dialog", () => {
  test("project dialog opens from a card and closes with both close buttons", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", {
      name: "Explore project: AI Workflow Engine",
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "AI Workflow Engine" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("LangChain");
    await dialog.getByRole("button", { name: "Close project details" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.getByRole("button", { name: "TH", exact: true }).click();
    await page
      .getByRole("button", { name: "ดูรายละเอียดผลงาน: Digital Asset Infra" })
      .click();
    const thai = page.getByRole("dialog", { name: "Digital Asset Infra" });
    await expect(thai).toContainText("สมาร์ตคอนแทรกต์");
    await thai.getByRole("button", { name: "ปิด", exact: true }).click();
    await expect(thai).toBeHidden();
  });
});
