# Soul Core Hierarchy

[![CI](https://github.com/Rukko/shadow-slave-hierarchy/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Rukko/shadow-slave-hierarchy/actions/workflows/ci.yml)
[![Deploy](https://github.com/Rukko/shadow-slave-hierarchy/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/Rukko/shadow-slave-hierarchy/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/package-json/v/Rukko/shadow-slave-hierarchy)](https://github.com/Rukko/shadow-slave-hierarchy/tags)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fshadow-slave-hierarchy.pages.dev&label=site)](https://shadow-slave-hierarchy.pages.dev)
[![Preact](https://img.shields.io/github/package-json/dependency-version/Rukko/shadow-slave-hierarchy/preact?logo=preact)](https://preactjs.com)
[![Vite](https://img.shields.io/github/package-json/dependency-version/Rukko/shadow-slave-hierarchy/dev/vite?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/Rukko/shadow-slave-hierarchy/dev/typescript?logo=typescript)](https://www.typescriptlang.org)

An interactive guide to the soul core hierarchy of _Shadow Slave_: seven ranks walked in two directions, the path of corruption for Nightmare Creatures and the path of ascension for Awakened humans, with classes counted by soul cores.

The page includes:

- **Soul Sea**: a canvas where every soul core burns as a sun. Rank sets how high and bright the suns rise, cores set how many. Its Nephis / Sunny toggle switches the light and dark themes.
- **Ranks and classes at a glance**: one table with every rank, its human colloquial name and the class it pairs with. Phones start on a compact version that fits without scrolling, with a toggle back to the full table.
- **Power maps**: two heatmaps of raw power for every rank and class combination. Click two cells to send a battle to the matchup.
- **Who wins?**: compares two creatures or two humans and reports the ratio of raw power.
- **Two paths, one ladder**: SVG charts that morph between a split axis and a single joined axis.

## Tech stack

- [Preact](https://preactjs.com) components in [TypeScript](https://www.typescriptlang.org): the same JSX and hooks as React, in a few kilobytes
- [Vite](https://vite.dev) for the dev server and the build
- [Vitest](https://vitest.dev) for the pure logic
- [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- [pnpm](https://pnpm.io) as the package manager

## Getting started

Requires Node.js 24 or later. The pnpm version is pinned in `package.json`, and [Corepack](https://nodejs.org/api/corepack.html) picks it up:

```sh
corepack enable
pnpm install
pnpm dev
```

## Scripts

| Script              | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `pnpm dev`          | Starts the dev server with hot reload              |
| `pnpm build`        | Type-checks and builds the static site into `dist` |
| `pnpm preview`      | Serves the production build locally                |
| `pnpm test`         | Runs the unit tests once                           |
| `pnpm lint`         | Lints the code                                     |
| `pnpm typecheck`    | Type-checks without emitting                       |
| `pnpm format`       | Formats every file                                 |
| `pnpm format:check` | Checks formatting without writing                  |

## Project structure

```
.
├── index.html                 Head, social tags and the #app mount point
├── public/                    Files copied as-is (icons, social preview image)
├── src/
│   ├── main.tsx               Entry point, renders <App /> into #app
│   ├── data/
│   │   ├── hierarchy.ts       Ranks, classes, descriptions and presets
│   │   └── power-tables.ts    Power points, as formulas or 7 x 7 matrices
│   ├── components/
│   │   ├── App.tsx            Page layout and shared state (theme, current battle)
│   │   ├── Hero.tsx           Title, lede and legend
│   │   ├── hierarchy/         Ranks and classes table: full, compact for phones, and the toggle
│   │   ├── soul-sea/          Hero canvas: component and its drawing loop
│   │   ├── power-map/         Heatmaps and the battle picker
│   │   ├── matchup/           "Who wins?": fighter cards and verdict
│   │   ├── ladder/            SVG charts: geometry, frame, axes and series
│   │   └── shared/            Section wrapper and the segmented toggle
│   ├── hooks/                 useInView, useEntrance, useCountUp, useMediaQuery
│   ├── lib/                   Pure helpers (power, formatting, math, motion, labels) and their tests
│   └── styles/                Design tokens, base styles and one stylesheet per section
└── .github/workflows/         CI and Cloudflare Pages deployment
```

## CSS conventions

- Class names follow [BEM](https://getbem.com): `block__element--modifier`, for example `heatmap__cell--creature`. Each block lives in the stylesheet of its section.
- Temporary states use `is-` classes set by the components (`is-active`, `is-playing`). Pressed buttons use `aria-pressed`.
- Colors, fonts and timings are custom properties in `src/styles/tokens.css`. The light theme only redefines them.
- Values computed from data, such as a heatmap cell's color intensity, are passed as custom properties (`--t`) set from TypeScript, and the stylesheets decide what to do with them.

## Component conventions

If you know React, you already know most of this code. A few Preact details are worth knowing:

- Use `className`, as in React. Preact also accepts `class`, but the code sticks to one.
- Write SVG attributes in kebab-case (`text-anchor`, `stroke-width`). Preact sets attribute names as given, so React's camelCase forms are silently ignored by the browser.
- Name refs with a `Ref` suffix (`canvasRef`). The hooks lint rules only recognize refs from React's `useRef`, and the suffix is how they tell a Preact ref apart.
- Hooks come from `preact/hooks`, types like `RefObject` from `preact`.

## How power is computed

Every section reads its numbers from two power tables in `src/data/power-tables.ts`, one for creatures and one for humans. Today both are formulas:

- **Nightmare Creatures**: rank points times class points, from the reference chart.
- **Awakened humans**: rank points times a base of 10, plus a small reserve that grows with the class. The reference chart covers creatures only, so the human values are an assumption.

The points measure raw power only. Abilities, will and Domains are left out, which is why the matchup only compares a creature with a creature or a human with a human.

## Collaboration

The numbers on this page are a fan's estimate. The best possible source would be the author: if you know how the ranks and classes really compare, your numbers can replace the estimate.

### Sending numbers

There is no need to touch code. Fill one grid per path with how strong each combination is, in any unit you like, as long as the cells are comparable with each other. Only the ratios between cells matter. Then [open an issue](https://github.com/Rukko/shadow-slave-hierarchy/issues) or send them any other way.

| Rank / Class          | Beast | Monster | Demon | Devil | Tyrant | Terror | Titan |
| --------------------- | ----- | ------- | ----- | ----- | ------ | ------ | ----- |
| 7 Unholy / Divine     |       |         |       |       |        |        |       |
| 6 Cursed / Sacred     |       |         |       |       |        |        |       |
| 5 Great / Supreme     |       |         |       |       |        |        |       |
| 4 Corrupted / Transc. |       |         |       |       |        |        |       |
| 3 Fallen / Ascended   |       |         |       |       |        |        |       |
| 2 Awakened            |       |         |       |       |        |        |       |
| 1 Dormant             |       |         |       |       |        |        |       |

A rule works too, for example "each rank is worth this much and each class multiplies it by that much".

### Entering them

Each table in `src/data/power-tables.ts` can be written in either of two ways:

- **Formula** (`kind: 'formula'`): one list of points per rank, one per class, and a `combine` function that turns them into a cell's power. Use it when the numbers follow a rule.
- **Matrix** (`kind: 'matrix'`): the 49 values written out as `values[rank][class]`, Dormant first and Beast first. Use it when the numbers are given cell by cell.

The file carries a ready-to-edit matrix example. A matrix has no per-rank or per-class points, so the power maps drop those axis labels and show the table's `note` instead. The test suite checks that every table is a full 7 x 7 grid of positive numbers and names the exact cell that is not. No other test depends on the values, so new numbers need no test changes.

## Deployment

The site lives at <https://shadow-slave-hierarchy.pages.dev>, on Cloudflare Pages.

Every push runs the CI workflow (format, lint, tests and build) and the deploy workflow, which builds `dist` and uploads it with Wrangler:

- A push to `master` updates production.
- A push to any other branch publishes a preview at `https://<branch>.shadow-slave-hierarchy.pages.dev`.

The deploy needs two repository secrets: `CLOUDFLARE_API_TOKEN`, an account token limited to **Cloudflare Pages: Edit**, and `CLOUDFLARE_ACCOUNT_ID`. Forks do not receive them, so pull requests from forks are checked by CI but not previewed.

## Disclaimer

A fan project. _Shadow Slave_ and its characters belong to their author, Guiltythree.
