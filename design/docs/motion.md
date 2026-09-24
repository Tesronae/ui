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

- **`--dur: 130ms`** (`design/tokens/tokens.json` → `motion.dur`) is the package's
  default transition duration. **`--dur-step: 250ms`** is for a longer, deliberate
  transition (a step change, not a hover/focus micro-interaction). **`--ease-out`**
  (`cubic-bezier(0.23, 1, 0.32, 1)`) is the package's only easing curve so far —
  everything else still falls back to the CSS default `ease`.
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

## Reviewing reduced motion in Storybook

The toolbar's "Motion: reduced" control (`.storybook/preview.tsx`'s `motion`
globalType) lets a reviewer preview reduced motion without changing an OS/browser
setting. It works by forcing near-zero `animation-duration`/`transition-duration`
on everything under `.story-root[data-motion="reduce"]`
(`.storybook/preview.css`) — a review aid only, never shipped to consumers. A
component's own correction (`Skeleton`'s `@media (prefers-reduced-motion: reduce)`
block above) is what actually matters at runtime and works identically with or
without this toolbar control.

## How much motion is too much

Animation is allowed — it isn't banned by default. The line is purpose, not
presence: motion earns its place by communicating state, feedback, continuity, or
relationship (a step transition, a field settling in after an error, a loading
spinner). Motion added because a component *can* animate, with no state it's
communicating, is what to avoid — not motion itself.

Revised 2026-09-23 (`IMS-web` `DECISION_LOG.md`): this replaces the earlier flat "no
entrance animations / no decorative hover lift / no page transitions" rule. That
rule was written before this package had any real motion work to weigh it against;
Phase 1.5's auth-screen redesign is a real, judged example, and it holds up fine
under "does this motion mean something" — a step transition between sign-in and
sign-up states, or a notice settling into place, is exactly the kind of relationship/
feedback motion this doc has always said motion is *for*. The old rule cited
`PRODUCT.md`'s "not an animation showcase" personality line; `PRODUCT.md` itself now
says the same thing this section does — motion for its own sake is out of character,
purposeful motion isn't.

This still isn't a green light for decoration. Before adding motion, name what it
communicates. If the honest answer is "it looks nice" *alone*, it doesn't ship. A page
that transitions on every navigation, or a hover lift on every card, still reads as
decoration unless it's actually telling the user something — apply the same judgment
call, not a blanket yes.

That said, purposeful motion should also be well-crafted, not just justified — a
state transition that communicates correctly but looks janky or cheap has failed too.
Three things every animation is checked against, together, not traded off against
each other:

- **Communicates something** (this section, above) — state, feedback, continuity,
  relationship.
- **Costs nothing real.** Animate `transform`/`opacity` (compositor-only, off the
  main thread), not `width`/`height`/`top`/`left`/box-shadow spread or anything else
  that triggers layout or paint. Keep it short (`--dur`/130ms is the package default
  for a reason). Never block input, focus, or the next action on a decorative delay —
  counter mode (`SPEC.md` UX-2) is this app's least forgiving surface for it, but the
  rule is general, not counter-specific.
- **Respects `prefers-reduced-motion`.** Non-negotiable, ships with the motion change
  itself (see above), never retrofitted.

A motion that fails any one of the three isn't ready, regardless of how well it does
on the other two.

## Ambient motion on pre-authentication surfaces

The three gates above assume the working surface — a screen someone uses repeatedly
to get something done, where motion earns its place by communicating a specific
state change. A sign-in or sign-up screen is not that surface: it's seen once per
session, at most, and its job is to establish what the product feels like before any
work happens.

On pre-authentication surfaces — sign-in, sign-up, marketing — ambient motion that
establishes product character is permitted without communicating a specific state,
provided it:

- costs nothing when idle (no continuous animation loop running against a still
  cursor or an unattended tab);
- never runs on touch or under `prefers-reduced-motion` — neither has a cursor to
  animate in response to, and both get the equivalent static state instead;
- never delays input, focus, or submission on the actual sign-in/sign-up form; and
- is `aria-hidden` — it is decoration for the surface, not content.

This is narrow and deliberate. It does not license ambient motion on the
authenticated working surfaces, where `SPEC.md` UX-2's latency budget and the three
gates above still govern without exception.

---

## Known gaps (pre-existing, not yet fixed)

Formerly listed a missing easing token here. `--ease-out` and `--dur-step` were
added (`design/tokens/tokens.json`'s `motion` group) once a real consumer —
`DotField`'s Storybook entry and IMS-web's Phase 1.5 auth motion — needed them. No
other easing curve exists yet; add one only when another real case needs it.
