/**
 * Build a browser-ready service worker at public/sw.js.
 * injectManifest only injects the precache list — esbuild bundles TS/ESM after.
 */
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { injectManifest } from "@serwist/build";
import * as esbuild from "esbuild";

const injectedSwPath = ".serwist/sw-injected.js";

await mkdir(".serwist", { recursive: true });

const revision =
  process.env.CF_PAGES_COMMIT_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  randomUUID();

const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: injectedSwPath,
  globDirectory: ".next",
  globPatterns: [
    "static/chunks/**/*.js",
    "static/chunks/**/*.css",
    "static/media/**/*",
  ],
  globIgnores: ["**/node_modules/**", "**/*.map"],
  modifyURLPrefix: {
    static: "/_next/static",
  },
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

await esbuild.build({
  entryPoints: [injectedSwPath],
  outfile: "public/sw.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: true,
  sourcemap: true,
  loader: { ".js": "ts" },
});

console.log(`Serwist: wrote public/sw.js (${count} precache entries, ${size} bytes)`);

if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(warning);
  }
}
