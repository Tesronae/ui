# Components

Behaviour contracts and inventory for this package's components. Components and their
CSS Modules own implemented appearance and behavior; Storybook exposes their states for
inspection. This file records intended usage and what must not be lost when they
change. See `IMS-web`'s `DESIGN.md` §5 ("Shared design and delivery workflow") for how
a consumer is expected to use this alongside a component's `.stories.tsx`; for maturity
tags (`experimental`/`candidate`/`stable`/`deprecated`) see `design/docs/sandbox.md`.

This file covers this package's own components. Product screens, patterns, and
domain-specific compositions built from them (dashboards, counter mode, catalogue,
categories-as-a-tree, etc.) are `IMS-web`'s concern, documented in that repository's
own `design/docs/components.md`, `CLAUDE.md`, and `SPEC.md` — not here.

---

## Component inventory

Every component currently in `src/components/ui/`, its Storybook story, and whether
it's exported from `src/index.ts` (`src/index.ts` is this package's only stable public
API — see `README.md`):

| Component | Code | Story | Exported |
| --- | --- | --- | --- |
| Button | `src/components/ui/Button` | `Button.stories.tsx` | yes |
| Text Field | `src/components/ui/TextField` | `TextField.stories.tsx` | yes |
| Select | `src/components/ui/Select` | `Select.stories.tsx` | yes |
| Chip | `src/components/ui/Chip` | `Chip.stories.tsx` | yes |
| Data Table | `src/components/ui/DataTable` | `DataTable.stories.tsx` | yes |
| Pill | `src/components/ui/Pill` | `Pill.stories.tsx` | yes |
| Notice | `src/components/ui/Notice` | `Notice.stories.tsx` | yes |
| Modal | `src/components/ui/Modal` | `Modal.stories.tsx` | yes |
| Toast | `src/components/ui/Toast` | `Toast.stories.tsx` | yes |
| Skeleton | `src/components/ui/Skeleton` | `Skeleton.stories.tsx` | yes |
| Metric | `src/components/ui/Metric` | `Metric.stories.tsx` | yes |
| Ring Gauge | `src/components/ui/RingGauge` | `RingGauge.stories.tsx` | yes |
| Bar Chart | `src/components/ui/BarChart` | `BarChart.stories.tsx` | yes |
| Sparkline | `src/components/ui/Sparkline` | `Sparkline.stories.tsx` | yes |
| Checkbox | `src/components/ui/Checkbox` | `Checkbox.stories.tsx` | yes |
| Dot Field | `src/components/ui/DotField` | `DotField.stories.tsx` | yes |

`RingGauge` is the generic ring-chart primitive — a consuming app composes it into its
own domain-specific name (e.g. `IMS-web`'s `StockHealthRing`) rather than this package
guessing every future consumer's vocabulary. There is no `StockHealthRing` here; that
name belongs to `IMS-web`'s own wrapper.

`DotField` is scoped to pre-authentication surfaces only (sign-in, sign-up, marketing)
under `design/docs/motion.md`'s ambient-motion carve-out — it is not licensed for an
authenticated working surface. Its repel math is a separate, independently-tested pure
module (`dot-field-math.ts`), following the same split `chart-math.ts` uses for the
sparkline/bar/ring charts.

Icons are a separate registry, not a component: `src/components/Icon.tsx`, one
name-keyed SVG set, one stroke weight and grid, no Storybook story of its own yet. Do
not add an icon package (lucide, heroicons) — a second stroke weight and grid breaks
the "one icon set" rule this system depends on.

Prefer an existing component over reproducing equivalent markup in a consumer.
Reference the component and its story, not memory or a screenshot, before building
something that looks similar.

---

## Required state/variant matrix

Every component above should account for the states that apply to it:

- desktop;
- tablet;
- mobile (see each story's `MobileStacked`/narrow-viewport variant where one exists);
- loading;
- empty;
- error;
- long content;
- dark theme (`[data-theme="dark"]` — see the `theme` Storybook toolbar control);
- RTL (see the `direction` Storybook toolbar control; generic RTL readiness here does
  not mean `IMS-web`'s Arabic support has shipped — `IMS-web`'s `SPEC.md` §12);
- reduced motion, when the default has motion (see the `motion` Storybook toolbar
  control, and `design/docs/motion.md`).

`permission-restricted state` is a consumer/domain concept (e.g. `IMS-web`'s
`cost:read` omission), not something a generic component decides for itself — this
package's contribution is a component like `Metric`'s `locked` branch that a consumer
can render that state *with*, not a permission model of its own.

---

## Per-component state contract

Design and implementation work should explicitly account for:

- pointer interaction;
- keyboard interaction;
- focus state;
- disabled state;
- loading state;
- empty state;
- error state;
- narrow/mobile layout;
- long values/content.

Do not treat hover-only behaviour as the complete interaction design.

---

## Automated coverage

- Unit tests (`npm test`, Vitest): 93 tests across 19 files as of 2026-09-24, one test
  file per component plus `Icon` and each pure-math module (`chart-math`,
  `dot-field-math`). These check behaviour and accessible attributes (ARIA
  roles/states, keyboard handling), not visual appearance.
- Storybook's `@storybook/addon-a11y` runs an axe accessibility check against every
  story on every `build-storybook` (`.storybook/main.ts`; `parameters.a11y.test =
  "error"` in `.storybook/preview.tsx` fails the build on a violation).
- There is no visual-regression/screenshot baseline in this repository. `IMS-web`'s
  own `storybook-tests/catalog.spec.ts` is a separate, IMS-web-owned Playwright suite
  that snapshots its own product screens (some of which compose these components) —
  it is not something this repository runs or owns.
- Human design review for a material change here follows `IMS-web`'s `DESIGN.md` §5
  (named-commit approval) — this repository keeps no separate `design/reviews/`
  directory of its own; that dated-approval convention is `IMS-web`'s.
