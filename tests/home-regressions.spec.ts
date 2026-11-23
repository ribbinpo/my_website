import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./helpers/fixtures";

// QA regressions for the Studio 01 home page redesign.

test.describe("ticker under reduced motion", () => {
  test("every focus area stays readable when the ticker stops", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const list = page.getByRole("list", { name: "Focus areas" });
    await expect(list.getByRole("listitem")).toHaveCount(4);
    // The stopped ticker must wrap inside its clipping box instead of
    // hiding the items that do not fit on one line.
    const clipped = await list.evaluate((ul) => {
      const clip = ul.closest(".overflow-hidden")!.getBoundingClientRect();
      return [...ul.children]
        .filter((li) => {
          const box = li.getBoundingClientRect();
          return box.left < clip.left - 1 || box.right > clip.right + 1;
        })
        .map((li) => li.textContent);
    });
    expect(clipped).toEqual([]);
  });
});

test.describe("project carousel focus", () => {
  test("keyboard focus stays on the arrow while the carousel wraps past either end", async ({
    page,
  }) => {
    await page.goto("/");
    const next = page.getByRole("button", { name: "Next projects" });
    const prev = page.getByRole("button", { name: "Previous projects" });
    const track = page.locator("#project-track");
    const max = await track.evaluate((el) => el.scrollWidth - el.clientWidth);
    // Previous from the first card wraps to the end instead of disabling itself.
    await prev.focus();
    await page.keyboard.press("Enter");
    await expect
      .poll(() => track.evaluate((el, max) => Math.abs(el.scrollLeft - max), max))
      .toBeLessThanOrEqual(1);
    await expect(prev).toBeEnabled();
    await expect(prev).toBeFocused();
    // Next from the last card wraps to the start.
    await next.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBe(0);
    await expect(next).toBeEnabled();
    await expect(next).toBeFocused();
  });
});

// The layout loop in profile.spec.ts stops at 390px; the header switches to the
// "t" mark below 384px, so cover the narrow phones here.
for (const width of [320, 375]) {
  for (const locale of ["en", "th"] as const) {
    test(`header fits a ${width}px phone in ${locale}`, async ({ page }, testInfo) => {
      test.skip(
        testInfo.project.name !== "mobile",
        `Sets its own ${width}px phone viewport; the mobile project runs it.`,
      );
      await page.setViewportSize({ width, height: 740 });
      await page.addInitScript(
        (locale) => localStorage.setItem("profile-language", locale),
        locale,
      );
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const header = page.getByRole("banner");
      // The visible name drops away, but the home link keeps its accessible name.
      await expect(header.getByRole("link", { name: /Teerawut/ })).toBeVisible();
      for (const name of ["EN", "TH"]) {
        await expect(header.getByRole("button", { name, exact: true })).toBeVisible();
      }
      const boxes = await header.evaluate((el) =>
        [...el.querySelectorAll("a, button")]
          .filter((node) => (node as HTMLElement).offsetParent)
          .map((node) => {
            const box = node.getBoundingClientRect();
            return { left: box.left, right: box.right, height: box.height };
          }),
      );
      expect(Math.max(...boxes.map((box) => box.right))).toBeLessThanOrEqual(width);
      const sorted = [...boxes].sort((a, b) => a.left - b.left);
      for (let i = 1; i < sorted.length; i++)
        expect(sorted[i].left).toBeGreaterThanOrEqual(sorted[i - 1].right - 0.5);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBe(true);
    });
  }
}

for (const theme of ["light", "dark"] as const) {
  test(`axe passes on the real page with motion enabled in ${theme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: theme });
    await page.goto("/");
    // The Pause control only renders when motion is allowed, so the default
    // reduced-motion axe runs never see it.
    await expect(page.getByRole("button", { name: "Pause animation" })).toBeVisible();
    const audit = async () =>
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations;
    expect(await audit()).toEqual([]);
    await page.getByRole("button", { name: "Pause animation" }).click();
    await expect(page.getByRole("button", { name: "Play animation" })).toBeVisible();
    // The page-level pause also stops the project carousel, so its control reads Play.
    await expect(page.getByRole("button", { name: "Play project slides" })).toBeAttached();
    await page.getByRole("button", { name: "TH", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
    expect(await audit()).toEqual([]);
  });
}

// QA regressions for the full-page sections / smooth motion change.
test.describe("full-page sections QA regressions", () => {
  test("a malformed URL fragment does not blank the page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // "%E0%A4%A" is an incomplete percent-escape: decodeURIComponent throws on it.
    await page.goto("/#%E0%A4%A");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#contact")).toBeAttached();
    expect(errors).toEqual([]);
  });

  test("the carousel and its cards are hidden from assistive tech while a dialog is open", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Explore project: AI Workflow Engine" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    // Everything outside the modal dialog must be aria-hidden, including the
    // aria-live carousel track, which Radix's hideOthers otherwise leaves exposed.
    await expect(page.getByRole("region", { name: "Project slides" })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Explore project: Digital Asset Infra" }),
    ).toHaveCount(0);
  });

  test.describe("with motion", () => {
    test.use({ reducedMotion: "no-preference" });

    test("autoplay still runs after arriving at Projects from the mobile menu", async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name === "desktop",
        "The sheet menu only renders below lg; desktop links do not move focus to the section.",
      );
      await page.clock.install();
      await page.goto("/");
      await page.getByRole("button", { name: "Open navigation" }).tap();
      await page.getByRole("dialog").getByRole("link", { name: "Projects", exact: true }).tap();
      // Flush the requestAnimationFrame the menu uses to focus and scroll to the section.
      await page.clock.runFor(100);
      await expect(page.locator("#projects")).toBeFocused();
      const track = page.locator("#project-track");
      await expect(track).toBeInViewport({ ratio: 0.5 });
      // The toggle says the slides are playing, so they must actually advance.
      await expect(page.getByRole("button", { name: "Pause project slides" })).toBeVisible();
      const second = await track.evaluate(
        (el) => (el.children[1] as HTMLElement).offsetLeft,
      );
      await page.clock.runFor(4_100);
      await expect
        .poll(() => track.evaluate((el) => el.scrollLeft))
        .toBeGreaterThanOrEqual(second - 1);
    });
  });
});
