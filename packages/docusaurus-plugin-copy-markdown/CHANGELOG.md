# @gracefullight/docusaurus-plugin-copy-markdown

## [0.2.0](https://github.com/gracefullight/docusaurus-plugins/compare/docusaurus-plugin-copy-markdown-v0.1.3...docusaurus-plugin-copy-markdown-v0.2.0) (2026-05-31)


### Features

* **copy-markdown:** ✨ use emphasis-300 for button outline and icon ([326e6cf](https://github.com/gracefullight/docusaurus-plugins/commit/326e6cf77f03e01f8961149ee10609bccdd8b8f6))

## 0.1.3

### Patch Changes

- cf48248: Place the blog copy button below the post header (after the author/date metadata) instead of wedging it between the title and the profile. Docs pages keep the button directly under the title. The insertion logic is now split into a dependency-free `dom` module with DOM regression tests covering blog post, blog list, and docs pages.

## 0.1.2

### Patch Changes

- ef713fd: Fix the published client module path so Docusaurus loads built JavaScript instead of source TypeScript.

## 0.1.1

### Patch Changes

- Improve copy button placement below the page title, add theme-independent outline styling, and default alignment to the right.

## 0.1.0

### Minor Changes

- Initial release: copy docs and blog source markdown to the clipboard with a single button below the page title.
