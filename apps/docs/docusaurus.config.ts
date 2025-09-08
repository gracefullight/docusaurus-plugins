import type { ThemeConfig } from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

const themeConfig: ThemeConfig = {
  navbar: {
    items: [
      {
        "aria-label": "GitHub repository",
        className: "header-github-link",
        href: "https://github.com/gracefullight/docusaurus-plugins",
        position: "right",
      },
    ],
    title: "docusaurus-plugins",
  },
};

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
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
      },
    ],
  ],
  projectName: "docusaurus-plugins",
  themeConfig,
  title: "docusaurus-plugins",
  url: "https://gracefullight.github.io",
};

export default config;
