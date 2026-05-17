/**
 * Build the service worker into public/sw.js (static file).
 * Served as a static file from public/ (works with OpenNext on Cloudflare).
 */
import { randomUUID } from "node:crypto";
import { injectManifest } from "@serwist/build";

const revision =
  process.env.CF_PAGES_COMMIT_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  randomUUID();

const { count, size, warnings } = await injectManifest({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  globDirectory: ".next",
  globPatterns: [
    "static/chunks/**/*.js",
    "static/chunks/**/*.css",
    "static/media/**/*",
  ],
  globIgnores: ["**/node_modules/**", "**/*.map"],
  maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

console.log(`Serwist: wrote public/sw.js (${count} precache entries, ${size} bytes)`);

if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(warning);
  }
}
