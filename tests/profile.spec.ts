import { openProjectFixture } from "./helpers/project-fixture";
import { SIDE_PROJECTS } from "../src/data/side-projects";
import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("English profile, complete content, links, and original CV download", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("Teerawut Saesim — Software Engineer");
  await expect(page.locator(".project-card")).toHaveCount(SIDE_PROJECTS.length);
  await expect(page.locator(".experience-row")).toHaveCount(3);
  await expect(page.locator(".achievement-row")).toHaveCount(7);
  await expect(page.locator("#contact")).not.toContainText("086");
  await expect(
    page.locator('#contact a[href="https://github.com/ribbinpo"]'),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download CV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Teerawut-Saesim-CV.pdf");
  expect(await readFile((await download.path())!)).toEqual(
    await readFile("docs/CV.pdf"),
  );
  expect(errors).toEqual([]);
});

test("Thai switching translates sections, dialogs, accessibility labels and persists", async ({
  page,
}) => {
  await openProjectFixture(page);
  await page.getByRole("button", { name: "TH", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(page).toHaveTitle("Teerawut Saesim — วิศวกรซอฟต์แวร์");
  await expect(page.locator("#about")).toContainText("เริ่มจากความสงสัย");
  await expect(page.locator("#experience")).toContainText("เม.ย. 2567");
  await expect(page.locator("#education")).toContainText(
    "มหาวิทยาลัยสงขลานครินทร์",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /ผม Teerawut/,
  );
  await page
    .getByRole("button", { name: "ดูรายละเอียดผลงาน: CRM System" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("สิ่งที่ผมพัฒนา");
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("theme follows system, reacts to changes, and remembers manual choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass("dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass("dark");
  await page.getByRole("button", { name: /^Choose theme:/ }).click();
  await page.getByRole("button", { name: /^Choose theme:/ }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.getByRole("button", { name: /^Choose theme:/ }).click();
  await expect(page.locator("[data-theme-mode]")).toHaveAttribute("data-theme-mode", "system");
  await expect(page.locator("html")).not.toHaveClass("dark");
});

test("project filters and keyboard dialog focus management", async ({
  page,
}) => {
  await openProjectFixture(page);
  await page.getByRole("tab", { name: "Web & AI" }).click();
  await expect(page.locator(".project-card")).toHaveCount(3);
  await page.getByRole("tab", { name: "Blockchain & Mobile" }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  const trigger = page.getByRole("button", {
    name: "Explore project: Transcrypt V2",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("EIP-681");
  await page.keyboard.press("Tab");
  expect(
    await dialog.evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole("tab", { name: "All projects" }).click();
  await expect(page.locator(".project-card")).toHaveCount(5);
});

test("mobile navigation, active links, and skip link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  const menu = page.getByRole("dialog");
  await menu.getByRole("link", { name: "Experience", exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page).toHaveURL(/#experience$/);
  await expect(
    page.locator('.desktop-nav a[href="#experience"]'),
  ).toHaveAttribute("aria-current", "location");
});

test("clipboard success and denied clipboard fallback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(
    page.getByText("Email address copied", { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "ribbinpo@gmail.com",
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      value: () => Promise.reject(new Error("Denied")),
    });
  });
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator(".copy-fallback")).toBeVisible();
  await expect(page.locator(".contact-email a")).toHaveAttribute(
    "href",
    "mailto:ribbinpo@gmail.com",
  );
});

test("preferences continue working when storage is unavailable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("Storage disabled");
    };
    Storage.prototype.setItem = () => {
      throw new Error("Storage disabled");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "TH", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await page.getByRole("button", { name: /^เลือกธีม:/ }).click();
  await page.getByRole("button", { name: /^เลือกธีม:/ }).click();
  await expect(page.locator("html")).toHaveClass("dark");
});

for (const width of [390, 768, 1440]) {
  for (const locale of ["en", "th"]) {
    for (const theme of ["light", "dark"]) {
      test(`layout ${width}px / ${locale} / ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 960 });
        await page.addInitScript(
          ({ locale, theme }) => {
            localStorage.setItem("profile-language", locale);
            localStorage.setItem("profile-theme", theme);
          },
          { locale, theme },
        );
        const failedAssets: string[] = [];
        page.on("response", (response) => {
          if (response.status() >= 400) failedAssets.push(response.url());
        });
        await page.goto("/");
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.locator(".robot-garden-art")).toHaveAttribute(
          "data-paused",
          "true",
        );
        await expect(page.locator(".garden-scene")).toHaveCSS("border-radius", "0px");
        await expect(page.locator(".garden-scene")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(page.locator(theme === "light" ? ".robot-day" : ".robot-night")).toHaveCSS("opacity", "1");
        expect(
          await page.evaluate(() =>
            document.fonts.check('16px "JetBrains Mono Variable"'),
          ),
        ).toBe(true);
        expect(
          await page.evaluate(() =>
            document.fonts.check('16px "Noto Sans Variable"'),
          ),
        ).toBe(true);
        if (locale === "th")
          expect(
            await page.evaluate(() =>
              document.fonts.check('16px "Noto Sans Thai Variable"', "ภาษาไทย"),
            ),
          ).toBe(true);
        await page.screenshot({
          path: `test-results/restored-garden-${width}-${locale}-${theme}.png`,
          fullPage: true,
        });
        expect(failedAssets).toEqual([]);
      });
    }
  }
}

for (const theme of ["light", "dark"]) {
  test(`accessible content and controls in ${theme} theme`, async ({
    page,
  }) => {
    await page.addInitScript(
      (theme) => localStorage.setItem("profile-theme", theme),
      theme,
    );
    await openProjectFixture(page);
    const audit = () =>
      new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
    expect((await audit()).violations).toEqual([]);
    await page
      .getByRole("button", { name: "Explore project: CRM System" })
      .click();
    expect((await audit()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "TH", exact: true }).click();
    expect((await audit()).violations).toEqual([]);
  });
}

test("side projects label is localized and restored", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#projects .section-heading .eyebrow")).toHaveText(
    "03 / My side projects",
  );
  await page.getByRole("button", { name: "TH", exact: true }).click();
  await expect(page.locator("#projects .section-heading .eyebrow")).toHaveText(
    "03 / โปรเจกต์ส่วนตัวของผม",
  );
});

test("garden animates, pauses and resumes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "dark" });
  await page.goto("/");
  const host = page.locator(".robot-garden-art");
  const animation = page.locator(".robot-breathing");
  await expect(animation).toHaveCSS("animation-play-state", "running");
  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect(host).toHaveAttribute("data-paused", "true");
  const paused = await animation.evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(150);
  expect(await animation.evaluate(el => getComputedStyle(el).transform)).toBe(paused);
  await page.getByRole("button", { name: "Resume animation", exact: true }).click();
  await expect(host).toHaveAttribute("data-paused", "false");
  await expect.poll(() => animation.evaluate(el => getComputedStyle(el).transform)).not.toBe(paused);
});

test("garden follows the existing theme controls and honors reduced motion", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Choose theme:/ }).click();
  await page.getByRole("button", { name: /^Choose theme:/ }).click();
  await expect(page.locator(".garden-moon")).toHaveCSS("opacity", "1");
  await expect(page.locator(".robot-night")).toHaveCSS("opacity", "1");
  expect(await page.locator(".garden-scene").evaluate(el => el.getAnimations({subtree:true}).length)).toBe(0);
  await page.getByRole("button", { name: "TH", exact: true }).click();
  await expect(page.locator(".garden-scene > svg")).toHaveAccessibleName("หุ่นยนต์ตัวน้อยนอนหลับในสวนใต้แสงจันทร์และดวงดาว");
});

test("theme button cycles all modes with keyboard and reverses robot posture smoothly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await page.goto("/");
  const toggle = page.locator("[data-theme-mode]");
  await expect(toggle).toHaveAttribute("data-theme-mode", "system");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("data-theme-mode", "light");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("data-theme-mode", "dark");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect.poll(() => page.locator(".robot-day").evaluate(el => getComputedStyle(el).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  // Reverse while the robot is still sitting down; system resolves to light.
  await toggle.click();
  await expect(toggle).toHaveAttribute("data-theme-mode", "system");
  await expect(page.locator(".robot-day")).toHaveCSS("opacity", "1");
  await expect(page.locator(".robot-day")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(page.locator(".robot-night")).toHaveCSS("opacity", "0");
  await page.reload();
  await expect(toggle).toHaveAttribute("data-theme-mode", "system");
});
