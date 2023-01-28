import { extname, join, resolve } from "path";
import { Transform } from "stream";

import { Command, Option, UsageError } from "clipanion";
import {
  pathExists,
  readdir,
  createWriteStream,
  createReadStream,
  ensureDir,
} from "fs-extra";
import {
  camelCase,
  kebabCase,
  snakeCase,
  startCase,
  template,
  toLower,
  toUpper,
} from "lodash";

export class NewPluginCommand extends Command {
  static paths = [[`new`]];
  static usage = Command.Usage({
    description: "create a new docusaurus plugin",
    details:
      "This command will create a new docusaurus plugin in the packages directory with the specified name. The plugin will include a basic template with options for customization.",
    examples: [
      [
        `Create a new plugin named "my-plugin"`,
        `$0 new my-plugin -o optionName`,
      ],
    ],
  });

  pluginName = Option.String();
  requiredOptionName = Option.String("-o,--option", "key");
  preconnectDomain = Option.String("-d,--domain", "");

  async execute() {
    const pluginName = kebabCase(this.pluginName);
    const requiredOptionName = camelCase(this.requiredOptionName);

    // ? /packages
    const pluginRoot = resolve(__dirname, "../..");
    const pluginDirectory = join(
      pluginRoot,
      "packages",
      `docusaurus-plugin-${pluginName}`
    );

    if (await pathExists(pluginDirectory)) {
      throw new UsageError(`Plugin ${pluginName} already exists`);
    }

    this.context.stdout.write(`📋 Copy plugin template\n`);
    const templateVariables = {
      // ? For package.json
      pluginName,
      // ? For README.md
      pluginNameStart: startCase(toLower(pluginName)),
      // ? For Plugin Function name
      pluginNameCamel: camelCase(pluginName),
      // ? For Keyword
      pluginNameLower: toLower(pluginName.replace(/-/g, " ")),
      // ? For Plugin Function option
      option: requiredOptionName,
      // ? For README.md
      optionUpper: toUpper(snakeCase(requiredOptionName)),
      domain: this.preconnectDomain,
    };

    await ensureDir(pluginDirectory);
    const mockDirectory = resolve(__dirname, "../../mocks/templates/plugin");

    for (const file of await readdir(mockDirectory)) {
      const pluginFile =
        extname(file) === ".txt"
          ? file.substring(0, file.lastIndexOf(".txt"))
          : file;

      // ? Read from template, Replace texts, Write to plugin
      createReadStream(join(mockDirectory, file))
        .pipe(
          new Transform({
            transform(file, _, callback) {
              this.push(template(file.toString())(templateVariables));
              callback();
            },
          })
        )
        .pipe(createWriteStream(join(pluginDirectory, pluginFile)))
        .on("error", (error) => {
          this.context.stderr.write("Unexpected stream error\n");
          this.context.stderr.write(JSON.stringify(error));
        });
    }

    this.context.stdout.write(`🪄 New Plugin ${pluginDirectory}/index.ts\n`);
  }
}
