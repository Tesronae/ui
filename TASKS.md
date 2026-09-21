# Tasks — @tesronae/ui

Delivery status for this repository's own Phase 1.3 obligations under the shared
IMS-web/Tesronae/ui delivery workflow (`IMS-web` `DESIGN.md` §5). Sequencing,
requirements, and full task IDs are owned by `IMS-web`'s `TASKS.md`; this file
tracks only this repository's side of the shared IDs, so it does not duplicate that
authority — read `IMS-web`'s `TASKS.md` for context on any ID below.

| ID (from `IMS-web` `TASKS.md`) | This repository's obligation | Status |
| --- | --- | --- |
| W1.3.4 | Host this package's own Storybook so `IMS-web`'s Design Lab can embed it. Workflow written (`.github/workflows/storybook-pages.yml`, 2026-09-21); actually running depends on GitHub Pages being enabled (Settings → Pages → Source: GitHub Actions) — owner action, not yet done | in-progress |
| W1.3.5 | Maturity metadata mechanism: done 2026-09-21 — every story's `meta.tags` carries `maturity:<tier>` (all 14 current components tagged `maturity:stable`, since all 14 are exported from `src/index.ts`), verified present in `storybook-static/index.json` after `npm run build-storybook`; `.storybook/manager.tsx` badges any non-`stable` tier in the sidebar, verified in the built manager bundle. Story IDs/URLs untouched, so this coexists with and is additive over the `title:`-prefix convention rather than requiring a migration. Still open: usage-guidance docs content per component, and theme/viewport/direction/reduced-motion Storybook toolbar controls — neither exists yet. `design/docs/sandbox.md` updated to describe both mechanisms and mark `title:`-prefix as interim | in-progress |
| W1.3.6 | Skeleton's reduced-motion correction: the correction itself is done 2026-09-21 (`Skeleton.module.css` now has its own `@media (prefers-reduced-motion: reduce)` block disabling the sweep animation, since this package has no consumer-global stylesheet to rely on the way the IMS-web app it was extracted from did; regression test added in `Skeleton.test.tsx`, both verified passing via `npm test`). Still open: the full playground → named-commit human review → package/browser/packed-consumer verification → exact-artifact release → pinned IMS-web adoption pipeline this correction was meant to prove end-to-end — no release has been cut or adopted yet | in-progress |
| W1.3.11 | Packed-artifact consumer verification (exports, CSS, icons, representative interactions) as part of this repository's own release gates | todo |
| W1.3.15 | Contribution instructions (`AGENTS.md`) and stale-reference reconciliation (Storybook port, maturity mechanism) — done 2026-09-21 | done |

## Infrastructure notes

- Public `main` requires the `verify` check; required human-approval count is 0 as
  of 2026-09-21 — a named-commit owner review for material changes still needs an
  explicit record per commit, not an enforced GitHub gate.
- GitHub Pages was not configured as of 2026-09-21; the public Storybook catalog
  (`DESIGN.md` §5) depends on it. The deploy workflow is written and will run once
  Pages is enabled with source "GitHub Actions" — a live repo-setting change, done
  by the repository owner, not by an agent, per this session's standing instruction.
