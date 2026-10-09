# Changelog

All notable changes to `@tesronae/ui` are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this package follows
semantic versioning as described in `AGENTS.md`.

## [Unreleased]

- Added: `TrendCard.valueSuffix` keeps caller-styled units visible during pointer
  and keyboard scrubbing, without changing exact formatted text or announcements.
- Fixed: compact `Pill` uses v26's single-line leading, 2px icon gap and figure
  weight instead of inheriting paragraph leading. Default pills are unchanged.

## [0.3.6] - 2026-10-09

- Fixed: `TrendCard` reserves a stable header height and keeps the label and
  scrubbed date on one line, preventing values and sparklines from jumping
  when hover or keyboard focus replaces the delta with a date (IMS W1.5.52).

## [0.3.5] - 2026-10-09

- Added: `Pill` gains `size="compact"` — a smaller, fully-rounded shape
  (3px 7px 3px 5px padding, `--r-full`) for a figure read inline next to
  other text, e.g. a KPI card's delta. Candidate for IMS-web W1.5.51 (the
  KPI delta pill's wrong size/shape vs. the v26 design artifact's `.kd`).
  Default pill unaffected; no existing call site's rendered output changes.
- Fixed: `TrendCard`'s scrubbed day label moved from a floating
  `position: absolute` span inside `.spark` into the `.top` row, in the
  same flex slot `delta` already vacates while reading — matching v26's
  `.kpi-day` (a real child of `.kpi-top`, not a detached overlay).
  Candidate for IMS-web W1.5.52's position bug. No prop changes; existing
  `days`/`delta` call sites are unaffected.

## [0.3.4] - 2026-10-08

- Fixed: generate tokens before unit tests in the Publish workflow, matching CI.
  Version 0.3.3 failed before publication; 0.3.4 includes its Sheet changes.

## [0.3.3] - 2026-10-08 (not published)

- Added: opt-in `Sheet` `presentation="floating"` (600px maximum desktop
  width, 10px insets, 14px radius; mobile bottom sheet capped at 88dvh) and
  generic `headerLeading` slot. Header/footer stay fixed while body scrolls.
- Fixed: focus restoration, hidden/inert/disabled control exclusion, radio
  group tab stops, keyboard access to read-only scrolling content, RTL drag
  direction and cancelled gesture dismissal.
  Floating snapback uses shared motion tokens and respects reduced motion.
- Verification: packed-consumer gate now checks actual Sheet CSS token values,
  preventing a formatter omission from silently removing layout constraints.
- Migration: existing `Sheet` calls retain `presentation="edge"` by default;
  no required call-site changes. After an approved exact-pin upgrade, opt into
  floating layout and supply optional `headerLeading` content. The candidate
  requires manual screen-reader review and named-commit owner approval before
  publication/adoption. Rollback restores the prior version and lockfile.

## [0.3.2] - 2026-10-08

- Added: `TextField` gains `min`/`max`/`step` (passed through to the native
  input) and an `inline` layout — label, input and an optional trailing
  `suffix` unit on one row, instead of the default label-above-input stack —
  plus a `narrow` modifier (fixed width, centered text, no native spin-button
  arrows) for a short bounded numeric field read as one sentence (e.g. "Show
  what expires within [90] days"). Candidate for IMS-web W1.5.37. All five
  additions are optional; no existing call site's rendered output or props
  change.

## [0.3.1] - 2026-10-08

- Added: intermediate typography (12.5, 13.5, 19, 22, 26px), display/label
  line heights (1.1/1.3), fine spacing (3/5px), and press/fade durations
  (120/160ms). Existing token values are unchanged. Candidate for IMS-web
  W1.5.36. No breaking changes or component migrations. Consumers can use
  the new variables after an exact-pin upgrade; existing styles need no edits.

## [0.3.0] - 2026-10-06

`IMS-web` W1.5.33.

- Added: `TintedNotice` component — a tinted-surface banner (background,
  border and icon all carry the tone color, `neg`/`warn`/`pos`/`info`) with
  an optional dismiss button and a mount/dismiss WAAPI entrance per tone,
  honoring `prefers-reduced-motion`. Distinct from `Notice`, which keeps a
  neutral surface plus a 3px edge stripe for a supporting aside next to
  other content; `TintedNotice` is for a state that is itself the point (a
  completed action, a session/connectivity notice, a stock alert). Two
  layouts: `"stacked"` (a bordered icon chip, action below the body) and
  `"inline"` (a bare tone-colored icon, action beside the body, wrapping to
  a full-width row under its own 436px container query). Promoted from
  `IMS-web`'s auth-only `AuthNotice` — supersedes the earlier, unreleased
  `TintedNotice` draft on the now-abandoned `phase1.5-tinted-notice` branch,
  which shipped CSS-keyframe motion and no tone-driven icon chip color.

## [0.2.0] - 2026-09-30

Phase 1.5 dashboard redesign primitives (`IMS-web` W1.5.8-W1.5.10, W1.5.14).

- Added: `Segmented` component — a single-select filter group with a
  sliding indicator (`.sg-group`/`.sg-ind` in the design artifact),
  measured from the pressed button's DOM position and WAAPI-tweened
  between states; empty buckets disable rather than hide. Extracted from
  the `role="group"`/`aria-pressed` pattern `IMS-web`'s `Counter.tsx` had
  hand-rolled.
- Added: `Panel`/`PanelPair` components — a hairline-bordered section
  surface (title/header-extra/body/footer slots) and a two-up layout
  using real CSS subgrid so both panels' header/body/footer rows stay
  aligned regardless of which side's body is taller, degrading to
  stacked flex under its own container query. New token: `--sec-line`
  (`design/tokens/tokens.json`) — `--sec-bg`/`--sec-r` already had exact
  equivalents (`var(--bg)`/`var(--r-lg)`), so no duplicate tokens.
- Added: `TrendCard` component — a KPI/stat card with a 14-point
  sparkline (line + area wash) whose value swaps for the exact scrubbed
  day's figure on pointer move, focus, or Arrow/Home/End keys, announced
  via `aria-live`; `tone` (good/bad/neutral) coloring; an owner-only lock
  badge. `days[].value` is presentation-only (curve shape), matching
  `Sparkline`/`BarChart`'s existing plain-`number[]` precedent — the
  caller supplies the exact display text separately, through its own
  decimal library.
- Added: `Sheet`/`AccordionRow` components — a generic scrim + edge-
  anchored panel shell (right-side inset panel ≥721px, bottom sheet
  below it) with Escape-to-close, a Tab/Shift+Tab focus trap, drag-to-
  dismiss on touch (rubber-band resistance, dismiss past 25% or a flick,
  skipped entirely under reduced motion), and body-scroll lock; a fully
  controlled collapsible action row for the sheet's body. Domain content
  (which action a row represents, its API call) is deliberately not
  part of this package — see `IMS-web`'s own `AGENTS.md` "no consumer-
  specific behaviour".
- Changed (breaking): `RingGauge`/`RingSegment`/`buildRingArcs` —
  `RingSegment` gains a required `id` field (needed to identify which
  arc was hovered/clicked). `buildRingArcs` gains an explicit
  `strokeWidth` parameter; `radius` now derives from it
  (`size/2 - strokeWidth/2 - 1`) instead of a second, disconnected
  hardcoded inset — the default-size/width radius moves from 44px to
  46px. `RingGauge` gains `strokeWidth`, `centerValue`/`centerCaption`
  overrides (the center text is no longer hardcoded to "first segment's
  percent share"), `activeSegmentId`/`onSegmentHover`/`onSegmentClick`
  (wider invisible hit-arcs, only rendered when a handler is passed),
  and a stroke-dasharray draw-in animation on mount (skipped under
  reduced motion).
- Changed: `chart-math.ts`'s `buildSparkline` gains a `points` array
  (every value's plotted x/y, not just the last one) — additive;
  existing `Sparkline`/`BarChart` callers are unaffected.

## [0.1.6] - 2026-09-24

- Fixed: `Checkbox` shifted 2-3px vertically every time it was toggled. The
  `.chk` label is `display: inline-flex`, which reports a baseline to its own
  outer inline context; that baseline is derived from a flex item's baseline
  unless overridden, and toggling `:checked`'s `::after` pseudo-element
  inside the input changed what the browser treated as that baseline — even
  though every element's own width/height stayed constant. `vertical-align:
  top` on `.chk` removes the baseline dependency entirely. Found live in
  `IMS-web` (W1.5.7 manual verification), reproduced and fixed here.

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
