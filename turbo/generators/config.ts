import type { PlopTypes } from "@turbo/gen";

import { camelCase, kebabCase, snakeCase, startCase } from "es-toolkit";
import { toLower, toUpper } from "es-toolkit/compat";

export default function generator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator("plugin", {
    actions: (answers) => {
      if (!answers) return [];
      const pluginName = kebabCase(answers.pluginName);
      const option = camelCase(answers.option);
      const data = {
        domain: answers.domain,
        option,
        optionUpper: toUpper(snakeCase(option)),
        pluginName,
        pluginNameCamel: camelCase(pluginName),
        pluginNameLower: toLower(pluginName.replace(/-/g, " ")),
        pluginNameStart: startCase(toLower(pluginName)),
      };
      const destination = `packages/docusaurus-plugin-${pluginName}`;
      return [
        {
          base: "turbo/generators/templates/plugin",
          data,
          destination,
          stripExtensions: ["hbs"],
          templateFiles: "turbo/generators/templates/plugin/**",
          type: "addMany",
        },
      ];
    },
    description: "create a new docusaurus plugin",
    prompts: [
      {
        message: "Plugin name",
        name: "pluginName",
        type: "input",
      },
      {
        default: "key",
        message: "Required option name",
        name: "option",
        type: "input",
      },
      {
        default: "",
        message: "Preconnect domain",
        name: "domain",
        type: "input",
      },
    ],
  });
}
