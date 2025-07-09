import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";

import { Joi } from "@docusaurus/utils-validation";

// ? https://channel.io/user-chat
export interface PluginOptions {
  pluginKey: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  pluginKey: Joi.string().required(),
});

export default async function channelIO(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    injectHtmlTags() {
      return {
        headTags: [
          {
            attributes: {
              href: "https://cdn.channel.io",
              rel: "preconnect",
            },
            tagName: "link",
          },
          {
            innerHTML: `(function() {
              var w = window;
              if (w.ChannelIO) {
                return (window.console.error || window.console.log || function(){})('ChannelIO script included twice.');
              }
              var ch = function() {
                ch.c(arguments);
              };
              ch.q = [];
              ch.c = function(args) {
                ch.q.push(args);
              };
              w.ChannelIO = ch;
              function l() {
                if (w.ChannelIOInitialized) {
                  return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                s.charset = 'UTF-8';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
              }
              if (document.readyState === 'complete') {
                l();
              } else if (window.attachEvent) {
                window.attachEvent('onload', l);
              } else {
                window.addEventListener('DOMContentLoaded', l, false);
                window.addEventListener('load', l, false);
              }
            })();
            ChannelIO('boot', {
              "pluginKey": "${options.pluginKey}"
            });`,
            tagName: "script",
          },
        ],
      };
    },
    name: "@gracefullight/docusaurus-plugin-channelio",
  };
}

export function validateOptions({
  options,
  validate,
}: OptionValidationContext<Options, PluginOptions>) {
  const validatedOptions = validate(pluginOptionsSchema, options);
  return validatedOptions;
}
