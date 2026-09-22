# Tasks — @tesronae/ui

Delivery status for this repository's own Phase 1.3 obligations under the shared
IMS-web/Tesronae/ui delivery workflow (`IMS-web` `DESIGN.md` §5). Sequencing,
requirements, and full task IDs are owned by `IMS-web`'s `TASKS.md`; this file
tracks only this repository's side of the shared IDs, so it does not duplicate that
authority — read `IMS-web`'s `TASKS.md` for context on any ID below.

| ID (from `IMS-web` `TASKS.md`) | This repository's obligation | Status |
| --- | --- | --- |
| W1.3.4 | Host this package's own Storybook so `IMS-web`'s Design Lab can embed it. Done 2026-09-21 on this side: `.github/workflows/storybook-pages.yml` merged (PR #1) and deployed, live at https://tesronae.github.io/ui/ (verified `curl -I` → `200`). `IMS-web` side (the actual Design Lab embed) done 2026-09-22 — detail in `IMS-web`'s `TASKS.md` | done |
| W1.3.5 | Done 2026-09-21. Maturity metadata: every story's `meta.tags` carries `maturity:<tier>` (all 14 current components tagged `maturity:stable`), verified in `storybook-static/index.json`; `.storybook/manager.tsx` badges any non-`stable` tier, verified in the built manager bundle and live in a running Storybook (Playwright). Story IDs/URLs untouched — replaces an earlier `title:`-prefix plan that no story had ever actually used, not a migration. Toolbar controls: `direction` (ltr/rtl) and `motion` (review-only reduced-motion override) added to `.storybook/preview.tsx`/`preview.css`, alongside the pre-existing `theme` and `viewport` controls; verified with Playwright (dark+RTL screenshot on `TextField`, computed `animation-duration` collapses under the motion override). Usage guidance: `parameters.docs.description.component` added to all 14 stories (purpose, usage, accessibility, content guidance); verified rendered in a built docs page via Playwright | done |
| W1.3.6 | Skeleton's reduced-motion correction: the correction itself is done 2026-09-21 (`Skeleton.module.css` now has its own `@media (prefers-reduced-motion: reduce)` block disabling the sweep animation, since this package has no consumer-global stylesheet to rely on the way the IMS-web app it was extracted from did; regression test added in `Skeleton.test.tsx`, both verified passing via `npm test`). Still open: the full playground → named-commit human review → package/browser/packed-consumer verification → exact-artifact release → pinned IMS-web adoption pipeline this correction was meant to prove end-to-end — no release has been cut or adopted yet | in-progress |
| W1.3.11 | Packed-artifact consumer verification (exports, CSS, icons, representative interactions) as part of this repository's own release gates | todo |
| W1.3.15 | Contribution instructions (`AGENTS.md`) and stale-reference reconciliation — done 2026-09-21: Storybook port, maturity mechanism, and (found and fixed same day) `design/docs/components.md`'s stale `StockHealthRing` name, IMS-web-only screens/patterns/theme-toggle path, wrong Playwright-suite claim, and dangling `DESIGN.md` heading | done |

## Infrastructure notes

- Public `main` requires the `verify` check; required human-approval count is 0 as
  of 2026-09-21 — a named-commit owner review for material changes still needs an
  explicit record per commit, not an enforced GitHub gate.
- GitHub Pages enabled 2026-09-21 (owner action, source: GitHub Actions). PR #1
  merged same day; the deploy workflow ran on merge and succeeded — public
  Storybook catalog is live at https://tesronae.github.io/ui/.
