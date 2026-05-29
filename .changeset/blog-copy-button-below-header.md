---
"@gracefullight/docusaurus-plugin-copy-markdown": patch
---

Place the blog copy button below the post header (after the author/date metadata) instead of wedging it between the title and the profile. Docs pages keep the button directly under the title. The insertion logic is now split into a dependency-free `dom` module with DOM regression tests covering blog post, blog list, and docs pages.
