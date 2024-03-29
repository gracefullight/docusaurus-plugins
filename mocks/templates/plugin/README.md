# @gracefullight/docusaurus-plugin-${ pluginName }

This plugin provides an easy way to add ${ pluginNameStart } to your Docusaurus documentation website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-${ pluginName }
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-${ pluginName }",
      { ${ option }: "YOUR_${ optionUpper }" },
    ],
  ],
};
```

You need to replace "YOUR_${ optionUpper }" with the key you received from ${ pluginNameStart }.
