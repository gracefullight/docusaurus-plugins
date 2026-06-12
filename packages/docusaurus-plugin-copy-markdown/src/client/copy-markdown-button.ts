import type { ClientModule } from "@docusaurus/types";
import type { ButtonAlignment, CopyMarkdownGlobalData } from "../constants";

import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import codeTranslations from "@generated/codeTranslations";
import globalData from "@generated/globalData";
import {
  COPY_MARKDOWN_BUTTON_LABEL_ID,
  COPY_MARKDOWN_COPIED_LABEL_ID,
  DEFAULT_BUTTON_LABEL,
  DEFAULT_COPIED_LABEL,
  PLUGIN_NAME,
} from "../constants";
import { findTitleElement, insertButtonContainer } from "./dom";

const COPIED_RESET_MS = 2000;
const CONTAINER_ATTR = "data-copy-markdown-button";

const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHEVRON_DOWN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

// Outline (border) color. Uses Infima's emphasis-300 in a Docusaurus context
// and falls back to its light-mode value when the variable is absent.
const OUTLINE_COLOR = "var(--ifm-color-emphasis-300, #dadde1)";

// Icon + label text color. Uses Infima's secondary content color, with a
// fallback to its light-mode value for non-Docusaurus contexts.
const CONTENT_COLOR = "var(--ifm-color-content-secondary, #525860)";

type PluginGlobalData = CopyMarkdownGlobalData;

function getPluginData(): PluginGlobalData | undefined {
  return globalData[PLUGIN_NAME]?.default as PluginGlobalData | undefined;
}

function resolveButtonLabel(pluginData: PluginGlobalData): string {
  return (
    pluginData.customButtonLabel ??
    codeTranslations[COPY_MARKDOWN_BUTTON_LABEL_ID] ??
    DEFAULT_BUTTON_LABEL
  );
}

function resolveCopiedLabel(pluginData: PluginGlobalData): string {
  return (
    pluginData.customCopiedLabel ??
    codeTranslations[COPY_MARKDOWN_COPIED_LABEL_ID] ??
    DEFAULT_COPIED_LABEL
  );
}

function normalizePathname(pathname: string): string[] {
  if (pathname.endsWith("/") && pathname.length > 1) {
    return [pathname, pathname.slice(0, -1)];
  }

  if (!pathname.endsWith("/")) {
    return [pathname, `${pathname}/`];
  }

  return [pathname];
}

function lookupRoute(
  routes: PluginGlobalData["routes"],
  pathname: string,
): PluginGlobalData["routes"][string] | undefined {
  for (const key of normalizePathname(pathname)) {
    const route = routes[key];
    if (route) {
      return route;
    }
  }

  return;
}

function removeExistingButton(): void {
  for (const element of document.querySelectorAll(`[${CONTAINER_ATTR}]`)) {
    element.remove();
  }
}

/**
 * Injects a one-time base stylesheet for the copy button.
 * These styles are intentionally self-contained so the button looks decent
 * even when the host site heavily customizes or resets button styles.
 */
function ensureBaseStylesInjected(): void {
  const styleId = "copy-markdown-base-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
.copy-markdown-group {
  display: inline-flex;
  position: relative;
  align-items: stretch;
}
.copy-markdown-button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25;
  border: 1px solid ${OUTLINE_COLOR};
  border-radius: 6px;
  background: transparent;
  color: ${CONTENT_COLOR};
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
  box-sizing: border-box;
}
.copy-markdown-button--split-left {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none !important;
}
.copy-markdown-button--split-right {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 1px solid var(--ifm-color-emphasis-200, #e3e6e9) !important;
  padding: 0.375rem 0.5rem;
}
.copy-markdown-button__icon {
  color: ${CONTENT_COLOR};
}
.copy-markdown-button:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.copy-markdown-button:active {
  opacity: 0.85;
}
.copy-markdown-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: var(--ifm-background-surface-color, #fff);
  border: 1px solid ${OUTLINE_COLOR};
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: none;
  flex-direction: column;
  min-width: 150px;
  z-index: 100;
  padding: 0.25rem;
}
.copy-markdown-dropdown.show {
  display: flex;
}
.copy-markdown-dropdown-item {
  background: transparent;
  border: none;
  color: ${CONTENT_COLOR};
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  border-radius: 4px;
  text-decoration: none;
  display: block;
}
.copy-markdown-dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: ${CONTENT_COLOR};
}
@media (prefers-color-scheme: dark) {
  .copy-markdown-button:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }
  .copy-markdown-dropdown {
    background: var(--ifm-background-surface-color, #242526);
  }
  .copy-markdown-dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }
}
`;
  document.head.appendChild(style);
}

function createCopyButtonGroup(
  pluginData: PluginGlobalData,
  buttonLabel: string,
  markdown: string,
  copiedLabel: string,
): { group: HTMLDivElement } {
  ensureBaseStylesInjected();

  const group = document.createElement("div");
  group.className = "copy-markdown-group";

  const button = document.createElement("button");
  button.type = "button";

  const userClass = pluginData.buttonClassName?.trim();
  button.className = userClass
    ? `copy-markdown-button copy-markdown-button--split-left ${userClass}`
    : "copy-markdown-button copy-markdown-button--split-left";

  button.setAttribute("aria-label", buttonLabel);

  const icon = document.createElement("span");
  icon.className = "copy-markdown-button__icon";
  icon.innerHTML = COPY_ICON_SVG;
  icon.style.color = CONTENT_COLOR;
  icon.style.display = "inline-flex";
  icon.style.flexShrink = "0";

  const label = document.createElement("span");
  label.className = "copy-markdown-button__label";
  label.textContent = buttonLabel;

  button.append(icon, label);

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className =
    "copy-markdown-button copy-markdown-button--split-right";
  toggleButton.setAttribute("aria-label", "Toggle Dropdown");

  const chevron = document.createElement("span");
  chevron.innerHTML = CHEVRON_DOWN_SVG;
  chevron.style.display = "inline-flex";
  toggleButton.append(chevron);

  const dropdown = document.createElement("div");
  dropdown.className = "copy-markdown-dropdown";

  const copyPageItem = document.createElement("button");
  copyPageItem.type = "button";
  copyPageItem.className = "copy-markdown-dropdown-item";
  copyPageItem.textContent = "Copy Page";

  const chatGptItem = document.createElement("a");
  chatGptItem.className = "copy-markdown-dropdown-item";
  chatGptItem.textContent = "Open in ChatGPT";
  chatGptItem.target = "_blank";
  chatGptItem.rel = "noopener noreferrer";

  const claudeItem = document.createElement("a");
  claudeItem.className = "copy-markdown-dropdown-item";
  claudeItem.textContent = "Open in Claude";
  claudeItem.target = "_blank";
  claudeItem.rel = "noopener noreferrer";

  dropdown.append(copyPageItem, chatGptItem, claudeItem);

  const liveRegion = document.createElement("span");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.className = "copy-markdown-button__status";
  liveRegion.style.position = "absolute";
  liveRegion.style.width = "1px";
  liveRegion.style.height = "1px";
  liveRegion.style.overflow = "hidden";
  liveRegion.style.clip = "rect(0, 0, 0, 0)";

  group.append(button, toggleButton, dropdown, liveRegion);

  toggleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!group.contains(e.target as Node)) {
      dropdown.classList.remove("show");
    }
  });

  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);

  chatGptItem.href = `https://chatgpt.com/?hint=search&q=Read%20${encodedUrl}%20so%20I%20can%20ask%20questions%20about%20it.`;
  claudeItem.href = `https://claude.ai/new?q=Read%20${encodedUrl}%20so%20I%20can%20ask%20questions%20about%20it.`;

  const doCopy = async () => {
    const copied = await copyText(markdown);
    if (!copied) {
      return;
    }

    label.textContent = copiedLabel;
    liveRegion.textContent = copiedLabel;

    window.setTimeout(() => {
      label.textContent = buttonLabel;
      liveRegion.textContent = "";
    }, COPIED_RESET_MS);
  };

  button.addEventListener("click", () => {
    void doCopy();
  });
  copyPageItem.addEventListener("click", () => {
    dropdown.classList.remove("show");
    void doCopy();
  });

  return { group };
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy copy
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function injectButton(pluginData: PluginGlobalData, pathname: string): void {
  removeExistingButton();

  const route = lookupRoute(pluginData.routes, pathname);
  if (!route) {
    return;
  }

  const titleEl = findTitleElement();
  if (!titleEl) {
    return;
  }

  const buttonLabel = resolveButtonLabel(pluginData);
  const copiedLabel = resolveCopiedLabel(pluginData);
  const alignment = pluginData.buttonAlignment ?? "right";

  const container = document.createElement("div");
  container.setAttribute(CONTAINER_ATTR, "true");
  container.className = "copy-markdown-button-container";

  // Docs: right after the title (h1).
  // Blog: after the whole <header> so the button sits below the author/date
  // metadata (title -> profile -> button), not wedged between title and profile.
  insertButtonContainer(titleEl, route.contentType, container);

  // Alignment control
  const justifyMap: Record<ButtonAlignment, string> = {
    center: "center",
    left: "flex-start",
    right: "flex-end",
  };

  Object.assign(container.style, {
    display: "flex",
    justifyContent: justifyMap[alignment],
    marginBottom: "1rem",
    marginTop: "0.5rem",
  } as Partial<CSSStyleDeclaration>);

  const { group } = createCopyButtonGroup(
    pluginData,
    buttonLabel,
    route.markdown,
    copiedLabel,
  );

  container.append(group);
}

function handleRoute(pathname: string): void {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  const pluginData = getPluginData();
  if (!pluginData) {
    return;
  }

  injectButton(pluginData, pathname);
}

const clientModule: ClientModule = {
  onRouteDidUpdate({ location, previousLocation }) {
    if (location.pathname === previousLocation?.pathname) {
      return;
    }

    handleRoute(location.pathname);
  },
};

export default clientModule;
