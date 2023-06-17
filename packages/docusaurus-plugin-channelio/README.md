# @gracefullight/docusaurus-plugin-channelio

This plugin provides an easy way to add channel.io to your Docusaurus documentation website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-channelio
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-channelio",
      { pluginKey: "YOUR_PLUGIN_KEY" },
    ],
  ],
};
```

You need to replace "YOUR_PLUGIN_KEY" with the key you received from channel.io.
