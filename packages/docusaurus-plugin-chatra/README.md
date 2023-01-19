# @gracefullight/docusaurus-plugin-chatra

This plugin provides an easy way to add chatra chat client to your Docusaurus documentation website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-chatra
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-chatra",
      { chatraId: "YOUR_CHATRA_ID" },
    ],
  ],
};
```

You need to replace "YOUR_CHATRA_ID" with the key you received from chatra.com
