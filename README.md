# Personal website

React, TypeScript, Vite, and Tailwind CSS.

## Development

Use Node.js 22.13+ (22.x) or Node.js 24+.

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm run build
```

`npm run preview` serves the production build locally.

ESLint uses `eslint.config.js`. Tailwind CSS is imported in `src/index.css`
and compiled through `@tailwindcss/postcss`.

TypeScript is kept on the latest 6.0 patch because the latest
`@typescript-eslint/parser` does not yet support TypeScript 7.
