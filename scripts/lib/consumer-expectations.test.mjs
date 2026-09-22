import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  EXPECTED_EXPORTS,
  EXPECTED_PACKED_FILES,
  verifyExports,
  verifyIconRegistry,
  verifyPackedFiles,
} from "./consumer-expectations.mjs";

describe("verifyExports", () => {
  it("passes when every expected export is present and defined", () => {
    const mod = Object.fromEntries(EXPECTED_EXPORTS.map((name) => [name, {}]));
    expect(() => verifyExports(mod)).not.toThrow();
  });

  it("names the missing export when one is undefined", () => {
    const mod = Object.fromEntries(EXPECTED_EXPORTS.map((name) => [name, {}]));
    delete mod.Button;
    expect(() => verifyExports(mod)).toThrow(/Button/);
  });

  it("names every missing export, not just the first", () => {
    const mod = Object.fromEntries(EXPECTED_EXPORTS.map((name) => [name, {}]));
    delete mod.Button;
    delete mod.Toast;
    let error;
    try {
      verifyExports(mod);
    } catch (thrown) {
      error = thrown;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain("Button");
    expect(error.message).toContain("Toast");
  });
});

describe("verifyIconRegistry", () => {
  it("passes when ICON_NAMES and ICONS agree and are non-empty", () => {
    expect(() => verifyIconRegistry({ a: 1, b: 2 }, ["a", "b"])).not.toThrow();
  });

  it("fails when ICONS is empty", () => {
    expect(() => verifyIconRegistry({}, [])).toThrow(/empty/);
  });

  it("fails when the counts disagree", () => {
    expect(() => verifyIconRegistry({ a: 1, b: 2 }, ["a"])).toThrow(/!==/);
  });
});

describe("verifyPackedFiles", () => {
  let dir;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it("passes when every expected file exists under the given root", () => {
    dir = mkdtempSync(join(tmpdir(), "ui-consumer-expectations-"));
    for (const rel of EXPECTED_PACKED_FILES) {
      const full = join(dir, rel);
      mkdirSync(join(full, ".."), { recursive: true });
      writeFileSync(full, "");
    }
    expect(() => verifyPackedFiles(dir)).not.toThrow();
  });

  it("names the missing path when a file is absent", () => {
    dir = mkdtempSync(join(tmpdir(), "ui-consumer-expectations-"));
    const [first] = EXPECTED_PACKED_FILES;
    const full = join(dir, first);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, "");
    const missing = EXPECTED_PACKED_FILES.slice(1);
    let error;
    try {
      verifyPackedFiles(dir);
    } catch (thrown) {
      error = thrown;
    }
    expect(error).toBeDefined();
    for (const rel of missing) {
      expect(error.message).toContain(rel);
    }
    expect(error.message).not.toContain(first);
  });
});
