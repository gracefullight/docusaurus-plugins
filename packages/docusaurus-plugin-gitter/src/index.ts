import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  room: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  room: Joi.string().required(),
});

export default async function gitter(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-gitter",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://sidecar.gitter.im",
            },
          },
          {
            tagName: "script",
            innerHTML: `((window.gitter = {}).chat = {}).options = {
              room: '${options.room}'
            };`,
          },
          {
            tagName: "script",
            attributes: {
              src: "https://sidecar.gitter.im/dist/sidecar.v1.js",
              async: true,
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
