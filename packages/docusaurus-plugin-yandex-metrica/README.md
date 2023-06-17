# @gracefullight/docusaurus-plugin-yandex-metrica

This plugin provides an easy way to add Yandex Metrica to your Docusaurus documentation website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-yandex-metrica
```

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-yandex-metrica",
      { counterId: "YOUR_COUNTER_ID" },
    ],
  ],
};
```

You need to replace "YOUR_COUNTER_ID" with the key you received from Yandex Metrica.
