# Copy Markdown Plugin

> Add `@gracefullight/docusaurus-plugin-copy-markdown` — single copy button below title on docs and blog pages, source-based markdown without frontmatter.

**Status**: Completed  
**Created**: 2026-05-26  
**Owner**: gracefullight / agent

## Goal

Ship a publishable Docusaurus plugin that copies stripped source markdown to the clipboard from docs and blog post pages via one button placed below the page title, demonstrated in `apps/docs`.

## Context

- Approved design: `docs/plans/designs/copy-markdown-plugin.md`
- Monorepo pattern: small plugins in `packages/`, tsup CJS build, Joi validation (see `docusaurus-plugin-sentry`)
- Turbo generator scaffolds `injectHtmlTags` plugins; this plugin needs `allContentLoaded`, `setGlobalData`, and `getClientModules` (new pattern for this repo)
- Example app `apps/docs` currently has `blog: false`

## Constraints

- Docusaurus ^3 only
- Source-based copy (no HTML fallback in v1)
- Strip frontmatter; inject `# title` when body lacks H1
- Single button, no dropdown, no AI shortcuts, no `.md` URLs
- Match existing package conventions: `@gracefullight/` scope, Biome, changeset

## Tasks

| # | Task | Agent | Priority | Status | Dependencies |
|---|------|-------|----------|--------|--------------|
| 1 | Scaffold `packages/docusaurus-plugin-copy-markdown` (package.json, tsconfig, tsup dual entry, CHANGELOG stub) | backend | P0 | DONE | — |
| 2 | Implement `markdown-processor.ts` (gray-matter, strip frontmatter, title injection, light MDX cleanup) | backend | P0 | DONE | 1 |
| 3 | Implement `route-collector.ts` (walk docs/blog routes from `allContentLoaded`, skip index/tag/archive pages) | backend | P0 | DONE | 1 |
| 4 | Implement plugin `index.ts` (Joi options, `allContentLoaded` → `setGlobalData`, `getClientModules`, `validateOptions`) | backend | P0 | DONE | 2, 3 |
| 5 | Implement client module `copy-markdown-button.ts` (pathname lookup, DOM injection below title, clipboard + "Copied!" feedback, SPA cleanup) | frontend | P0 | DONE | 4 |
| 6 | Wire `apps/docs` (enable blog, sample post, workspace plugin dep, config) | frontend | P1 | DONE | 4, 5 |
| 7 | Write README (install, options, limitations) + add `.changeset` for initial release | docs | P1 | DONE | 6 |
| 8 | QA: `bun run build`, `apps/docs` dev/build, verify button on docs intro + blog post | qa | P1 | DONE | 7 |

## Done When

- [x] `@gracefullight/docusaurus-plugin-copy-markdown` builds cleanly via `bun run --filter @gracefullight/docusaurus-plugin-copy-markdown build`
- [x] Plugin registers processed markdown in globalData for docs and blog routes with source files
- [x] Copy button appears below title on docs and blog pages in `apps/docs`
- [x] Clicking copies frontmatter-free markdown; title present when sourced from frontmatter
- [x] Button does not appear on tag/archive/index pages
- [x] README documents options and v1 limitations
- [x] Changeset added for package bump

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-26 | Source-based copy, no HTML fallback | Predictable LLM-friendly output; matches brainstorm |
| 2026-05-26 | Client DOM injection over theme swizzle | Zero-config install; swizzle deferred to v1.1 |
| 2026-05-26 | Single button, copy only | User requirement; no dropdown |
| 2026-05-26 | Complexity: Medium | New package + client module + example app; no cross-service API |

## Progress Notes

- [2026-05-26] Plan created from approved brainstorm design
- [2026-05-26] Implementation complete: plugin package, apps/docs demo, README, changeset; lint and build pass
