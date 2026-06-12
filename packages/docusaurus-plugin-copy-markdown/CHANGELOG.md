# @gracefullight/docusaurus-plugin-copy-markdown

## [0.4.0](https://github.com/gracefullight/docusaurus-plugins/compare/docusaurus-plugin-copy-markdown-v0.3.0...docusaurus-plugin-copy-markdown-v0.4.0) (2026-06-12)


### Features

* ✨ integrate oh-my-agent with multi-vendor skills and workflows ([e75d1ce](https://github.com/gracefullight/docusaurus-plugins/commit/e75d1cee02577e6e2961f9b3771028ab015b89d5))


### Code Refactoring

* **test:** ♻️ 🚨 make client module path assertion robust to cjs/esm output ([ced9d31](https://github.com/gracefullight/docusaurus-plugins/commit/ced9d31f299fcc627a96df62f60addadd3ef716c))

## [0.3.0](https://github.com/gracefullight/docusaurus-plugins/compare/docusaurus-plugin-copy-markdown-v0.2.1...docusaurus-plugin-copy-markdown-v0.3.0) (2026-06-01)


### Features

* **copy-markdown:** ✨ use content-secondary for icon and label color ([653417f](https://github.com/gracefullight/docusaurus-plugins/commit/653417fc5fed93952bd9b0f1bf59db5710659c53))

## [0.2.1](https://github.com/gracefullight/docusaurus-plugins/compare/docusaurus-plugin-copy-markdown-v0.2.0...docusaurus-plugin-copy-markdown-v0.2.1) (2026-05-31)


### Bug Fixes

* **copy-markdown:** 🐛 fix border color serialization bug on copy button ([acbdb57](https://github.com/gracefullight/docusaurus-plugins/commit/acbdb57a2eb7e04565243976be823a31abfac6c5))

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
