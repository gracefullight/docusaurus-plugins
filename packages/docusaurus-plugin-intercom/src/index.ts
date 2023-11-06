import type {
  LoadContext,
  OptionValidationContext,
  Plugin,
} from "@docusaurus/types";
import { Joi } from "@docusaurus/utils-validation";

export interface PluginOptions {
  appId: string;
}

export type Options = Partial<PluginOptions>;

const pluginOptionsSchema = Joi.object({
  appId: Joi.string().required(),
});

export default async function intercom(
  _: LoadContext,
  options: PluginOptions,
): Promise<Plugin> {
  return {
    name: "@gracefullight/docusaurus-plugin-intercom",
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://widget.intercom.io",
            },
          },
          {
            tagName: "script",
            innerHTML: `window.intercomSettings = {
              app_id: ${options.appId}
            };
            (function(){
              var w=window;var ic=w.Intercom;
              if(typeof ic==="function"){
                ic('reattach_activator');
                ic('update',w.intercomSettings);
              }else{
                var d=document;
                var i=function(){
                  i.c(arguments);
                };
                i.q=[];
                i.c=function(args){i.q.push(args);};
                w.Intercom=i;
                var l=function(){
                  var s=d.createElement('script');
                  s.type='text/javascript';
                  s.async=true;
                  s.src='https://widget.intercom.io/widget/${options.appId}';
                  var x=d.getElementsByTagName('script')[0];
                  x.parentNode.insertBefore(s, x);};
                  if(document.readyState==='complete'){l();}
                  else if(w.attachEvent){w.attachEvent('onload',l);}
                  else{w.addEventListener('load',l,false);
                }
              }
            })();`,
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
