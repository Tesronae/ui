# Repository instructions

## Scope

This repository, `Tesronae/ui` (published as `@tesronae/ui`), owns reusable design
tokens, icons, generic components, motion patterns, and their Storybook catalog.
Product composition, domain behaviour, and application verification belong in the
consumer, `IMS-web` — that repository's `AGENTS.md`/`CLAUDE.md`/`DESIGN.md` govern
that side. `IMS-web`'s `DESIGN.md` §5 ("Shared design and delivery workflow") is the
joint contract both repositories follow; this file applies that contract's
generic-package half here and does not restate it.

## Non-negotiable invariants

- **No consumer-specific behaviour.** Nothing here imports Next.js, an i18n library,
  or an IMS domain concept. A component that only makes sense for IMS belongs in
  `IMS-web`'s own `src/components/`, not here.
- **`src/index.ts` is the only stable import surface.** Only `Production`-tier work
  is exported from it. Anything not exported is not a public API and can change
  without a deprecation cycle.
- **Existing story IDs and URLs stay stable.** Do not rename or move a story to
  signal a maturity change; maturity is tracked as metadata (target state; current
  interim mechanism and its supersession are in `design/docs/sandbox.md`).
- **Tokens are edited only in `design/tokens/tokens.json`.** Run `npm run
  build:tokens` after any change; never hand-edit generated `dist/tokens.css`.
- **A breaking change to `src/index.ts`'s public API needs a version bump, a
  changelog/migration note, and advance notice to `IMS-web`** before that repo
  updates its pinned dependency.

## Daily contribution path

Follow `IMS-web` `DESIGN.md` §5's seven steps, applied to package work:

1. **Define** the user task and cite the `IMS-web` `SPEC.md` acceptance/UX criteria
   it serves, or state that it is a routine fix needing no proposal.
2. **Reuse or experiment**: check `src/components/ui/`, its stories, and
   `design/docs/` before adding an alternative. Keep the change the smallest
   coherent one.
3. **Verify in isolation**: `npm run typecheck`, `npm run lint`, `npm run test`,
   `npm run build:tokens` (reproducible output), `npm run build-storybook`.
   Exercise the component's states, keyboard behaviour, focus, narrow layouts,
   long content, direction (RTL), and reduced motion in Storybook. A new or
   materially changed interactive primitive also needs a manual screen-reader
   pass — automated accessibility checks do not substitute for it.
4. **Verify in context**: pack the candidate (`npm pack` or an equivalent tarball
   build) and install it into a temporary `IMS-web` checkout to exercise the
   intended consumer flow — exports, CSS, icons, and representative interactions —
   before asking `IMS-web` to adopt it.
5. **Review**: run the Vercel `web-design-guidelines` audit; apply Impeccable for
   visual critique and Emil Kowalski skills for motion where relevant. Material
   visual/interaction changes need the repository owner's named-commit approval;
   a screenshot alone does not establish motion quality — capture a recording.
6. **Release and adopt**: tag a release only once package gates pass on that tag,
   publish the exact verified tarball to GitHub Packages, and write a changelog/
   migration note for any breaking change. `IMS-web` then pins the new version,
   updates its lockfile, and reruns its own checks; keep the prior version and
   lockfile revision available so that adoption can be rolled back.
7. **Learn**: record regressions or recurring consumer workarounds against the
   affected component's story or `design/docs/` entry.

## Storybook

- Local dev server: port **6007** (`npm run storybook`). `IMS-web`'s own product
  Storybook uses **6006** — the two must stay distinct since a consumer may run
  both at once.
- Sections: Foundations, Components, Patterns, Playground. Keep experiments out of
  published files and `src/index.ts` exports; a `Candidate` may ship in a
  prerelease artifact for consumer testing, a `Stable` release contains approved
  public API only.
- The passing default-branch Storybook is the public catalog (GitHub Pages, once
  configured — see `IMS-web` `TASKS.md` W1.3.15's infrastructure note for current
  status). A PR's own build, screenshots, and recordings are reviewed against that
  PR's commit, not the published catalog.

## Verification

- Run `npm run typecheck`, `npm run lint`, and `npm run test` before any commit
  that touches `src/`.
- Run `npm run build:tokens` and confirm reproducible output before any commit
  that touches `design/tokens/`.
- For a material visual/interaction change, also build Storybook and check the
  affected story renders correctly in both themes and at narrow viewports.
- Do not report a change as done because the source looks plausible; state what
  was actually run.

## Documentation routing

- `design/docs/principles.md` — generic visual/interaction principles, responsive
  rules, accessibility, i18n.
- `design/docs/motion.md` and `design/docs/animation-pipeline.md` — motion values
  and the reference → recreate → adapt → promote flow.
- `design/docs/components.md` — the generic component/pattern inventory.
- `design/docs/sandbox.md` — the maturity ladder and its current migration status.
- `README.md` — install, usage, and package structure for consumers.
- `IMS-web`'s `DESIGN.md` §5 — the joint delivery workflow this file applies.
