import type { Plugin, PostCssOptions } from "@docusaurus/types";

export default function docusaurusTailwindCss(): Plugin {
  return {
    configurePostCss(postCssOptions: PostCssOptions): PostCssOptions {
      postCssOptions.plugins.push(require("tailwindcss"));
      postCssOptions.plugins.push(require("autoprefixer"));
      return postCssOptions;
    },
    name: "docusaurus-tailwindcss",
  };
}
