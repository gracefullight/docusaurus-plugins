# Contributing to @gracefullight/docusaurus-plugins

First off, thank you for considering contributing to @gracefullight/docusaurus-plugins.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project.

## How to contribute

### Creating a new plugin

To create a new docusaurus plugin, run the following command:

```bash
yarn cmd new <PLUGIN_NAME> -o <OPTION_NAME> -d <SCRIPT_DOMAIN>
```

Replace `<PLUGIN_NAME>` with the desired name for your plugin (kebab-case format), `<OPTION_NAME>` with the option name for your plugin (camelCase format), and `<SCRIPT_DOMAIN>` with the domain that the plugin will preconnect to.

This command will create a new docusaurus plugin in the `packages` directory with the specified name. The plugin will include a basic template with options for customization.

### Submitting a pull request

1. Fork the repository and create your branch from `main`.
2. Add tests for any new features or changes.
3. Update the documentation if necessary.
4. Your pull request should include the following:
   - A clear and concise description of the problem you are solving.
   - A detailed explanation of your solution.
   - Any relevant information, such as links to related issues.
5. Once your pull request is created, it will be reviewed by the repository maintainers.

### Reporting a bug

1. Make sure the bug has not already been reported by searching on GitHub under [Issues](https://github.com/gracefullight/docusaurus-plugins/issues).
2. If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/gracefullight/docusaurus-plugins/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.
3. If you found a closed issue, please open a new one with the same title and add a comment that you are reopen it.

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
