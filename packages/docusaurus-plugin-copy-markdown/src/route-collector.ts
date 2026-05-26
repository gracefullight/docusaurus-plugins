import type { LoadContext } from "@docusaurus/types";
import type { ContentType, RouteMarkdownEntry } from "./constants";

import fs from "node:fs/promises";
import path from "node:path";
import { aliasedSitePathToRelativePath } from "@docusaurus/utils";
import { processMarkdownSource } from "./markdown-processor";
import { addPathnameKeys, createRouteExclusionMatcher } from "./route-utils";

type ProcessMarkdownOptions = {
  stripFrontmatter: boolean;
  injectTitleFromFrontmatter: boolean;
};

type CollectRoutesOptions = ProcessMarkdownOptions & {
  includeDocs: boolean;
  includeBlog: boolean;
};

type DocLike = {
  source: string;
  permalink: string;
};

type DocsLoadedContent = {
  loadedVersions: Array<{
    docs: DocLike[];
  }>;
};

type BlogPostLike = {
  metadata: DocLike;
};

type BlogLoadedContent = {
  blogPosts: BlogPostLike[];
};

async function readProcessedMarkdown(
  siteDir: string,
  source: string,
  processOptions: ProcessMarkdownOptions,
): Promise<string> {
  const relativePath = source.startsWith("@site/")
    ? aliasedSitePathToRelativePath(source)
    : source;
  const filePath = path.join(siteDir, relativePath);
  const raw = await fs.readFile(filePath, "utf8");
  const { body } = processMarkdownSource(raw, processOptions);
  return body;
}

function addRouteEntry(
  routes: Record<string, RouteMarkdownEntry>,
  permalink: string,
  markdown: string,
  contentType: ContentType,
): void {
  addPathnameKeys(routes, permalink, {
    contentType,
    markdown,
    permalink,
  });
}

function shouldSkipRoute(
  baseUrl: string,
  permalink: string,
  isExcluded: (pathname: string) => boolean,
): boolean {
  const routePath = permalink.startsWith(baseUrl)
    ? permalink.slice(baseUrl.length) || "/"
    : permalink;
  return isExcluded(routePath.startsWith("/") ? routePath : `/${routePath}`);
}

async function collectDocsRoutes(
  context: LoadContext,
  allContent: Record<string, Record<string, unknown>>,
  routes: Record<string, RouteMarkdownEntry>,
  options: CollectRoutesOptions,
  isExcluded: (pathname: string) => boolean,
): Promise<void> {
  const { baseUrl } = context.siteConfig;
  const docsInstances = allContent["docusaurus-plugin-content-docs"] ?? {};
  const processOptions = {
    injectTitleFromFrontmatter: options.injectTitleFromFrontmatter,
    stripFrontmatter: options.stripFrontmatter,
  };

  for (const docsContent of Object.values(docsInstances)) {
    const loaded = docsContent as DocsLoadedContent;

    for (const version of loaded.loadedVersions ?? []) {
      for (const doc of version.docs ?? []) {
        if (
          !doc.source ||
          shouldSkipRoute(baseUrl, doc.permalink, isExcluded)
        ) {
          continue;
        }

        const markdown = await readProcessedMarkdown(
          context.siteDir,
          doc.source,
          processOptions,
        );
        addRouteEntry(routes, doc.permalink, markdown, "docs");
      }
    }
  }
}

async function collectBlogRoutes(
  context: LoadContext,
  allContent: Record<string, Record<string, unknown>>,
  routes: Record<string, RouteMarkdownEntry>,
  options: CollectRoutesOptions,
  isExcluded: (pathname: string) => boolean,
): Promise<void> {
  const { baseUrl } = context.siteConfig;
  const blogInstances = allContent["docusaurus-plugin-content-blog"] ?? {};
  const processOptions = {
    injectTitleFromFrontmatter: options.injectTitleFromFrontmatter,
    stripFrontmatter: options.stripFrontmatter,
  };

  for (const blogContent of Object.values(blogInstances)) {
    const loaded = blogContent as BlogLoadedContent;

    for (const post of loaded.blogPosts ?? []) {
      const { metadata } = post;
      if (
        !metadata?.source ||
        shouldSkipRoute(baseUrl, metadata.permalink, isExcluded)
      ) {
        continue;
      }

      const markdown = await readProcessedMarkdown(
        context.siteDir,
        metadata.source,
        processOptions,
      );
      addRouteEntry(routes, metadata.permalink, markdown, "blog");
    }
  }
}

export async function collectRouteMarkdown(
  context: LoadContext,
  allContent: Record<string, Record<string, unknown>>,
  options: CollectRoutesOptions,
): Promise<Record<string, RouteMarkdownEntry>> {
  const routes: Record<string, RouteMarkdownEntry> = {};
  const isExcluded = createRouteExclusionMatcher();

  if (options.includeDocs) {
    await collectDocsRoutes(context, allContent, routes, options, isExcluded);
  }

  if (options.includeBlog) {
    await collectBlogRoutes(context, allContent, routes, options, isExcluded);
  }

  return routes;
}
