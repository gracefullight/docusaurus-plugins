import type { Plugin, PostCssOptions } from "@docusaurus/types";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

export default function docusaurusTailwindCss(): Plugin {
  return {
    configurePostCss(postCssOptions: PostCssOptions): PostCssOptions {
      postCssOptions.plugins.push(tailwindcss);
      postCssOptions.plugins.push(autoprefixer);
      return postCssOptions;
    },
    name: "docusaurus-tailwindcss",
  };
}
