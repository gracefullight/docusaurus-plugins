import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  publicKey: string;
  lazy?: boolean;
  tracesSampleRate?: number;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  lazy: Joi.bool(),
  publicKey: Joi.string().required(),
  tracesSampleRate: Joi.number().min(0).max(1),
});

export default async function sentry(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  const lazy = options.lazy === false ? "no" : "yes";

  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://js.sentry-cdn.com",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            attributes: {
              crossOrigin: "anonymous",
              "data-lazy": lazy,
              src: `https://js.sentry-cdn.com/${options.publicKey}.min.js`,
            },
            tagName: "script",
          },
          {
            innerHTML: `Sentry.onLoad(function() {
              Sentry.init({
                tracesSampleRate: ${options.tracesSampleRate ?? 1}
              });
            });`,
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-sentry",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
