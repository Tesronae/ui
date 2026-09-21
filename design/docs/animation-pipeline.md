# Animation pipeline

How a motion reference becomes a reusable, tokenized animation.

```
Reference          A real animation worth learning from — a screen
                    recording, a GIF, a link to the live product.

  ↓ recreate

Experiments/*       Rebuilt here first, matching the reference as closely
                    as reasonable, before any adaptation. Proves the
                    mechanism is understood, not yet that it belongs here.

  ↓ adapt

Experiments/*       Same story, now driven by this package's own motion
(updated)           tokens (design/tokens/tokens.json's motion values —
                    duration, easing) instead of the reference's own
                    numbers. This is the step that actually integrates it.

  ↓ review

Approved/*          Promoted once it's reviewed against `design/docs/
                    motion.md`'s own rules (reduced-motion behaviour,
                    interrupt handling, what's allowed to animate at all).

  ↓ extract

src/components/ui/  A real component, exported from src/index.ts,
                    covered by a test. Only now is it something another
                    project can depend on.
```

A reference never skips straight to `Approved/` or to `src/`. The
`Experiments/` stop is where the false starts happen — cheap to discard
there, expensive to discard once it's an exported component with
consumers.
