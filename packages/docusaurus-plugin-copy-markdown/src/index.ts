import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

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
  includeDocs?: boolean;
  includeBlog?: boolean;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  buttonClassName: Joi.string().default(DEFAULT_BUTTON_CLASS_NAME),
  buttonLabel: Joi.string(),
  copiedLabel: Joi.string(),
  includeBlog: Joi.bool().default(true),
  includeDocs: Joi.bool().default(true),
  injectTitleFromFrontmatter: Joi.bool().default(true),
  stripFrontmatter: Joi.bool().default(true),
});

export default async function copyMarkdownPlugin(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  const resolvedOptions = {
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
        buttonClassName: resolvedOptions.buttonClassName,
        customButtonLabel: options.buttonLabel,
        customCopiedLabel: options.copiedLabel,
        routes,
      });
    },

    getClientModules() {
      return [path.resolve(__dirname, "../src/client/copy-markdown-button.ts")];
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
