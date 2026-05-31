# @gracefullight/docusaurus-plugin-copy-markdown

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
