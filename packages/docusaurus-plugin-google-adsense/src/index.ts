import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  adClient: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  adClient: Joi.string().required(),
});

export default async function googleAdSense(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://pagead2.googlesyndication.com",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            attributes: {
              async: true,
              crossOrigin: "anonymous",
              src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${options.adClient}`,
            },
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-google-adsense",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
