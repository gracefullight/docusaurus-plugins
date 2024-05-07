import { extname, join, resolve } from "path";
import { Transform } from "stream";

import { Command, Option, UsageError } from "clipanion";
import {
  createReadStream,
  createWriteStream,
  ensureDir,
  pathExists,
  readdir,
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

interface ReplaceOptions {
  from: string;
  to: string;
  variables: Record<string, string>;
}

export class NewPluginCommand extends Command {
  static readonly paths = [[`new`]];
  static readonly usage = Command.Usage({
    description: "create a new docusaurus plugin",
    details:
      "This command will create a new docusaurus plugin in the packages directory with the specified name. The plugin will include a basic template with options for customization.",
    examples: [
      [
        `Create a new plugin named "my-plugin"`,
        `$0 new my-plugin -o optionName -d scriptDomain`,
      ],
    ],
  });

  pluginName = Option.String();
  requiredOptionName = Option.String("-o,--option", "key");
  preconnectDomain = Option.String("-d,--domain", "");

  private async replaceInDirectory({ from, to, variables }: ReplaceOptions) {
    await ensureDir(to);
    for (const fileDirent of await readdir(from, { withFileTypes: true })) {
      const fileName = fileDirent.name;
      if (fileDirent.isDirectory()) {
        // ? readdir recursive
        await this.replaceInDirectory({
          from: join(from, fileName),
          to: join(to, fileName),
          variables,
        });
      } else {
        const pluginFileName =
          extname(fileName) === ".txt"
            ? fileName.substring(0, fileName.lastIndexOf(".txt"))
            : fileName;

        // ? Read from template, Replace texts, Write to plugin
        createReadStream(join(from, fileName))
          .pipe(
            new Transform({
              transform(file, _, callback) {
                this.push(template(file.toString())(variables));
                callback();
              },
            }),
          )
          .pipe(createWriteStream(join(to, pluginFileName)))
          .on("error", (error) => {
            this.context.stderr.write("Unexpected stream error\n");
            this.context.stderr.write(JSON.stringify(error));
          });
      }
    }
  }

  async execute() {
    const pluginName = kebabCase(this.pluginName);
    const requiredOptionName = camelCase(this.requiredOptionName);

    // ? /packages
    const pluginRoot = resolve(__dirname, "../..");
    const pluginDirectory = join(
      pluginRoot,
      "packages",
      `docusaurus-plugin-${pluginName}`,
    );

    if (await pathExists(pluginDirectory)) {
      throw new UsageError(`Plugin ${pluginName} already exists`);
    }

    this.context.stdout.write(`📋 Copy plugin template\n`);

    const mockDirectory = resolve(__dirname, "../../mocks/templates/plugin");
    await this.replaceInDirectory({
      from: mockDirectory,
      to: pluginDirectory,
      variables: {
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
      },
    });

    this.context.stdout.write(`🪄 New Plugin ${pluginDirectory}/index.ts\n`);
  }
}
