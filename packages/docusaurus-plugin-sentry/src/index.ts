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
  publicKey: Joi.string().required(),
  lazy: Joi.bool(),
  tracesSampleRate: Joi.number().min(0).max(1),
});

export default async function sentry(
  _: LoadContext,
  options: PluginOptions
): Promise<Plugin> {
  const lazy = options.lazy === false ? "no" : "yes";

  return {
    name: "@gracefullight/docusaurus-plugin-sentry",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://js.sentry-cdn.com",
            },
          },
          {
            tagName: "script",
            attributes: {
              src: `https://js.sentry-cdn.com/${options.publicKey}.min.js`,
              crossOrigin: "anonymous",
              "data-lazy": lazy,
            },
          },
          {
            tagName: "script",
            innerHTML: `Sentry.onLoad(function() {
              Sentry.init({
                tracesSampleRate: ${options.tracesSampleRate ?? 1}
              });
            });`,
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
