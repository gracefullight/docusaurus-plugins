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
  options: PluginOptions
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-google-adsense",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://pagead2.googlesyndication.com",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${options.adClient}`,
              async: true,
              crossOrigin: "anonymous",
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
