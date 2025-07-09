import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  chatraId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  chatraId: Joi.string().required(),
});

export default async function chatra(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://call.chatra.io",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
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
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-chatra",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
