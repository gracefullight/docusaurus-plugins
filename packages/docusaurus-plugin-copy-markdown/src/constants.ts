export const PLUGIN_NAME = "@gracefullight/docusaurus-plugin-copy-markdown";

export const DEFAULT_BUTTON_LABEL = "Copy page as Markdown";

export const DEFAULT_COPIED_LABEL = "Copied!";

export const COPY_MARKDOWN_BUTTON_LABEL_ID = "copyMarkdown.buttonLabel";

export const COPY_MARKDOWN_COPIED_LABEL_ID = "copyMarkdown.copiedLabel";

export const DEFAULT_BUTTON_CLASS_NAME = ""; // Styling is now primarily driven by inline styles + this optional class for further customization.

export const DEFAULT_EXCLUDED_ROUTES = [
  "/search",
  "/404.html",
  "/404",
  "/tags",
  "/blog/tags",
  "/blog/archive",
  "/blog/authors",
];

export type ContentType = "docs" | "blog";

export type RouteMarkdownEntry = {
  markdown: string;
  permalink: string;
  contentType: ContentType;
};

export type ButtonAlignment = "left" | "center" | "right";

export type CopyMarkdownGlobalData = {
  routes: Record<string, RouteMarkdownEntry>;
  buttonClassName: string;
  buttonAlignment: ButtonAlignment;
  /** Overrides i18n when set in plugin options */
  customButtonLabel?: string;
  /** Overrides i18n when set in plugin options */
  customCopiedLabel?: string;
};
