import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// This repo doesn't enable Vitest's `globals: true` (describe/it/expect are
// imported explicitly everywhere) — @testing-library/react's automatic
// cleanup-after-each-test relies on detecting a global `afterEach`, which
// doesn't exist here, so without this it silently never fires and DOM nodes
// from earlier tests in the same file accumulate. Confirmed directly: a
// multi-render test failed with "multiple elements found" before this was
// added, passed after.
afterEach(() => {
  cleanup();
});
