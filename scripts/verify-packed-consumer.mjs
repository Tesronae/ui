#!/usr/bin/env node
// TASKS.md W1.3.11 (IMS-web): verifies the actual packed tarball — not the
// source tree — resolves and runs the way a real consumer's `npm install`
// would. Run by hand before asking IMS-web to adopt a candidate version,
// and wired into .github/workflows/publish.yml before every tag's publish.
//
// The scratch install lives under node_modules/.verify-packed-consumer/ —
// already gitignored, and (this is the point) nested inside this package's
// own node_modules so Node's normal module resolution walk-up finds this
// repo's already-installed react/react-dom/vite from the extracted
// package's own src/index.ts without any manual path aliasing, the same
// way a real bundler would resolve peer dependencies.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  verifyExports,
  verifyIconRegistry,
  verifyPackedFiles,
} from "./lib/consumer-expectations.mjs";

const ROOT = process.cwd();
const VERIFY_DIR = join(ROOT, "node_modules", ".verify-packed-consumer");
const CONSUMER_DIR = join(VERIFY_DIR, "consumer");
const BUILD_OUT_DIR = join(VERIFY_DIR, "dist");

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", ...opts });
}

function step(label) {
  console.log(`\n> ${label}`);
}

async function main() {
  step("Building tokens (so dist/tokens.css exists before packing)");
  run("npm", ["run", "build:tokens"], { cwd: ROOT, stdio: "inherit" });

  rmSync(VERIFY_DIR, { recursive: true, force: true });
  mkdirSync(VERIFY_DIR, { recursive: true });
  mkdirSync(CONSUMER_DIR, { recursive: true });

  step("Packing tarball");
  const packOutput = run("npm", ["pack", "--json", "--pack-destination", VERIFY_DIR], {
    cwd: ROOT,
  });
  const [{ filename }] = JSON.parse(packOutput);
  const tarballPath = join(VERIFY_DIR, filename);
  console.log(`  ${tarballPath}`);

  step(`Installing the packed tarball into a scratch consumer (${CONSUMER_DIR})`);
  run("npm", ["init", "--yes"], { cwd: CONSUMER_DIR });
  run("npm", ["install", tarballPath, "--no-save"], { cwd: CONSUMER_DIR });

  const pkgRoot = join(CONSUMER_DIR, "node_modules", "@tesronae", "ui");

  step("Checking packed files against package.json's exports map");
  verifyPackedFiles(pkgRoot);
  console.log("  ok");

  step("Bundling the installed package's entry with Vite (as a real consumer's bundler would)");
  const { build } = await import("vite");
  await build({
    configFile: false,
    logLevel: "warn",
    // Plain esbuild's default JSX transform is classic (expects a global
    // `React`); this package's tsconfig uses "jsx": "react-jsx" (automatic
    // runtime, no React import needed) — match it, or every component
    // fails at runtime with "React is not defined".
    esbuild: { jsx: "automatic" },
    build: {
      lib: {
        entry: join(pkgRoot, "src", "index.ts"),
        formats: ["es"],
        fileName: () => "verify-bundle.mjs",
      },
      outDir: BUILD_OUT_DIR,
      emptyOutDir: true,
      minify: false,
    },
  });
  const [bundleFile] = readdirSync(BUILD_OUT_DIR).filter((name) => name.endsWith(".mjs"));
  if (!bundleFile) throw new Error("Vite build produced no .mjs bundle");

  step("Importing the bundle and checking exports");
  const mod = await import(pathToFileURL(join(BUILD_OUT_DIR, bundleFile)).href);
  verifyExports(mod);
  console.log("  ok");

  step("Checking the icon registry");
  verifyIconRegistry(mod.ICONS, mod.ICON_NAMES);
  console.log(`  ok (${Object.keys(mod.ICONS).length} icons)`);

  step("Representative interaction: rendering Button and Notice");
  const buttonHtml = renderToStaticMarkup(
    createElement(mod.Button, { onClick: () => {} }, "Verify"),
  );
  if (!buttonHtml.includes("Verify") || !/class="/.test(buttonHtml)) {
    throw new Error(`Button did not render as expected: ${buttonHtml}`);
  }
  const noticeHtml = renderToStaticMarkup(
    createElement(mod.Notice, { icon: "info", title: "Verify title" }, "Verify body"),
  );
  if (
    !noticeHtml.includes("Verify title") ||
    !noticeHtml.includes("Verify body") ||
    !/class="/.test(noticeHtml)
  ) {
    throw new Error(`Notice did not render as expected: ${noticeHtml}`);
  }
  console.log("  ok");

  rmSync(VERIFY_DIR, { recursive: true, force: true });
  console.log("\nverify:packed passed.");
}

main().catch((error) => {
  console.error(`\nverify:packed FAILED: ${error.message}`);
  process.exitCode = 1;
});
