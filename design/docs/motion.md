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
  token. Every transition in the app uses this one duration and falls back to the CSS
  default easing (`ease`) — **no easing/curve token exists yet**. See Known gaps below.
- Consumers of `--dur`: `src/components/ui/Button.module.css`,
  `src/components/ui/TextField.module.css`, `src/components/ui/Select.module.css`,
  `src/components/shell/Sidebar.module.css`, `src/components/shell/Topbar.module.css`,
  `src/components/counter/Counter.module.css`.
- The only keyframe animation in the app is `src/components/ui/Skeleton.module.css`'s
  `sweep 1.25s infinite` shimmer.
- `prefers-reduced-motion` is handled **globally**, not per component:
  `src/app/globals.css` kills `animation-duration`, `animation-iteration-count`, and
  `transition-duration` via `!important` inside one
  `@media (prefers-reduced-motion: reduce)` block.

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
