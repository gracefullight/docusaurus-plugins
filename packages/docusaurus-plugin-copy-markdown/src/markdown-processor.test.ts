import { describe, expect, it } from "vitest";
import { processMarkdownSource } from "./markdown-processor";

const defaultOptions = {
  injectTitleFromFrontmatter: true,
  stripFrontmatter: true,
};

describe("processMarkdownSource", () => {
  it("strips frontmatter and returns title from YAML", () => {
    const raw = `---
title: Welcome
slug: welcome
---

Hello world`;

    const result = processMarkdownSource(raw, defaultOptions);

    expect(result.title).toBe("Welcome");
    expect(result.body).toBe("# Welcome\n\nHello world");
    expect(result.body).not.toContain("slug:");
  });

  it("keeps raw content when stripFrontmatter is false", () => {
    const raw = `---
title: Welcome
---

Body`;

    const result = processMarkdownSource(raw, {
      ...defaultOptions,
      stripFrontmatter: false,
    });

    expect(result.body).toContain("---");
    expect(result.body).toContain("title: Welcome");
  });

  it("does not inject title when body already has a leading heading", () => {
    const raw = `---
title: Ignored
---

# Existing title

Body`;

    const result = processMarkdownSource(raw, defaultOptions);

    expect(result.body).toBe("# Existing title\n\nBody");
  });

  it("does not treat # inside code blocks as a leading heading", () => {
    const raw = `---
title: Welcome
---

\`\`\`js
# not a heading
\`\`\`

Body`;

    const result = processMarkdownSource(raw, defaultOptions);

    expect(result.body).toBe(
      "# Welcome\n\n```js\n# not a heading\n```\n\nBody",
    );
  });

  it("removes MDX imports, JSX comments, and truncate markers", () => {
    const raw = `---
title: Post
---

import Component from "@site/src/components/Component";

{/* layout wrapper */}
Intro paragraph.

<!-- truncate -->

More content.`;

    const result = processMarkdownSource(raw, defaultOptions);

    expect(result.body).toBe("# Post\n\nIntro paragraph.\n\nMore content.");
    expect(result.body).not.toContain("import Component");
    expect(result.body).not.toContain("{/*");
    expect(result.body).not.toContain("truncate");
  });

  it("skips title injection when injectTitleFromFrontmatter is false", () => {
    const raw = `---
title: Welcome
---

Body only`;

    const result = processMarkdownSource(raw, {
      ...defaultOptions,
      injectTitleFromFrontmatter: false,
    });

    expect(result.body).toBe("Body only");
  });
});
