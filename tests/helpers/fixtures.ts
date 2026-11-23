import { test as base, expect } from '@playwright/test';

// Every spec imports `test` from here. Google Fonts is stubbed with an empty
// stylesheet so runs never reach a real service and stay deterministic offline;
// text falls back to the bundled Noto Sans Thai and system fonts.
export const test = base.extend<{ blockWebFonts: void }>({
  blockWebFonts: [
    async ({ context }, use) => {
      await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
        route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect };
