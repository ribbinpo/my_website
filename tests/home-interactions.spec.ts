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
});

async function trackScroll(page: Page) {
  return page.locator("#project-track").evaluate((el) => el.scrollLeft);
}

test.describe("03 selected projects", () => {
  test("desktop carousel moves with prev/next buttons and the keyboard", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "The carousel controls only render at the lg breakpoint; mobile shows a stacked list.",
    );
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Project slides" });
    await expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    await expect(carousel.getByRole("group")).toHaveCount(3);
    await expect(carousel.getByRole("group").first()).toHaveAttribute("aria-label", "1 of 3");
    const prev = page.getByRole("button", { name: "Previous projects" });
    const next = page.getByRole("button", { name: "Next projects" });
    await expect(prev).toBeDisabled();
    await expect(next).toBeEnabled();

    await next.click();
    await expect.poll(() => trackScroll(page)).toBeGreaterThan(0);
    await expect(prev).toBeEnabled();
    await expect(next).toBeDisabled();

    await prev.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => trackScroll(page)).toBe(0);
    await expect(prev).toBeDisabled();

    await page.getByRole("button", { name: "TH", exact: true }).click();
    await expect(page.getByRole("button", { name: "โปรเจกต์ถัดไป" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "โปรเจกต์ก่อนหน้า" })).toBeDisabled();
  });

  test("mobile shows projects as a stacked list without carousel controls", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "desktop",
      "Checks the below-lg stacked layout; the desktop project covers the carousel.",
    );
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Next projects" })).toHaveCount(0);
    await expect(page.locator("#projects [aria-roledescription]")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Project slides" })).toHaveCount(0);
    const cards = page.locator(".project-card");
    await expect(cards).toHaveCount(3);
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
  });

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
