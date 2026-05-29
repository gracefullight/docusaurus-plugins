// @vitest-environment happy-dom

import { beforeEach, describe, expect, it } from "vitest";
import {
  findTitleElement,
  insertButtonContainer,
  resolveInsertionAnchor,
} from "./dom";

const CONTAINER_ATTR = "data-copy-markdown-button";

function makeContainer(): HTMLElement {
  const container = document.createElement("div");
  container.setAttribute(CONTAINER_ATTR, "true");
  return container;
}

/** Mirrors a Docusaurus blog post page: <h1> lives inside a <header>
 * that also holds the date and author (profile) metadata. */
function renderBlogPostPage(): void {
  document.body.innerHTML = `
    <article>
      <header>
        <h1>Logistic regression</h1>
        <div class="blog-date"><time datetime="2025-08-28">2025년 8월 28일</time> · 약 3분</div>
        <div class="blog-authors"><div class="author-name">Eunkwang Shin</div></div>
      </header>
      <div class="markdown"><h2>단변량 선형 회귀</h2><p>body</p></div>
    </article>
  `;
}

/** Mirrors a Docusaurus docs page: <h1> sits inside .theme-doc-markdown,
 * with no surrounding <header>. */
function renderDocsPage(): void {
  document.body.innerHTML = `
    <article>
      <div class="theme-doc-markdown markdown">
        <h1>Logistic regression</h1>
        <p>body</p>
      </div>
    </article>
  `;
}

/** Mirrors a Docusaurus blog list page: post previews use <h2> links
 * (not <h1>), plus a "recent posts" sidebar of <h2> links. */
function renderBlogListPage(): void {
  document.body.innerHTML = `
    <aside><nav><h2>최근 포스트</h2><ul><li><a href="/blog/a">A</a></li></ul></nav></aside>
    <main>
      <article><h2><a href="/blog/a">Post A</a></h2><p>excerpt</p></article>
      <article><h2><a href="/blog/b">Post B</a></h2><p>excerpt</p></article>
    </main>
  `;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("findTitleElement", () => {
  it("finds the main <h1> on a blog post page", () => {
    renderBlogPostPage();
    expect(findTitleElement()?.textContent).toBe("Logistic regression");
  });

  it("finds the main <h1> on a docs page", () => {
    renderDocsPage();
    expect(findTitleElement()?.textContent).toBe("Logistic regression");
  });

  it("returns null on a blog list page (previews are <h2>, not <h1>)", () => {
    renderBlogListPage();
    expect(findTitleElement()).toBeNull();
  });
});

describe("resolveInsertionAnchor", () => {
  it("returns the enclosing <header> for blog posts", () => {
    renderBlogPostPage();
    const titleEl = findTitleElement();
    if (!titleEl) throw new Error("expected a title element");

    const anchor = resolveInsertionAnchor(titleEl, "blog");
    expect(anchor.tagName).toBe("HEADER");
  });

  it("returns the <h1> itself for docs", () => {
    renderDocsPage();
    const titleEl = findTitleElement();
    if (!titleEl) throw new Error("expected a title element");

    const anchor = resolveInsertionAnchor(titleEl, "docs");
    expect(anchor).toBe(titleEl);
  });

  it("falls back to the <h1> for blog posts without a <header>", () => {
    document.body.innerHTML = "<article><h1>No header here</h1></article>";
    const titleEl = findTitleElement();
    if (!titleEl) throw new Error("expected a title element");

    const anchor = resolveInsertionAnchor(titleEl, "blog");
    expect(anchor).toBe(titleEl);
  });
});

describe("insertButtonContainer — blog post (포스트 내부)", () => {
  it("inserts the button after the header, below the profile metadata", () => {
    renderBlogPostPage();
    const titleEl = findTitleElement();
    if (!titleEl) throw new Error("expected a title element");

    const container = makeContainer();
    insertButtonContainer(titleEl, "blog", container);

    const header = document.querySelector("header");
    const date = document.querySelector(".blog-date");
    const author = document.querySelector(".author-name");
    if (!(header && date && author)) throw new Error("fixture mismatch");

    // The button container is a sibling placed right after the whole header.
    expect(header.nextElementSibling).toBe(container);

    // It is NOT wedged between the title and the date/author profile block.
    expect(titleEl.nextElementSibling).not.toBe(container);

    // Document order: title -> date -> author -> button.
    const following = Node.DOCUMENT_POSITION_FOLLOWING;
    expect(titleEl.compareDocumentPosition(container) & following).toBeTruthy();
    expect(date.compareDocumentPosition(container) & following).toBeTruthy();
    expect(author.compareDocumentPosition(container) & following).toBeTruthy();
  });
});

describe("insertButtonContainer — docs page", () => {
  it("inserts the button immediately after the <h1>", () => {
    renderDocsPage();
    const titleEl = findTitleElement();
    if (!titleEl) throw new Error("expected a title element");

    const container = makeContainer();
    insertButtonContainer(titleEl, "docs", container);

    expect(titleEl.nextElementSibling).toBe(container);
  });
});
