import type { Config } from "@docusaurus/types";

const config: Config = {
  baseUrl: "/docusaurus-plugins/",
  favicon: "img/favicon.ico",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  organizationName: "gracefullight",
  presets: [
    [
      "classic",
      {
        blog: false,
        docs: {
          sidebarPath: "./sidebars.ts",
        },
      },
    ],
  ],
  projectName: "docusaurus-plugins",
  title: "docusaurus-plugins",
  url: "https://gracefullight.github.io",
};

export default config;
