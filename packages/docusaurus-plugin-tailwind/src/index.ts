import type { Plugin, PostCssOptions } from "@docusaurus/types";

export default function docusaurusTailwindCss(): Plugin {
  return {
    name: "docusaurus-tailwindcss",
    configurePostCss(postCssOptions: PostCssOptions): PostCssOptions {
      postCssOptions.plugins.push(require("tailwindcss"));
      postCssOptions.plugins.push(require("autoprefixer"));
      return postCssOptions;
    },
  };
}
