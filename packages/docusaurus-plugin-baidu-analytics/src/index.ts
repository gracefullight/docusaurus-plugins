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
    name: "@gracefullight/docusaurus-plugin-baidu-analytics",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://hm.baidu.com",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: `https://hm.baidu.com/hm.js?${options.siteId}`,
              async: true,
            },
          },
          {
            tagName: "script",
            innerHTML: `if (!window._hmt) window._hmt = [];`,
          },
        ],
      };
    },
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
