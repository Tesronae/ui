# Changelog

All notable changes to `@tesronae/ui` are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this package follows
semantic versioning as described in `AGENTS.md`.

## [Unreleased]

## [0.1.5] - 2026-09-24

- Added: `DotField` component — a cursor-repelled dot-grid texture for
  pre-authentication surfaces, ported from the auth-redesign prototype's
  `DOTS` canvas effect (`IMS-web` W1.5.4 Slice A). Static CSS fallback on
  touch and under `prefers-reduced-motion`; the repel math ships as a
  separate, independently-tested pure module, `dot-field-math.ts`
  (`buildDotGrid`, `stepDots`).
- Added: `--ease-out` and `--dur-step` motion tokens
  (`design/tokens/tokens.json`'s `motion` group), closing this package's
  long-standing "no easing token" gap (`design/docs/motion.md`).
- Added: a scoped "ambient motion on pre-authentication surfaces" carve-out
  to `design/docs/motion.md`, alongside the already-drafted "how much motion
  is too much" revision (`IMS-web` `DECISION_LOG.md`, 2026-09-23) — both
  land in a release for the first time here.
- Fixed: `Checkbox` was missing from `scripts/lib/consumer-expectations.mjs`'s
  `EXPECTED_EXPORTS` and from `design/docs/components.md`'s inventory since
  its `v0.1.4` release; added to both alongside `DotField`.

## [0.1.4] - 2026-09-24

- Added: `Checkbox` component — a single boolean checkbox with a label,
  invalid/error-message state, ported from the auth-redesign prototype's
  `.chk` rules (`IMS-web` W1.5.6: "keep me signed in", required-terms
  consent).
- Added: `eye`/`eyeoff` icons to the icon registry, for a password
  show/hide toggle (`IMS-web` W1.5.6).

## [0.1.3] - 2026-09-22

Everything merged to `main` since `v0.1.2`, cut as this pipeline's first
end-to-end proof (TASKS.md W1.3.6):

- Fixed: `Skeleton`'s sweep animation now disables itself under
  `prefers-reduced-motion: reduce` (this package has no consumer-global
  stylesheet to rely on for that, unlike the IMS-web app it was extracted
  from), with a regression test.
- Added: maturity-metadata mechanism — every story's `meta.tags` carries
  `maturity:<tier>`, badged in the Storybook sidebar; story IDs/URLs stay
  stable (this replaces an earlier `title:`-prefix plan that no story had
  actually used).
- Added: `direction` (ltr/rtl) and `motion` (reduced-motion override)
  Storybook toolbar controls, alongside the existing `theme`/`viewport`
  controls.
- Added: `parameters.docs.description.component` usage guidance on every
  story (purpose, usage, accessibility, content guidance).
- Fixed: `design/docs/components.md` reconciled — stale `StockHealthRing`
  naming, IMS-web-only screens/patterns, a wrong Playwright-suite claim, and
  a dangling heading.

## [0.1.2] - published

- Fixed: `DataTable.module.css` exported so IMS-web's hand-rolled table can
  reuse it directly.

## [0.1.1] - published

- Fixed: `ICONS` exported, giving `Toast` an extensible icon registry.

## [0.1.0] - published

- Initial extraction: tokens, components, motion, icon registry.
