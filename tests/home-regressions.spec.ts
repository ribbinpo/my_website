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
  test("keyboard focus stays on a carousel control when an end is reached", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "Carousel controls only render at the lg breakpoint.",
    );
    await page.goto("/");
    const next = page.getByRole("button", { name: "Next projects" });
    const prev = page.getByRole("button", { name: "Previous projects" });
    await next.focus();
    await page.keyboard.press("Enter");
    await expect(next).toBeDisabled();
    // A disabled button cannot keep focus; it must not fall back to <body>.
    await expect
      .poll(() => page.evaluate(() => document.activeElement !== document.body))
      .toBe(true);
    await expect(prev).toBeFocused();
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
  }, testInfo) => {
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
    if (testInfo.project.name === "desktop") {
      await page.getByRole("button", { name: "Next projects" }).click();
      await expect(page.getByRole("button", { name: "Previous projects" })).toBeEnabled();
    }
    await page.getByRole("button", { name: "TH", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "th");
    expect(await audit()).toEqual([]);
  });
}
