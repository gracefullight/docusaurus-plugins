# Copy Markdown client module packaging bug

Date: 2026-05-29

Symptom: Published @gracefullight/docusaurus-plugin-copy-markdown v0.1.1 exposed `src/client/copy-markdown-button.ts` through `getClientModules()`. Docusaurus/Rspack treated the TypeScript file under node_modules as plain JavaScript and failed on `import type` with `Expected ',', got '{'`.

Root cause: The package build only compiled `src/index.ts`, while `package.json#files` included `src/client`. The server plugin returned a source TypeScript path instead of a built client JavaScript artifact.

Fix applied: Build `src/client/copy-markdown-button.ts` as a second tsup entry, externalizing Docusaurus virtual/client aliases; return the generated `dist/client/copy-markdown-button.js` path from `getClientModules()`; restrict npm files to `dist`; add a declaration for `@docusaurus/ExecutionEnvironment`; add Vitest coverage for the client module path and package files.

Validation: `bun run --filter @gracefullight/docusaurus-plugin-copy-markdown test`, targeted package build, `npm pack --dry-run --json`, requiring `dist/index.js` to inspect `getClientModules()`, and root `bun run build` all passed.

Similar pattern scan: `getClientModules()` only exists in `packages/docusaurus-plugin-copy-markdown/src/index.ts`; no other packages showed the same source-client-module pattern.