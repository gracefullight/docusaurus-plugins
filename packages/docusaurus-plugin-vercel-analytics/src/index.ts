import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  mode: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  mode: Joi.string(),
});

export default async function vercelAnalytics(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-vercel-analytics",
    injectHtmlTags() {
      // ? https://github.com/vercel/analytics/blob/main/packages/web/src/generic.ts
      const isDevelopment =
        options.mode && ["development", "test"].includes(options.mode);
      const scriptDomain = "https://va.vercel-scripts.com";
      const scriptPath = `/v1/script${isDevelopment ? ".debug" : ""}.js`;

      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: scriptDomain,
            },
          },
          {
            tagName: "script",
            attributes: {
              src: `${scriptDomain}${scriptPath}`,
              defer: true,
              "data-sdkn": "@vercel/analytics",
              "data-sdkv": "1.0.1",
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
