# @gracefullight/docusaurus-plugin-gitter

This plugin provides an easy way to add Gitter to your Docusaurus documentation website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-gitter
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-gitter",
      { room: "YOUR_ROOM" },
    ],
  ],
};
```

You need to replace "YOUR_ROOM" with the key you received from Gitter.
