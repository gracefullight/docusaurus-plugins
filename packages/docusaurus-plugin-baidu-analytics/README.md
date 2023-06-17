# @gracefullight/docusaurus-plugin-baidu-analytics

This plugin provides an easy way to add Baidu Analytics to your Docusaurus documentation website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-baidu-analytics
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-baidu-analytics",
      { siteId: "YOUR_SITE_ID" },
    ],
  ],
};
```

You need to replace "YOUR_SITE_ID" with the key you received from Baidu Analytics.
