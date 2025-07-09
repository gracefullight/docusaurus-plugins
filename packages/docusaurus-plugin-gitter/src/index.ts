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
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://sidecar.gitter.im",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            innerHTML: `((window.gitter = {}).chat = {}).options = {
              room: '${options.room}'
            };`,
            tagName: "script",
          },
          {
            attributes: {
              async: true,
              src: "https://sidecar.gitter.im/dist/sidecar.v1.js",
            },
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-gitter",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
