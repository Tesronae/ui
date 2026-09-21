# Design principles

Visual and interaction principles for this app. `design/tokens/tokens.json` is the
value authority (colour, spacing, radius, elevation, font, motion); this file is the
authority for *how* those values get used. See `DESIGN.md` for how this file fits into
the overall source-of-truth hierarchy and skill governance.

Do not maintain a second manually copied table of every colour/spacing value in this
file — duplicated token tables drift. Reference `design/tokens/tokens.json` and
`src/styles/tokens.css` directly.

---

## Using tokens

Production visual values come from `design/tokens/tokens.json`, generated into
`src/styles/tokens.css`. Do not create local one-off values merely to make one screen
look better.

When a needed value does not exist:

1. check whether an existing token should be used;
2. if not, add it to `design/tokens/tokens.json` and regenerate (`npm run build:tokens`);
3. use the token through `var(--token-name)` in a CSS Module, matching the existing
   components under `src/components/ui/`.

---

## Designing without a precedent

There is no mockup stage in this pipeline (`DESIGN.md` §1/§2) and, for a genuinely new
screen or pattern, no sibling screen to copy either. That is not a blocker — it means
the design gets decided directly in code, using `PRODUCT.md` as the brief a designer
would otherwise supply, not by inventing visual language freely.

1. Fix what the screen must *do* from `SPEC.md`'s `AC-*`/`UX-*` criteria first —
   behaviour is never yours to invent, only presentation is.
2. Read `PRODUCT.md` in full before laying anything out. Two sections there stand in
   for a creative brief:
   - **UX priority order**, for every close call: Correctness → Speed → Comprehension →
     Accessibility → Consistency → Visual craft → Delight. Visual craft never wins
     against speed or comprehension in this product.
   - **Product personality**: precise, quiet, fast, trustworthy, operational — and
     explicitly *not* a marketing-site dashboard, a decorative fintech UI, a collection
     of unrelated cards, a gradient-heavy design exercise, or an animation showcase.
3. Compose a first draft from existing primitives (`src/components/ui/`) and existing
   patterns (`design/docs/components.md`'s pattern list — page header, filter row,
   empty state, permission-restricted state, form sections). A first draft is assembly,
   not invention; reach for a new primitive only once assembly genuinely can't cover it.
4. Build it as a real component and story, then look at it — Storybook for the
   isolated state, `npm run design:preview` for it in real navigation.
5. Run the **Impeccable** skill against the draft. This step is the literal substitute
   for "ask a designer" — it critiques and polishes what was assembled against this
   system's own visual principles (below), not a fresh redesign from nothing.
6. Iterate: adjust, look again, re-run Impeccable only if the shape changed materially,
   not after every micro-edit.
7. Close with the **Vercel `web-design-guidelines`** audit, same as any other material
   UI change (`DESIGN.md` §4).
8. The shipped component and story *are* the design record — there is no separate
   artifact to file. Add a row to `design/docs/components.md`'s inventory so the next
   screen with no precedent has this one as its sibling to copy.

---

## Visual design principles

### Operational, not decorative

This is a work application used under time pressure. The interface should be visually
quiet enough that stock state, actions, and exceptions dominate attention.

### Hierarchy comes primarily from structure

Prefer hierarchy through:

- typography;
- spacing;
- alignment;
- density;
- contrast;
- grouping.

Do not reach for extra colour, shadows, borders, or cards when structure can
communicate the hierarchy.

### Avoid card proliferation

Do not wrap every section in a floating container. Use cards only when the design
meaningfully requires a contained object or surface.

### Colour is load-bearing

Use semantic colour consistently. Broad meanings established by the existing design
system:

- green — positive/inward/healthy;
- red — negative/outward/error/destructive;
- amber — warning/at-or-below threshold;
- blue/accent — interactive/focus/selected state;
- neutral ink scale — ordinary information and most charts.

Do not make status/data charts colourful for decoration.

### Typography carries density

Operational tables, product identifiers, quantities, SKUs, and movement timestamps
should remain highly scannable. Use monospaced/tabular treatment where the established
system calls for it (`--mono`, `src/styles/tokens.css`).

---

## Type scale, line height, weight, and layering

Every `font-size`, `line-height`, `font-weight`, and `z-index` declaration in
`src/components/**/*.module.css` and `src/app/**/*.module.css` must be a token
(`var(--fs-*)`, `var(--lh-*)`, `var(--fw-*)`, `var(--z-*)`). `stylelint`
(`.stylelintrc.json`, run by `npm run lint`) enforces this — a raw literal fails CI.

### Type scale

Ten steps, `--fs-0` through `--fs-9`. Values collapsed from the 14 literals ported
verbatim from the legacy prototype; where two adjacent half-pixel literals existed
(e.g. `12px`/`12.5px`), the less-used one was rounded into whichever value already had
more call sites, so the merge changes the fewest declarations. `--fs-5: 16px` is the one
exception kept exact rather than rounded — it is the mobile input font-size on
`Counter`'s scan and quantity fields, where anything under 16px triggers iOS Safari's
auto-zoom-on-focus. Do not round it toward `--fs-4`/`--fs-6`.

### Line height

Unitless everywhere except `--lh-box: 18px`, used only where the line-height is
matched to an explicit fixed single-line box height (`Topbar`'s search shortcut kbd,
`Select`'s option row) rather than governing paragraph flow — a genuinely pixel-based
case, not a drifted literal.

### Layering

`--z-icon` (1) through `--z-skiplink` (100) name each fixed/sticky/absolutely
positioned element's actual role — `--z-icon` (an icon inside a search field),
`--z-sticky` (the topbar), `--z-results` (the counter search-results dropdown),
`--z-mobile-nav` (the sub-720px bottom tab bar), `--z-menu` (the org/user popover),
`--z-listbox` (a `Select` dropdown), `--z-toast`, `--z-modal`, `--z-skiplink`. The
numeric values are unchanged from the legacy prototype; only the names are new. Do not
introduce a new fixed/sticky/absolute element with a raw z-index — add a named step
here first.

### Breakpoints

Four widths recur as literal `@media` queries (custom properties cannot be read inside
a media query, so these are not emitted as CSS custom properties):

| Breakpoint | Used for |
| --- | --- |
| `600px` (min-width) | `OrgMenu` reveals the name/role identity text beside the avatar |
| `720px` (max-width) | The primary mobile breakpoint — bottom nav, stacked tables, single-column layouts |
| `860px` (max-width) | `Dashboard`'s metric grid steps from 4 to 2 columns before the full mobile layout |
| `1080px` (max-width) | `Dashboard`'s two-column split collapses to one column |

Use one of these four values for a new breakpoint; do not introduce a fifth without
updating this table.

### Documented exceptions

A small number of `padding`/`margin`/`gap`/`border-radius` declarations are
sub-4px-scale or otherwise not token-shaped by design (a 1px hairline inset that hugs a
1px border, a 2–3px gap/radius on an 6–8px element, a `calc()` combining a token with
`env(safe-area-inset-bottom)`, the 96px mobile bottom-nav clearance repeated across page
shells). Each carries an inline `stylelint-disable-next-line` comment explaining why —
grep `declaration-property-value-allowed-list` in `src/**/*.module.css` to find them
all. Do not silence the lint rule file-wide to work around a new one; justify it inline
or use a token.

---

## Interaction design

Interaction requirements defined in `SPEC.md` remain authoritative.

Design work should explicitly account for:

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

## Responsive design

Responsive behaviour comes from real content constraints, not from shrinking desktop.

Check:

- navigation model;
- table transformation;
- action placement;
- input ergonomics;
- touch targets;
- long labels;
- number alignment;
- safe-area behaviour;
- modal/dialog behaviour;
- on-screen keyboard interaction where relevant.

The current application already uses a bottom navigation treatment at sub-720px
(`src/components/shell/`) and stacked table records at narrow widths
(`DataTable`'s `attr(data-l)` technique) — preserve or intentionally redesign these
behaviours deliberately, not as a side effect of an unrelated change.

---

## Accessibility

The accessibility target remains canonical in `SPEC.md`.

Design and implementation must preserve:

- semantic HTML;
- keyboard access;
- visible focus;
- meaningful accessible names;
- sufficient contrast;
- non-colour-only communication;
- sensible touch targets;
- reduced-motion support.

If a visual idea would require inaccessible markup, preserve the visual intent while
implementing correct semantics — accessibility wins the conflict, not the mockup.

---

## Internationalization and RTL

Every user-facing string goes through the existing i18n system (`next-intl`,
`messages/en.json`).

Do not bake English-only assumptions into:

- fixed text widths;
- left/right-specific layout when logical properties can be used;
- icons whose meaning reverses in RTL;
- truncated labels without accessible alternatives;
- table/header sizing.

Arabic/RTL arrives in a later phase, but components created now should not make it
unnecessarily expensive.

---

## Known gaps (pre-existing, not yet fixed)

- **Partial token coverage.** Colour, spacing, radius, elevation, font-family,
  duration, font size, line height, font weight, and z-index are tokenized (see "Type
  scale, line height, weight, and layering" above). Letter spacing, component heights
  (`Button` 34px/28px, `Chip` 30px), and breakpoints (documented as a literal-value
  table above, not tokens — custom properties don't work inside `@media`) remain raw.
  Tokenizing letter-spacing/heights is a separate design-system task.
- **Untokenized scrim.** `src/components/ui/Modal.module.css` uses a raw
  `rgba(15, 19, 25, 0.35)` for its backdrop — the only raw colour outside `Icon.tsx`.
  The lint rule at `eslint.invariant-rules.mjs`'s `noHardcodedStyleInComponentsConfig`
  bans hex literals but not `rgba()`, so this does not currently fail lint.
