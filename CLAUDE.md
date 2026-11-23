# CLAUDE.md

Guidance for Claude Code when working in this repository.

---

## Project Overview

- **Name:** my_website
- **Purpose:** Bilingual (English/Thai) personal Software Engineer profile site with an interactive 3D hero.
- **Status:** active development
- **Owners:** repository owner (solo project)

## Tech Stack

| Layer          | Choice                                                     |
| -------------- | ---------------------------------------------------------- |
| Language       | TypeScript 6.0 (stay on 6.0: TypeScript ESLint doesn't support 7 yet) |
| Framework      | React 19 + Vite 8                                          |
| Styling        | Tailwind CSS 4, design tokens in `src/index.css`           |
| Components     | shadcn/ui (Radix) in `src/components/ui`, config in `components.json` |
| Motion / 3D    | Framer Motion, Three.js (lazy-loaded hero scene)           |
| State / data   | Local React state + `src/hooks/use-preferences.ts`; static content in `src/data/` |
| Unit testing   | None yet                                                   |
| E2E testing    | Playwright + `@axe-core/playwright` (`tests/`)             |
| Browsers       | Evergreen browsers                                         |
| Package mgr    | npm (Node 22.13+ or 24+)                                   |
| Build / Deploy | Static `dist/`. No CI or hosting config in the repo yet    |

## Repository Layout

```
my_website/
├── src/
│   ├── components/   # hero/, home/, layout/, social/, ui/ (shadcn)
│   ├── data/         # profile.ts, side-projects.ts: all bilingual content
│   ├── hooks/        # use-preferences (language/theme, storage fallback)
│   ├── views/        # home.view.tsx
│   ├── layouts/      # main.layout.tsx
│   ├── configs/ constants/ lib/
│   └── index.css     # Tailwind theme + design tokens
├── tests/            # Playwright specs + helpers/project-fixture.ts
├── docs/CV.pdf       # Bundled unchanged as the CV download
├── public/
└── .claude/          # dev, qa, ops agents, hooks, skills
```

## Commands

```bash
npm ci                                # Install dependencies (exact lockfile)
npm run dev                           # Dev server on http://localhost:5173
npm run build                         # tsc + production build
npm run preview                       # Serve the production build (http://localhost:4173)
npm test                              # Playwright E2E (builds + starts preview on 4173 and a fixture dev server on 4174)
npx playwright test <file> --project=desktop   # One spec, one project
PLAYWRIGHT_CHANNEL=chrome npm test    # Use installed Chrome instead of Playwright's Chromium
npm run lint                          # ESLint (max-warnings 0)
npx tsc --noEmit                      # Type check
npm audit                             # Dependency audit
```

Always run `npm run lint`, `npx tsc --noEmit` and `npm test` before declaring a change done.

## Architecture

- Single-page app: `main.tsx` → `App.tsx` → `layouts/main.layout.tsx` → `views/home.view.tsx`, which composes the section components.
- All copy lives in `src/data/profile.ts` and `src/data/side-projects.ts` with English and Thai entries side by side. Keep them in sync. Project tabs are derived from `SIDE_PROJECTS` categories, so adding a project needs no UI edits.
- Language and theme are stored as `profile-language` and `profile-theme` in local storage, with an in-memory fallback when storage is unavailable.
- The Three.js hero (`src/components/hero`) is lazy-loaded, pauses when offscreen, hidden or paused, honours reduced motion, falls back to a CSS illustration on WebGL failure, and disposes all resources on unmount.
- No backend or analytics.

## Code Conventions

- Files are kebab-case with a role suffix: `navbar.component.tsx`, `home.view.tsx`, `main.layout.tsx`, `menu.constant.ts`, `contact.config.ts`. Hooks are `use-*.ts`. shadcn files in `src/components/ui` keep their generated names.
- Import through the `@/` alias.
- Reuse `src/components/ui` and the tokens in `src/index.css`. No one-off colors, sizes or spacing values.
- Every user-facing string needs both English and Thai, including accessibility labels.
- Semantic HTML first: `<button>` for actions, `<a>` for navigation. Reach for ARIA only when no native element fits.
- Every interactive element works with a keyboard and has a visible focus state. Text contrast meets WCAG AA in light and dark themes.
- Continuous motion must stop under `prefers-reduced-motion` and have a pause control.
- Prefer platform features (container queries, `:has()`, `<dialog>`, View Transitions) over JS and libraries when supported browsers allow it.
- Only `VITE_`-prefixed variables reach the browser. Never put a secret behind one.
- Images get width and height, or an aspect ratio, and `alt` text. Lazy-load below the fold, never the LCP image.
- Follow the patterns already in the surrounding code before inventing new ones.
- Don't add dependencies without saying why in the PR description.

## Testing Conventions

- E2E specs live under `tests/`, with shared fixtures in `tests/helpers/`. Use web-first assertions (`await expect(locator).toBeVisible()`), never fixed waits. Query by role and label.
- Tests run against the production preview (`baseURL` http://127.0.0.1:4173). The fixture dev server on 4174 is for tests that swap project data.
- `playwright.config.ts` runs every spec in two projects: `desktop` (1440×1000) and `mobile` (`devices['Pixel 7']`). A spec that sets its own viewport or only makes sense at one size skips the other project with `test.skip()` and a reason.
- `playwright.config.ts` keeps evidence: `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'retain-on-failure'`, and the `junit` reporter alongside `html`.
- Accessibility audits use `@axe-core/playwright`, in both themes.
- Every bug fix gets a regression test that fails before the fix.
- No network calls to real services in tests. Mock with Playwright `page.route`.

## Git & PR Workflow

- Branch naming: `feat|fix|chore/<short-description>`
- Commit style: Conventional Commits, e.g. `feat: add project filter`
- Never commit directly to `main`. Never force-push shared branches.
- PRs are opened by the main session at the end of the [Delivery Workflow](#delivery-workflow). Sub-agents don't commit, push or open PRs.

## Environment & Secrets

- No environment variables are required today.
- **Never** commit `.env`, credentials, keys, or tokens. Never print secrets in logs or output.

## Sub-Agents

Project sub-agents live in `.claude/agents/`. Delegate to them for focused work:

| Agent | Use it for                                                                 |
| ----- | -------------------------------------------------------------------------- |
| `dev` | Implementing features, fixing bugs, refactoring application code          |
| `qa`  | Writing/running tests, reviewing changes for bugs, verifying acceptance criteria |
| `ops` | Checking and fixing CI/CD pipelines, Dockerfile and docker-compose (deploy materials). No secrets, no live infrastructure. |

Invoke one explicitly, e.g. *"Use the qa agent to verify the login change."*

## Delivery Workflow

Every task runs through these steps in order. It isn't complete until a PR is open.

1. **Branch:** if on `main`, create `feat|fix|chore/<short-description>` first.
2. **dev:** implement the change, with tests.
3. **qa:** verify it. On ❌ FAIL, send the bugs back to **dev** and repeat step 3. Stop and ask the user after 3 failed rounds.
4. **ops:** only if the change touches the pipeline, Dockerfile, compose files or anything they depend on (e.g. new env vars, ports, build steps). Otherwise skip.
5. **Open the PR:** the main session does this, not a sub-agent:
   - Commit with the repo's commit style, then `git push -u origin <branch>`.
   - If qa saved screenshots, recordings or reports in `.qa-evidence/`, follow the `attach-pr-evidence` skill and add its block to the body as `## QA evidence`, after `## Verification`.
   - `gh pr create --base main --title "<conventional title>" --body "<body below>"`
   - Open as a **draft** (`--draft`) if qa returned ⚠️ PASS WITH NOTES or ops left items that need a human.
   - Never open a PR while qa is ❌ FAIL.
6. **Finish:** reply with the PR link and a one-line status.

PR body:

```markdown
## Summary
<what changed and why: from dev's report>

## Changes
- <file>: <one line>

## Verification
<qa verdict, checks run and results, tests added>

## Deploy notes
<ops findings, secrets to configure (names only), infrastructure changes needed, or "None">

## Open items
<assumptions, risks, follow-ups>
```

Opening the PR triggers CI. That's expected. Don't merge the PR. A human reviews and merges.

## Browser evidence

For any change a user can see or do, `qa` checks it in a real Chrome browser with the Chrome DevTools MCP server, scoped to qa. It also keeps the captures that the E2E run produces. All of it goes into `.qa-evidence/` (git-ignored):

- Screenshots of each state that proves an acceptance criterion, at **desktop (1440×900) and mobile (390×844)**, in English and Thai and in light and dark themes when the change affects them
- A short screencast of the main happy path at each of the two sizes
- Playwright's JUnit report for both projects, and the screenshots, videos and traces from any failed specs
- A Lighthouse or performance summary when the change could affect accessibility or load time

The Delivery Workflow changes like this:

- **Step 3 (qa):** qa's report includes a **Responsive** result per viewport and an **Evidence** list, with one line per file or desktop/mobile pair.
- **Step 5 (open the PR):** before `gh pr create`, follow the `attach-pr-evidence` skill and add its block as `## QA evidence`, with qa's one-line note under each file.
- No evidence for a user-facing change makes the PR a **draft**. So does evidence at only one size when the change affects layout, unless qa says why the other doesn't apply. Say why under Open items.
- The reviewer checks the evidence before merging. It doesn't replace a preview deploy for risky changes.

## Guardrails

- Hard blocks (secret files, live infrastructure CLIs, IaC edits, hosting deploy CLIs, `npm publish`, `gh pr merge`, force-push) are enforced by deny rules in `.claude/settings.json` and by the `.claude/hooks/guard-bash.sh` and `.claude/hooks/guard-web.sh` hooks, which also catch wrapped forms (`sh -c`, `eval`, `$(...)`, chains, piping into a shell). Don't try to work around them. If one blocks needed work, tell the user.
- Ask before: deleting files or data, changing CI/CD or infra, or any action touching production.
- Don't modify generated files: `package-lock.json` by hand, `dist/`. Regenerate shadcn components with the CLI rather than rewriting them.
- Don't replace or edit `docs/CV.pdf` unless asked. It's downloaded byte-for-byte and tests check that.
- If requirements are ambiguous, state your assumption and proceed, or ask if the choice is costly to reverse.

## Gotchas

- The Chrome DevTools MCP server needs Node 20+ and a local Chrome. It starts a separate, temporary browser profile, so you're never logged in to anything.
- Playwright needs its browsers installed once per machine: `npx playwright install --with-deps chromium`, or use `PLAYWRIGHT_CHANNEL=chrome`.
- `npm test` runs `npm run build` first via `webServer`. Locally it reuses servers already running on 4173/4174, so a stale `npm run preview` gives stale results. Stop it or rebuild.
- qa should open the app at http://localhost:4173 (preview) for evidence and performance, or http://localhost:5173 (dev) for quick checks. Measure LCP only on the preview build.
- Playwright uses `reducedMotion: 'reduce'`, so animation tests must opt back in explicitly.
- Thai text is longer and wraps differently. Check layouts in both languages.
