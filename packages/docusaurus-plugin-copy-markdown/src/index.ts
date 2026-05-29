import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import type { ButtonAlignment } from "./constants";

import path from "node:path";
import { Joi } from "@docusaurus/utils-validation";
import {
  COPY_MARKDOWN_BUTTON_LABEL_ID,
  COPY_MARKDOWN_COPIED_LABEL_ID,
  DEFAULT_BUTTON_CLASS_NAME,
  DEFAULT_BUTTON_LABEL,
  DEFAULT_COPIED_LABEL,
  PLUGIN_NAME,
} from "./constants";
import { collectRouteMarkdown } from "./route-collector";

export interface PluginOptions {
  stripFrontmatter?: boolean;
  injectTitleFromFrontmatter?: boolean;
  /** Overrides locale translations when set */
  buttonLabel?: string;
  /** Overrides locale translations when set */
  copiedLabel?: string;
  buttonClassName?: string;
  /** Horizontal alignment of the button below the title. Default: "left" */
  buttonAlignment?: ButtonAlignment;
  includeDocs?: boolean;
  includeBlog?: boolean;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  buttonAlignment: Joi.string()
    .valid("left", "center", "right")
    .default("right"),
  buttonClassName: Joi.string().default(DEFAULT_BUTTON_CLASS_NAME),
  buttonLabel: Joi.string(),
  copiedLabel: Joi.string(),
  includeBlog: Joi.bool().default(true),
  includeDocs: Joi.bool().default(true),
  injectTitleFromFrontmatter: Joi.bool().default(true),
  stripFrontmatter: Joi.bool().default(true),
});

function resolveClientModulePath(): string {
  const distDir =
    path.basename(__dirname) === "dist"
      ? __dirname
      : path.resolve(__dirname, "../dist");

  return path.resolve(distDir, "client/copy-markdown-button.js");
}

export default async function copyMarkdownPlugin(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  const resolvedOptions = {
    buttonAlignment: (options.buttonAlignment ?? "right") as ButtonAlignment,
    buttonClassName: options.buttonClassName ?? DEFAULT_BUTTON_CLASS_NAME,
    includeBlog: options.includeBlog ?? true,
    includeDocs: options.includeDocs ?? true,
    injectTitleFromFrontmatter: options.injectTitleFromFrontmatter ?? true,
    stripFrontmatter: options.stripFrontmatter ?? true,
  };

  return {
    async allContentLoaded({ actions, allContent }) {
      const routes = await collectRouteMarkdown(
        context,
        allContent,
        resolvedOptions,
      );

      actions.setGlobalData({
        buttonAlignment: resolvedOptions.buttonAlignment,
        buttonClassName: resolvedOptions.buttonClassName,
        customButtonLabel: options.buttonLabel,
        customCopiedLabel: options.copiedLabel,
        routes,
      });
    },

    getClientModules() {
      return [resolveClientModulePath()];
    },

    getDefaultCodeTranslationMessages() {
      return {
        [COPY_MARKDOWN_BUTTON_LABEL_ID]: DEFAULT_BUTTON_LABEL,
        [COPY_MARKDOWN_COPIED_LABEL_ID]: DEFAULT_COPIED_LABEL,
      };
    },
    name: PLUGIN_NAME,
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  return validate(pluginOptionsSchema, options);
}
