# @gracefullight/docusaurus-plugin-cloudflare-analytics

This plugin provides an easy way to add Cloudflare Analytics to your Docusaurus documentation website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-cloudflare-analytics
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-cloudflare-analytics",
      { token: "YOUR_TOKEN" },
    ],
  ],
};
```

You need to replace "YOUR_TOKEN" with the key you received from [Cloudflare Analytics](https://dash.cloudflare.com).
