import matter from "gray-matter";

export type ProcessMarkdownOptions = {
  stripFrontmatter: boolean;
  injectTitleFromFrontmatter: boolean;
};

function hasLeadingHeading(body: string): boolean {
  return /^\s*#\s+\S/.test(body);
}

function cleanupMdxSource(body: string): string {
  return body
    .replace(/^import\s+.+;\s*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<!--\s*truncate\s*-->\s*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function processMarkdownSource(
  raw: string,
  options: ProcessMarkdownOptions,
): { body: string; title?: string } {
  const parsed = matter(raw);
  const title =
    typeof parsed.data.title === "string" ? parsed.data.title : undefined;
  let body = options.stripFrontmatter ? parsed.content : raw;

  body = cleanupMdxSource(body);

  if (options.injectTitleFromFrontmatter && title && !hasLeadingHeading(body)) {
    body = `# ${title}\n\n${body}`.trim();
  }

  return { body, title };
}
