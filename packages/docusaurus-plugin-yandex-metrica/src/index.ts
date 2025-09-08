import type { LoadContext, OptionValidationContext } from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  counterId: number;
  webvisor?: boolean;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  counterId: Joi.number().required(),
  webvisor: Joi.bool(),
});

export default async function yandexMetrica(
  _: LoadContext,
  options: PluginOptions,
) {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://mc.yandex.ru",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${options.counterId}", "ym");
            
              ym(${options.counterId}, "init", {
                ssr: true,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: ${options.webvisor ? "true" : "false"}
              });`,
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-yandex-metrica",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
