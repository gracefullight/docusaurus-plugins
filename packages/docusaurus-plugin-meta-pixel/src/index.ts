import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

// ? https://channel.io/user-chat
export interface PluginOptions {
  pixelId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  pixelId: Joi.string().required(),
});

export default async function metaPixel(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-meta-pixel",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://connect.facebook.net",
            },
          },
          {
            tagName: "script",
            innerHTML: `!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${options.pixelId}');
            fbq('track', 'PageView');`,
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
