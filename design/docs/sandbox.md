# Sandbox

Free-form experimentation, kept deliberately outside the maturity ladder below.

## Maturity tiers

Maturity is **metadata**, not part of a story's `title:` — `tags: ["maturity:<tier>"]`
on a story's `meta`, one of `experimental` / `candidate` / `stable` / `deprecated`.
`.storybook/manager.tsx` renders a sidebar badge for any tier other than `stable`, so
the default case (stable, the common one) stays quiet and only exceptions are called
out. Shipped 2026-09-21 (IMS-web `TASKS.md` W1.3.5); all 14 components currently in
this package are tagged `maturity:stable`, since all 14 are exported from `src/index.ts`.

This supersedes an earlier, documented-but-never-applied plan to use a `title:` prefix
ladder (`Inspiration/*` / `Experiments/*` / `Approved/*` / no prefix for `Production`)
— no story here ever actually used those prefixes; every story already lived under
flat `Components/*` titles. The metadata mechanism replaces that plan rather than
migrating anything, so no story ID or URL changed.

A component only reaches `src/index.ts` once it's `Production`-equivalent (tagged
`maturity:stable` and exported). An experimental or candidate component's story still
lives under `Components/*` (or a dedicated section once one is needed) with its own
`maturity:experimental`/`maturity:candidate` tag — it just isn't exported yet.

See `design/docs/animation-pipeline.md` for the reference → recreate → adapt → promote
flow a new animation goes through before it's ready for a `maturity:candidate` tag.
