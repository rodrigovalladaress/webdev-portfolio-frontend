## Repo snapshot

This is a Nuxt 3 + TypeScript static portfolio site that uses Three.js for visuals.
Key folders:

- `components/` — Vue components (note `ThreeJs.client.vue` is client-only)
- `composables/` — Nuxt composables (e.g. `useThree` in `composables/three.ts`)
- `experience/` — Three.js classes (entry: `experience/ThreeExperience.ts`)
- `server/` — Nitro server routes and sample data (`server/api/project.ts`, `server/data/*`)
- `types/` — shared TypeScript types (e.g. `types/project.ts`)

## High-level architecture & why

- Nuxt 3 app with SSR enabled (`ssr: true`) but Nitro configured to produce a static site (`nitro.preset: netlify-static`, `static: true`) so the site is built for Netlify. This means server routes under `server/api/` are used during local dev and may be adapted to serverless functions in production.
- Three.js runtime lives in the `experience/` folder and is instantiated from a client-only Vue component (`components/ThreeJs.client.vue`) via the `useThree` composable. The pattern separates DOM / lifecycle (Vue) from 3D logic (ThreeExperience).
- Project content is stored under `server/data/project/*.json` and optional HTML descriptions under `server/data/project-description/*.html`; the API `server/api/project.ts` reads these files and returns an array of `Project` objects typed by `types/project.ts`.

## Developer workflows (concrete commands)

- Install: project uses pnpm (lockfile present). Run `pnpm install`.
- Dev server: `pnpm dev` — starts Nuxt dev with Nitro API routes available at `/api/*` (e.g. `/api/project`).
- Build (static output for Netlify): `pnpm run build`. Output is `dist` (Netlify config expected). You can run a quick static check with `npx serve dist` as mentioned in the README, or run `pnpm preview` (`nuxt preview`) to preview the production server.
- Playwright tests: devDependency `@playwright/test` present. Tests expect the app running at `http://localhost:3000/`. Typical flow:
  - start dev or preview server (`pnpm dev` or `pnpm preview`)
  - run `npx playwright test` (or `pnpm dlx playwright test`)

## Project-specific conventions & patterns

- Client-only Vue files use the `.client.vue` suffix (see `components/ThreeJs.client.vue`) to avoid SSR.
- The Three.js system uses a composable pattern: `useThree()` (in `composables/three.ts`) returns `{ initialize, destroy, animate }`. Call `initialize(canvas)` from mounted hooks and `destroy()` on unmount.
- Server API reads raw files from `server/data/*` by filename and expects the JSON filename (e.g. `1.json`) to determine the `id` field. Look at `server/api/project.ts` for the exact behavior (it will prefer an HTML description file if present).
- SCSS: global styles and variables are injected into Vite preprocessor options in `nuxt.config.ts` (see `vite.css.preprocessorOptions.scss.additionalData`). If you change SCSS variables, prefer editing files under `assets/`.

## Files to inspect for common tasks (examples)

- Add a new project: add `server/data/project/<n>.json` and optional `server/data/project-description/<n>.html`. API auto-reads them.
- Update 3D behaviour: `experience/ThreeExperience.ts`, `experience/World.ts` and the `composables/three.ts` wrapper. `components/ThreeJs.client.vue` wires lifecycle and route-based animation names (`home`, `projects`, `contact`).
- Routes & pages: `pages/` follows Nuxt file-based routing (e.g. `pages/projects.vue`).

## Tests & CI hints

- Playwright tests live under `tests/`. They expect a running server at `http://localhost:3000/`.
- Linting: ESLint and Stylelint are configured (devDependencies present). `@nuxtjs/eslint-module` and `@nuxtjs/stylelint-module` are enabled — use the project's existing tooling or run `pnpm dev` to pick up dev tooling.

## Quick examples to copy-paste

- instantiate Three.js from a component:

```ts
import { useThree } from '~/composables/three';
const { initialize, destroy, animate } = useThree();
onMounted(() => initialize(canvasEl));
onBeforeUnmount(() => destroy());
```

- server API expectation (project id from filename):

`GET /api/project` -> reads `server/data/project/*.json`, uses filename (e.g. `1.json`) as `id`; optional description override from `server/data/project-description/1.html`.

## When unsure, check these files first

- `nuxt.config.ts` — runtimeConfig, nitro preset, Vite plugins, SCSS injection.
- `server/api/project.ts` — canonical pattern for server-side file-based data.
- `composables/three.ts` + `experience/*` — 3D architecture and lifecycle.
- `types/project.ts` — canonical project shape.

---
If any part is unclear or you'd like me to expand a section (e.g., run/playwright command snippets, CI config for Netlify, or add a short checklist for adding projects), tell me which area to expand and I'll update the file.
