# @gracefullight/docusaurus-plugin-sentry

This Docusaurus plugin adds support for Sentry on your website.

## Installation

You can install this plugin via yarn:

```bash
yarn add @gracefullight/docusaurus-plugin-sentry
```

## Usage

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js docusaurus.config.js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-sentry",
      { 
        publicKey: "YOUR_PROJECT_PUBLIC_KEY",
        lazy: true,
        tracesSampleRate: 1,
      },
    ],
  ],
};
```

You need to replace "YOUR_PROJECT_PUBLIC_KEY" with your own [Sentry project public key](https://docs.sentry.io/platforms/javascript/install/lazy-load-sentry/#using-the-loader).
