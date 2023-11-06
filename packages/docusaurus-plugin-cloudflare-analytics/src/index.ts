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
    name: "@gracefullight/docusaurus-plugin-cloudflare-analytics",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://static.cloudflareinsights.com",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: "https://static.cloudflareinsights.com/beacon.min.js",
              defer: true,
              "data-cf-beacon": JSON.stringify({ token: options.token }),
            },
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
