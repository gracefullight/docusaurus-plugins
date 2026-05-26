# @gracefullight/docusaurus-plugin-copy-markdown

Add a single **Copy page as Markdown** button below the title on Docusaurus docs and blog pages. Copied content comes from the source markdown file with frontmatter removed.

## Installation

```bash
bun add @gracefullight/docusaurus-plugin-copy-markdown
```

## Usage

Add the plugin to your `docusaurus.config.ts`:

```typescript
export default {
  plugins: ["@gracefullight/docusaurus-plugin-copy-markdown"],
};
```

The button appears below the page title on docs and blog post pages that have a source markdown file.

### Customize the button label

By default, labels are **English** (`Copy page as Markdown`, `Copied!`). Override only when you need a fixed string for all locales:

```typescript
export default {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-copy-markdown",
      {
        buttonLabel: "Copy as Markdown",
        copiedLabel: "Copied!",
      },
    ],
  ],
};
```

The label is also used for the button's `aria-label` for screen readers. When set, it overrides locale translations.

## Internationalization

The plugin registers **English** default messages via Docusaurus `getDefaultCodeTranslationMessages`. Other locales override them in `i18n/[locale]/code.json`.

### 1. Enable i18n in Docusaurus

```typescript
export default {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ko"],
  },
};
```

### 2. Extract translation keys

```bash
bunx docusaurus write-translations
```

This writes keys into `i18n/[locale]/code.json`. The plugin uses:

| ID | Default (en) |
| --- | --- |
| `copyMarkdown.buttonLabel` | `Copy page as Markdown` |
| `copyMarkdown.copiedLabel` | `Copied!` |

### 3. Translate for each locale

```json
{
  "copyMarkdown.buttonLabel": {
    "message": "마크다운으로 페이지 복사"
  },
  "copyMarkdown.copiedLabel": {
    "message": "복사됨!"
  }
}
```

At runtime the client reads `@generated/codeTranslations` for the active locale.

### Override translations with plugin options

`buttonLabel` and `copiedLabel` in plugin options always win over `code.json` (useful for monolingual sites or fixed copy).

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `stripFrontmatter` | `boolean` | `true` | Remove YAML frontmatter from copied content |
| `injectTitleFromFrontmatter` | `boolean` | `true` | Prepend `# title` when the body has no leading heading |
| `buttonLabel` | `string` | _(from i18n)_ | Visible button label; overrides locale translation |
| `copiedLabel` | `string` | _(from i18n)_ | Success feedback label; overrides locale translation |
| `buttonClassName` | `string` | `"button button--outline button--sm"` | Button CSS classes |
| `includeDocs` | `boolean` | `true` | Process documentation pages |
| `includeBlog` | `boolean` | `true` | Process blog posts |

## Behavior

- Reads `.md` / `.mdx` source files at build time through Docusaurus content plugins.
- Strips frontmatter and lightly cleans MDX imports and JSX comments from copied text.
- Injects one button directly below the title header on each supported page.
- Copies processed markdown to the clipboard when clicked.

## Limitations

- Copied content reflects **source files**, not fully rendered MDX output.
- MDX-heavy pages may still contain JSX in copied text.
- The clipboard API requires HTTPS or `localhost`.
- Tag, archive, author, and search pages are excluded automatically.

## License

MIT
