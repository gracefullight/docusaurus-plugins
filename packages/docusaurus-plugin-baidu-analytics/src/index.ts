import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  siteId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  siteId: Joi.string().required(),
});

export default async function baiduAnalytics(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://hm.baidu.com",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            attributes: {
              async: true,
              src: `https://hm.baidu.com/hm.js?${options.siteId}`,
            },
            tagName: "script",
          },
          {
            innerHTML: "if (!window._hmt) window._hmt = [];",
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-baidu-analytics",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
