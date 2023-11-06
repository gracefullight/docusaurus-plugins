import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

// ? https://analytics.naver.com/management/mysites.html
export interface PluginOptions {
  siteId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  siteId: Joi.string().required(),
});

export default async function naverAnalytics(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-naver-analytics",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://wcs.naver.net",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: "https://wcs.naver.net/wcslog.js",
              async: true,
            },
          },
          {
            tagName: "script",
            innerHTML: `if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "${options.siteId}";
            if(window.wcs) {
              wcs_do();
            }`,
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
