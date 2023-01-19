import type {
  LoadContext,
  Plugin,
  OptionValidationContext,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  chatraId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  chatraId: Joi.string().required(),
});

export default async function naverAnalytics(
  _: LoadContext,
  options: PluginOptions
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
              href: "https://call.chatra.io",
            },
          },
          {
            tagName: "script",
            innerHTML: `(function(d, w, c) {
              w.ChatraID = '${options.chatraId}';
              var s = d.createElement('script');
              w[c] = w[c] || function() {
                (w[c].q = w[c].q || []).push(arguments);
              };
              s.async = true;
              s.src = 'https://call.chatra.io/chatra.js';
              if (d.head) d.head.appendChild(s);
          })(document, window, 'Chatra');`,
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
