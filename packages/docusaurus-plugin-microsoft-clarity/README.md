# @gracefullight/docusaurus-plugin-microsoft-clarity

This Docusaurus plugin adds support for Microsoft Clarity on your website.

## Installation

You can install this plugin via pnpm:

```bash
pnpm add @gracefullight/docusaurus-plugin-microsoft-clarity
```

## Usage

To use this plugin, you will need to configure it in your Docusaurus `docusaurus.config.js` file. You can add the following configuration to enable the plugin:

```js docusaurus.config.js
module.exports = {
  plugins: [
    [
      "@gracefullight/docusaurus-plugin-microsoft-clarity",
      { projectId: "YOUR_PROJECT_ID" },
    ],
  ],
};
```

You need to replace "YOUR_PROJECT_ID" with your own Microsoft Clarity project ID.
