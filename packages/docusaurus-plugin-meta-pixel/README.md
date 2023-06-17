# @gracefullight/docusaurus-plugin-meta-pixel

This Docusaurus plugin adds support for Meta Pixel on your website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-meta-pixel
```

## Usage

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js docusaurus.config.js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-meta-pixel",
      { pixelId: "YOUR_PIXEL_ID" },
    ],
  ],
};
```

You need to replace "YOUR_PIXEL_ID" with your own Meta Pixel ID.
