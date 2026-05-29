import type { ContentType } from "../constants";

// We primarily target the main <h1> inside the article.
// This gives the most reliable "right below the visible page title" behavior
// across docs and blog pages, even on heavily customized themes.
export const TITLE_SELECTORS = [
  "article h1",
  "article .theme-doc-markdown h1",
  "article .markdown h1",
];

export function findTitleElement(
  root: ParentNode = document,
): HTMLElement | null {
  for (const selector of TITLE_SELECTORS) {
    const element = root.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }
  return null;
}

/**
 * Resolves the element the button container should be inserted *after*.
 *
 * On blog posts the visible `<h1>` lives inside a `<header>` that also holds
 * the author/date metadata. Inserting right after the `<h1>` wedges the button
 * between the title and the profile. For blog posts we therefore insert after
 * the whole `<header>` so the order reads title -> profile -> button.
 *
 * On docs pages the `<h1>` is not wrapped in such a header, so we keep
 * inserting immediately after the title.
 */
export function resolveInsertionAnchor(
  titleEl: HTMLElement,
  contentType: ContentType,
): HTMLElement {
  if (contentType === "blog") {
    const header = titleEl.closest<HTMLElement>("header");
    if (header) {
      return header;
    }
  }

  return titleEl;
}

/**
 * Inserts the button container relative to the page title.
 *
 * - Docs: immediately after the `<h1>`.
 * - Blog: after the whole post `<header>` (below author/date metadata).
 */
export function insertButtonContainer(
  titleEl: HTMLElement,
  contentType: ContentType,
  container: Element,
): void {
  const anchor = resolveInsertionAnchor(titleEl, contentType);
  anchor.insertAdjacentElement("afterend", container);
}
