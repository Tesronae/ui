// Single source of truth for what a consumer of the packed @tesronae/ui
// tarball is entitled to expect (TASKS.md W1.3.11). Read by
// scripts/verify-packed-consumer.mjs and its own test — a new export added
// to src/index.ts, or a new entry added to package.json's "exports" map,
// only needs to be added to the lists below once.
import { existsSync } from "node:fs";
import { join } from "node:path";

// Kept in sync by hand with src/index.ts's value exports (type-only exports
// — IconName, Column, SelectOption, RingSegment — aren't runtime-checkable
// here; a consumer's own `tsc` against this package's shipped .ts source
// already covers those).
export const EXPECTED_EXPORTS = [
  "Icon",
  "ICONS",
  "ICON_NAMES",
  "BarChart",
  "Button",
  "Checkbox",
  "Chip",
  "DataTable",
  "Metric",
  "Modal",
  "Notice",
  "Pill",
  "Select",
  "Skeleton",
  "Sparkline",
  "TextField",
  "Toast",
  "buildRingArcs",
  "RingGauge",
  "DotField",
  "buildDotGrid",
  "stepDots",
];

// Mirrors package.json's "exports" map plus the one CSS-module re-export
// (DataTable.module.css) IMS-web's own barrel imports directly.
export const EXPECTED_PACKED_FILES = [
  "dist/tokens.css",
  "design/tokens/tokens.json",
  "src/components/ui/DataTable.module.css",
];

export function verifyExports(mod, expected = EXPECTED_EXPORTS) {
  const missing = expected.filter((name) => mod[name] === undefined);
  if (missing.length > 0) {
    throw new Error(`missing/undefined export(s): ${missing.join(", ")}`);
  }
}

export function verifyIconRegistry(icons, names) {
  if (!icons || !names) throw new Error("ICONS or ICON_NAMES missing");
  const iconKeys = Object.keys(icons);
  if (iconKeys.length === 0) throw new Error("ICONS is empty");
  if (names.length === 0) throw new Error("ICON_NAMES is empty");
  if (names.length !== iconKeys.length) {
    throw new Error(
      `ICON_NAMES.length (${names.length}) !== Object.keys(ICONS).length (${iconKeys.length})`,
    );
  }
}

export function verifyPackedFiles(pkgRootDir, expected = EXPECTED_PACKED_FILES) {
  const missing = expected.filter((relPath) => !existsSync(join(pkgRootDir, relPath)));
  if (missing.length > 0) {
    throw new Error(`missing packed file(s): ${missing.join(", ")}`);
  }
}
