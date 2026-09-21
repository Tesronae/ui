# @tesronae/ui

Reusable design system — tokens, components, motion — shared across projects.
Not a framework-specific library: no Next.js, no i18n library, no hard
runtime dependency beyond React itself.

## Install

Private package on GitHub Packages. Add to `.npmrc`:

```
@tesronae:registry=https://npm.pkg.github.com
```

Then:

```
npm install @tesronae/ui
```

## Use with Next.js

This package ships TypeScript source, not a pre-bundled dist — your own
bundler compiles it. For Next.js, add it to `transpilePackages`:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@tesronae/ui"],
};
```

## Fonts

Components reference `var(--font-inter)`, `var(--font-inter-tight)`, and
`var(--font-ibm-plex-mono)` as font-family values — this package does not
load any font itself (next/font is Next-only and would break every other
consumer). Load them however your app prefers and set those three CSS
custom properties; see `.storybook/preview-head.html` for one example
(a plain Google Fonts `<link>`).

## Tokens

```ts
import "@tesronae/ui/tokens.css";
```

Source values live in `design/tokens/tokens.json` (DTCG format) — see
`design/docs/principles.md`.

## Structure

| Path | What |
| --- | --- |
| `src/index.ts` | The only stable import surface — `Production`-tier only |
| `src/components/ui/` | Component source, stories, tests |
| `src/components/Icon.tsx` | Icon registry + `Icon` component. Extend it in your own app: `export const ICONS = { ...BASE_ICONS, myIcon: "..." }` |
| `design/tokens/` | Token source (`tokens.json`) and the build that generates `dist/tokens.css` |
| `design/docs/` | Written contracts: principles, motion, components, sandbox/maturity tiers, animation pipeline |

## Maturity tiers

See `design/docs/sandbox.md`. Storybook `title:` prefix is the mechanism —
`Inspiration/*`, `Experiments/*`, `Approved/*` are all unstable by
definition; only what's exported from `src/index.ts` is `Production`.
