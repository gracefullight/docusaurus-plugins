import type { LoadContext } from "@docusaurus/types";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { collectRouteMarkdown } from "./route-collector";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { force: true, recursive: true })),
  );
});

async function createSiteDir(structure: Record<string, string>) {
  const siteDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "copy-markdown-test-"),
  );
  tempDirs.push(siteDir);

  for (const [relativePath, content] of Object.entries(structure)) {
    const filePath = path.join(siteDir, relativePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
  }

  return siteDir;
}

function createContext(siteDir: string, baseUrl = "/"): LoadContext {
  return {
    siteConfig: {
      baseUrl,
    },
    siteDir,
  } as LoadContext;
}

describe("collectRouteMarkdown", () => {
  it("collects processed docs and blog markdown keyed by permalink", async () => {
    const siteDir = await createSiteDir({
      "blog/welcome.md": `---
title: Welcome
---

Blog body without heading`,
      "docs/intro.md": `---
title: Intro
---

# Intro

Docs body`,
    });

    const routes = await collectRouteMarkdown(
      createContext(siteDir),
      {
        "docusaurus-plugin-content-blog": {
          default: {
            blogPosts: [
              {
                metadata: {
                  permalink: "/blog/welcome",
                  source: "@site/blog/welcome.md",
                },
              },
            ],
          },
        },
        "docusaurus-plugin-content-docs": {
          default: {
            loadedVersions: [
              {
                docs: [
                  {
                    permalink: "/docs/intro",
                    source: "@site/docs/intro.md",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        includeBlog: true,
        includeDocs: true,
        injectTitleFromFrontmatter: true,
        stripFrontmatter: true,
      },
    );

    expect(routes["/docs/intro"]?.contentType).toBe("docs");
    expect(routes["/docs/intro"]?.markdown).toBe("# Intro\n\nDocs body");
    expect(routes["/blog/welcome/"]?.contentType).toBe("blog");
    expect(routes["/blog/welcome/"]?.markdown).toBe(
      "# Welcome\n\nBlog body without heading",
    );
  });

  it("skips excluded routes and respects include flags", async () => {
    const siteDir = await createSiteDir({
      "blog/tags.md": `---
title: Tags
---

Tags page`,
      "docs/intro.md": `---
title: Intro
---

Intro`,
    });

    const routes = await collectRouteMarkdown(
      createContext(siteDir, "/base/"),
      {
        "docusaurus-plugin-content-blog": {
          default: {
            blogPosts: [
              {
                metadata: {
                  permalink: "/base/blog/tags",
                  source: "@site/blog/tags.md",
                },
              },
            ],
          },
        },
        "docusaurus-plugin-content-docs": {
          default: {
            loadedVersions: [
              {
                docs: [
                  {
                    permalink: "/base/docs/intro",
                    source: "@site/docs/intro.md",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        includeBlog: true,
        includeDocs: false,
        injectTitleFromFrontmatter: true,
        stripFrontmatter: true,
      },
    );

    expect(routes["/base/docs/intro"]).toBeUndefined();
    expect(routes["/base/blog/tags"]).toBeUndefined();
  });
});
