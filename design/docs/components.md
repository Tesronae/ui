# Components

Behaviour contracts and inventory for this app's design system. Components and their
CSS Modules own implemented appearance and behavior; Storybook exposes their states for
inspection. This file records intended usage and what must not be lost when they
change. See `DESIGN.md` §UI implementation workflow for how to use this alongside a
component's `.stories.tsx`.

---

## Component inventory

Production primitives, `src/components/ui/`, and their Storybook story:

| Component | Code | Story |
| --- | --- | --- |
| Button | `src/components/ui/Button` | `Button.stories.tsx` |
| Text Field | `src/components/ui/TextField` | `TextField.stories.tsx` |
| Select | `src/components/ui/Select` | `Select.stories.tsx` |
| Chip | `src/components/ui/Chip` | `Chip.stories.tsx` |
| Data Table | `src/components/ui/DataTable` | `DataTable.stories.tsx` |
| Pill | `src/components/ui/Pill` | `Pill.stories.tsx` |
| Notice | `src/components/ui/Notice` | `Notice.stories.tsx` |
| Modal | `src/components/ui/Modal` | `Modal.stories.tsx` |
| Toast | `src/components/ui/Toast` | `Toast.stories.tsx` |
| Skeleton | `src/components/ui/Skeleton` | `Skeleton.stories.tsx` |
| Metric | `src/components/ui/Metric` | `Metric.stories.tsx` |
| Stock Health Ring | `src/components/ui/StockHealthRing` | `StockHealthRing.stories.tsx` |
| Bar Chart | `src/components/ui/BarChart` | `BarChart.stories.tsx` |
| Sparkline | `src/components/ui/Sparkline` | `Sparkline.stories.tsx` |

Icons are a separate registry, not a component: `src/components/Icon.tsx`, one
name-keyed SVG set, one stroke weight and grid. Do not add an icon package (lucide,
heroicons) — a second stroke weight and grid breaks the "one icon set" rule this system
depends on.

Prefer an existing production component over reproducing equivalent markup for one
screen. Reference the component and its story, not memory or a screenshot, before
building something that looks similar.

---

## Patterns

Repeated compositions, not primitive components:

- page header;
- filter row;
- cascading category picker (categories are a tree, depth cap 4 — `CLAUDE.md`);
- movement row;
- empty state;
- permission-restricted state;
- form sections;
- search-results pattern — must support barcode, SKU, OEM, name, and partial-match
  workflows; do not reduce it to generic site search.

## Screens

- Dashboard
- Counter
- Parts
- Part detail
- Movements
- Catalogue

## Required state/variant matrix

Every component/pattern/screen above should account for the states that apply to it:

- desktop;
- tablet;
- mobile;
- loading;
- empty;
- error;
- permission restricted;
- long content;
- dark theme (`[data-theme="dark"]`, `src/components/shell/ThemeToggle.tsx`);
- RTL (once Arabic ships, `SPEC.md` §12);
- reduced-motion alternative when the default has motion.

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
- permission-restricted state;
- narrow/mobile layout;
- long values/content.

Do not treat hover-only behaviour as the complete interaction design.

---

## Automated visual coverage

`storybook-tests/catalog.spec.ts` keeps committed regression baselines for seven
representative states: button variants, data table, modal, owner dashboard, staff
dashboard with cost omitted, counter, and mobile dashboard. These files catch visual
drift; they are not human-approved design decisions. Human approvals use the dated
workflow under `design/reviews/`.
