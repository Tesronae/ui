# Motion

## What motion is for

Motion communicates:

- state;
- relationship;
- continuity;
- feedback.

Motion is not added merely because a component can animate.

Prefer:

- short transitions;
- transform and opacity when animation is needed;
- interruptible interactions;
- no unnecessary entrance animation;
- no decorative hover lift;
- no motion that slows counter work (`SPEC.md` UX-2 — this app's most
  latency-sensitive surface).

`prefers-reduced-motion` behaviour must ship with a motion change rather than being
retrofitted later.

---

## What exists today

- **`--dur: 130ms`** (`design/tokens/tokens.json` → `motion.dur`) is the only motion
  token. Every transition in this package uses this one duration and falls back to
  the CSS default easing (`ease`) — **no easing/curve token exists yet**. See Known
  gaps below.
- Consumers of `--dur` in this package: `src/components/ui/Button.module.css`,
  `src/components/ui/TextField.module.css`, `src/components/ui/Select.module.css`.
  (The IMS-web consumer app has its own additional `--dur` consumers, e.g. its
  shell and counter screens — those stay in `IMS-web`, not here.)
- The only keyframe animation in this package is `src/components/ui/Skeleton.module.css`'s
  `sweep 1.25s infinite` shimmer.
- `prefers-reduced-motion` is handled **per component**, in each component's own
  `.module.css`, not globally. This package ships no app shell and no global
  stylesheet a consumer is guaranteed to load, so there is no single place to attach
  one global media-query block to — unlike the IMS-web app this was extracted from,
  which used one global `@media (prefers-reduced-motion: reduce)` block in its own
  `src/app/globals.css`. `Skeleton` carries the first such per-component correction
  (2026-09-21). `Button`, `TextField`, and `Select` still only use plain
  `transition`s and do not yet disable them under reduced motion — same class of
  gap, not yet fixed.

## What never animates

- No page transitions.
- No decorative hover lift.
- No entrance animations.

These are deliberate product decisions (`PRODUCT.md`'s personality section: this app
should not feel like "an animation showcase"), not gaps to fill in.

---

## Known gaps (pre-existing, not yet fixed)

- **No easing token.** Every transition falls back to the CSS default `ease`. Adding a
  curve token (and deciding whether it should vary by interaction type) is a separate
  design-system task.
