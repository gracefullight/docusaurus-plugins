# @gracefullight/docusaurus-plugin-google-adsense

This Docusaurus plugin adds support for Google AdSense on your website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-google-adsense
```

## Usage

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js docusaurus.config.js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-google-adsense",
      { adClient: "YOUR_AD_CLIENT" },
    ],
  ],
};
```

You need to replace "YOUR_AD_CLIENT" with your own AdSense client ID.
