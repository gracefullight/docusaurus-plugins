# @gracefullight/docusaurus-plugin-naver-analytics

This Docusaurus plugin adds support for Naver Analytics on your website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-naver-analytics
```

## Usage

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js docusaurus.config.js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-naver-analytics",
      { siteId: "YOUR_SITE_ID" },
    ],
  ],
};
```

You need to replace "YOUR_SITE_ID" with your own Naver Analytics site ID.
