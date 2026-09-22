# Changelog

All notable changes to `@tesronae/ui` are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this package follows
semantic versioning as described in `AGENTS.md`.

## [Unreleased]

Everything merged to `main` since `v0.1.2` and not yet tagged/published:

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
