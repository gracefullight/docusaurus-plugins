import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  token: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  token: Joi.string().required(),
});

export default async function cloudflareAnalytics(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://static.cloudflareinsights.com",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            attributes: {
              "data-cf-beacon": JSON.stringify({ token: options.token }),
              defer: true,
              src: "https://static.cloudflareinsights.com/beacon.min.js",
            },
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-cloudflare-analytics",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
