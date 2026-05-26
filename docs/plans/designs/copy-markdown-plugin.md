# Design: `@gracefullight/docusaurus-plugin-copy-markdown`

**Status:** Approved  
**Date:** 2026-05-26  
**Author:** Brainstorm session with gracefullight

## Goal

Build a new Docusaurus plugin in the `@gracefullight/docusaurus-plugins` monorepo that adds a **single "Copy page" button** below the page title on **docs and blog post pages**. Copied content comes from **source markdown/MDX files** with **frontmatter stripped**.

## Decisions

| Topic | Decision |
|-------|----------|
| Scope | Blog + docs in one plugin |
| Content strategy | Source-based (Approach 1); no HTML fallback in v1 |
| Frontmatter | Strip YAML block; optionally inject `# title` from frontmatter when body lacks H1 |
| UI | Single button below title; no dropdown; copy to clipboard only |
| Placement | Client-side DOM injection (zero swizzle); optional exported React component later |
| Example app | Enable blog in `apps/docs` with sample post |

## Architecture

```
packages/docusaurus-plugin-copy-markdown/
├── src/
│   ├── index.ts                 # plugin lifecycle, Joi validation
│   ├── markdown-processor.ts    # gray-matter parse, strip, light MDX cleanup
│   ├── route-collector.ts     # walk docs + blog routes from allContentLoaded
│   └── client/
│       └── copy-markdown-button.ts  # inject button, clipboard, SPA navigation
├── package.json
├── tsconfig.json
└── README.md
```

### Data flow

1. **Build (`allContentLoaded`)** — collect routes from docs/blog plugins, read `metadata.sourceFilePath`, process markdown, store in globalData.
2. **Runtime (client module)** — lookup by pathname, inject button below title, copy on click.

### Plugin options (v1)

```typescript
interface PluginOptions {
  stripFrontmatter?: boolean;           // default: true
  injectTitleFromFrontmatter?: boolean; // default: true
  buttonLabel?: string;                 // default: "Copy page"
  buttonClassName?: string;             // default: Infima outline button classes
  includeDocs?: boolean;                // default: true
  includeBlog?: boolean;                // default: true
}
```

### globalData shape

```typescript
type CopyMarkdownGlobalData = {
  routes: Record<
    string,
    {
      markdown: string;
      permalink: string;
      contentType: "docs" | "blog";
    }
  >;
};
```

Pathname keys stored with and without trailing slash.

## Build pipeline

### Hook

`allContentLoaded` — after docs and blog plugins register routes.

### Processing steps

1. Resolve `docusaurus-plugin-content-docs` and `docusaurus-plugin-content-blog` from `allContent`.
2. Walk routes; skip pages without `metadata.sourceFilePath`.
3. Parse with `gray-matter`; strip frontmatter block from output.
4. If `injectTitleFromFrontmatter` and body has no leading `# `, prepend `# {title}\n\n`.
5. Light MDX cleanup: remove `import` lines, `{/* comments */}` (regex-only in v1).
6. `actions.setGlobalData({ routes })`.

### Default excluded routes

- `/search`, `/404`
- `/blog/tags/**`, `/blog/archive`, `/blog/authors/**`
- Docs category/index pages without source files

## Runtime / DOM placement

### Client module

Registered via `getClientModules()`. Re-runs on SPA navigation; removes `[data-copy-markdown-button]` on route change.

### Title selectors (priority order)

**Docs:** `article .theme-doc-markdown header` → `article .markdown header` → `article header:has(h1)`

**Blog:** `article header` → `article .markdown header` → fallback `article h1`

### Inserted markup

```html
<div data-copy-markdown-button class="copy-markdown-button-container">
  <button type="button" class="button button--outline button--sm" aria-label="Copy page as Markdown">
    Copy page
  </button>
</div>
```

Inserted immediately after the title header block.

### Clipboard

- Primary: `navigator.clipboard.writeText`
- Fallback: hidden textarea + `execCommand('copy')`
- Success feedback: label → "Copied!" for 2s

## Package & dependencies

### Package name

`@gracefullight/docusaurus-plugin-copy-markdown`

### Runtime dependencies

| Package | Purpose |
|---------|---------|
| `@docusaurus/utils-validation` | Joi schema for options |
| `gray-matter` | Frontmatter parse/strip |

### Peer dependencies

- `@docusaurus/core` ^3

### Build

```json
{
  "scripts": {
    "build": "tsup src/index.ts src/client/copy-markdown-button.ts --format cjs --dts --minify"
  }
}
```

Client module path referenced in plugin:

```typescript
getClientModules() {
  return [require.resolve("./client/copy-markdown-button")];
}
```

### Scaffolding

Use existing turbo generator as baseline (`bun run gen`), then extend beyond the injectHtmlTags template.

## Example app (`apps/docs`)

1. Enable blog in `docusaurus.config.ts` preset (`blog: { routeBasePath: "blog" }` or default).
2. Add `blog/2026-05-26-welcome.md` sample post.
3. Register plugin (workspace reference):

```typescript
plugins: [
  ["@gracefullight/docusaurus-plugin-copy-markdown", {}],
],
```

4. Verify button appears below title on docs intro page and sample blog post.

## README scope

- Installation + one-line config
- Screenshot of single button placement
- Options table
- Frontmatter / title injection behavior
- MDX limitation note (source may contain JSX)
- Clipboard HTTPS requirement
- Excluded routes list

## v1 non-goals

- Dropdown menu / AI shortcuts (ChatGPT, Claude)
- `.md` URL routes (`/blog/post.md`)
- `llms.txt` generation
- HTML-to-markdown fallback
- i18n label overrides (English default only)
- Theme swizzle path (defer to v1.1 if DOM injection proves fragile)
- Versioned docs edge cases beyond default route walking

## Future (v1.1+)

- `injectButton: false` + exported `<CopyMarkdownButton />` for swizzle-based placement
- `excludeRoutes` config option
- i18n via Docusaurus translate or `labels` option
- HTML fallback for MDX-heavy pages

## Handoff

Ready for `/plan` task decomposition.
