# @gracefullight/docusaurus-plugin-intercom

This plugin provides an easy way to add intercom to your Docusaurus documentation website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-intercom
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-intercom",
      { appId: "YOUR_APP_ID" },
    ],
  ],
};
```

You need to replace "YOUR_APP_ID" with the key you received from Intercom.
