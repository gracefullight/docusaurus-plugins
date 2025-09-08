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
  // Ensure branch-based GH Pages deploys target the right branch
  deploymentBranch: "gh-pages",
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
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  projectName: "docusaurus-plugins",
  themeConfig,
  title: "docusaurus-plugins",
  // Set explicit trailingSlash for GitHub Pages to avoid redirect quirks
  trailingSlash: true,
  url: "https://gracefullight.github.io",
};

export default config;
