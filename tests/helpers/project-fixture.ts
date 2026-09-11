import type { Page } from '@playwright/test';

// Browser-only examples keep project interaction tests independent of portfolio content.
export async function openProjectFixture(page: Page) {
  const description = { en: 'Example project using EIP-681', th: 'ตัวอย่างโครงการ EIP-681' };
  const projects = [
    ['crm', 'CRM System', 'web'],
    ['sbm', 'SBM Website', 'web'],
    ['transcrypt', 'Transcrypt V2', 'blockchain'],
    ['wallet', 'Fin Wallet', 'blockchain'],
    ['rabbit', 'Rabbit Rewards', 'web'],
  ].map(([id, name, category]) => ({
    id, name, category, company: 'Test fixture', kind: description,
    summary: description, challenge: description, contributions: [description],
    outcome: description, tags: [],
  }));
  await page.route('**/src/data/side-projects.ts*', route => route.fulfill({
    contentType: 'application/javascript',
    body: `export const SIDE_PROJECTS = ${JSON.stringify(projects)};
      export const PROJECT_CATEGORY_LABELS = {
        web: { en: 'Web & AI', th: 'เว็บและ AI' },
        blockchain: { en: 'Blockchain & Mobile', th: 'บล็อกเชนและมือถือ' }
      };`,
  }));
  await page.goto('http://127.0.0.1:4174/');
}
