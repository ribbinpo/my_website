# Teerawut Saesim — personal profile

A responsive, English/Thai Software Engineer profile built with React, TypeScript,
Vite, Tailwind CSS, and ShadCN/Radix components. Includes light/dark/system themes,
project filters and dialogs, a career timeline, achievements, and a CV download.

## Development

Use Node.js 22.13+ (22.x) or Node.js 24+.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run build
npx playwright install chromium
npm test
npm audit
```

If Google Chrome is already installed, use `PLAYWRIGHT_CHANNEL=chrome npm test`
instead of downloading Chromium. Tests start a production preview and an isolated Vite fixture server automatically
and cover language/theme persistence, keyboard navigation, dialogs, project
filters, clipboard failures, unavailable storage, byte-for-byte CV downloads,
responsive layouts, and accessibility audits. Screenshots go to `test-results/`.

`npm run preview` serves the latest production build locally.

## Content and customization

- Edit `src/data/profile.ts` for bilingual content, contact links, experience,
  skills, and achievements. Keep English and Thai entries in sync.
- Edit `SIDE_PROJECTS` in `src/data/side-projects.ts` to add, remove,
  or reorder project cards. Each entry contains its English/Thai copy, tags,
  filter category (any string), and optional artwork preset
  (`network`, `website`, `payment`, `wallet`, or `survey`; defaults to `website`).
  Use a unique `id`; the existing layout and dialogs render from the constant
  without UI edits. Tabs are derived from unique categories in first-appearance
  order, with All projects first. With no entries, only All projects appears.
  Optional EN/TH category labels live in `PROJECT_CATEGORY_LABELS` in the same file;
  unknown categories display their name.
- Replace `docs/CV.pdf` to update the downloaded CV. Vite bundles the original
  document unchanged, including its contact information.
- Adjust design tokens and responsive styles in `src/index.css`.
- ShadCN components live in `src/components/ui`, with configuration in
  `components.json`. Generated components have localized close-label support.
- Language defaults to English. Theme follows the device until overridden.
  Preferences use `profile-language` and `profile-theme` in local storage,
  with an in-memory fallback when storage is disabled.
- JetBrains Mono headings, Noto Sans body text, and Noto Sans Thai are self-hosted through Fontsource packages.

Content is based on the supplied CV, with the current role updated to Software
Engineer as requested. Project illustrations are abstract graphics, not product
screenshots. No backend or analytics service is required.

TypeScript remains on 6.0 because the current TypeScript ESLint parser does not
yet support TypeScript 7.

## Animation and 3D

Framer Motion handles entrance transitions, project and capability-card hover
feedback, floating technology badges, and the scroll progress indicator. Three.js
is lazy-loaded for the pointer-responsive hero sculpture. It stops drawing when
paused, offscreen, or in a hidden tab. All geometry, materials, observers, and
renderer resources are cleaned up on unmount.

The hero has a pause/play control. Reduced-motion preferences disable continuous
motion automatically; WebGL failure or context loss displays a CSS illustration.
`src/components/hero` contains the scene and its accessible presentation wrapper.
