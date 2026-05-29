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
.copy-markdown-button {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}
.copy-markdown-button:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.copy-markdown-button:active {
  opacity: 0.85;
}
@media (prefers-color-scheme: dark) {
  .copy-markdown-button:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }
}
`;
  document.head.appendChild(style);
}

function createCopyButton(
  pluginData: PluginGlobalData,
  buttonLabel: string,
): { button: HTMLButtonElement; label: HTMLSpanElement } {
  ensureBaseStylesInjected();

  const button = document.createElement("button");
  button.type = "button";

  // Base class + optional user-provided class for further customization
  const userClass = pluginData.buttonClassName?.trim();
  button.className = userClass
    ? `copy-markdown-button ${userClass}`
    : "copy-markdown-button";

  button.setAttribute("aria-label", buttonLabel);

  // Strong inline styles as a resilient fallback layer.
  // These win over most host CSS resets for the core "outlined button" look.
  Object.assign(button.style, {
    alignItems: "center",
    background: "transparent",
    border: "1px solid currentColor",
    borderRadius: "6px",
    color: "inherit",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.875rem",
    gap: "0.375rem",
    lineHeight: "1.25",
    padding: "0.375rem 0.75rem",
    transition: "opacity 0.15s ease, background-color 0.15s ease",
    whiteSpace: "nowrap",
  } as Partial<CSSStyleDeclaration>);

  const icon = document.createElement("span");
  icon.className = "copy-markdown-button__icon";
  icon.innerHTML = COPY_ICON_SVG;
  icon.style.display = "inline-flex";
  icon.style.flexShrink = "0";

  const label = document.createElement("span");
  label.className = "copy-markdown-button__label";
  label.textContent = buttonLabel;

  button.append(icon, label);

  return { button, label };
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

  const { button, label } = createCopyButton(pluginData, buttonLabel);

  const liveRegion = document.createElement("span");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.className = "copy-markdown-button__status";
  liveRegion.style.position = "absolute";
  liveRegion.style.width = "1px";
  liveRegion.style.height = "1px";
  liveRegion.style.overflow = "hidden";
  liveRegion.style.clip = "rect(0, 0, 0, 0)";

  button.addEventListener("click", async () => {
    const copied = await copyText(route.markdown);
    if (!copied) {
      return;
    }

    label.textContent = copiedLabel;
    liveRegion.textContent = copiedLabel;

    window.setTimeout(() => {
      label.textContent = buttonLabel;
      liveRegion.textContent = "";
    }, COPIED_RESET_MS);
  });

  container.append(button, liveRegion);
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
