# Sandbox

Free-form experimentation, kept deliberately outside the maturity ladder below.

## Maturity tiers

Storybook `title:` prefixes double as the promotion ladder — no separate
tooling, just a naming convention checked at review time:

| Tier | `title:` prefix | Meaning |
| --- | --- | --- |
| Inspiration | `Inspiration/*` | A reference recreated from elsewhere (an animation, a pattern) — not yet adapted, not yet reviewed. |
| Experiments | `Experiments/*` | Adapted to this system's tokens and API shape, but unreviewed and unstable — may change or disappear without notice. |
| Approved | `Approved/*` | Reviewed and stable, not yet extracted as a reusable export. |
| Production | (no prefix — top-level `Button`, `Modal`, etc.) | Exported from `src/index.ts`, covered by tests, safe to depend on. |

A component only reaches `src/index.ts` once it's `Production`. Nothing in
`Inspiration/` or `Experiments/` is exported — import from there directly if
you need to reference the work, but treat it as unstable by construction.

See `design/docs/animation-pipeline.md` (once written) for the specific
reference → recreate → adapt → promote flow this ladder is built for.
