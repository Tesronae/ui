# Sheet motion review — 2026-10-09

Owner approval in chat: candidate `d1e9237f69154f78b206c10a6150b32ce9d947bb`,
cherry-picked as `a359185` onto release/drawer-motion-0.3.10.
Owner explicitly chose “Waive this check for this release” for the unavailable
manual screen-reader review. This exception applies only to 0.3.10; it does not
change the review policy. Automated checks are not a substitute for that review.

Reviewed changes: interruptible panel entry/exit and fading backdrop using the
existing 250ms/ease-out tokens, inert retained exit content, immediate focus and
scroll restoration, mobile direction, RTL and reduced-motion behavior.

Observed verification in this local fixture environment:

- UI: 147 tests, typecheck, lint, deterministic tokens, Storybook build and packed-consumer verification.
- Chromium/Playwright: 1440px and 390px; light and dark/RTL; normal and reduced motion; focus return, inert outgoing content, rapid reopening and cleanup.
- Packed candidate in an isolated IMS dashboard: inventory and not-selling drawers open, exit and reopen at both widths; 94 relevant consumer tests and typecheck passed.
- Impeccable and Web Design Guidelines review: no unresolved material findings in the change.

Story: Components/Sheet/Floating. English locale; RTL exercises layout direction
with English copy. Recordings were captured under /tmp/ims-drawer-motion-review
and /tmp/ims-drawer-integration-review during this session. Live backend latency
and real-device gestures were not measured.
