import { extname, join, resolve } from "node:path";
import { Transform } from "node:stream";

import { Command, Option, UsageError } from "clipanion";
import { camelCase, kebabCase, snakeCase, startCase } from "es-toolkit";
import { template, toLower, toUpper } from "es-toolkit/compat";
import {
  createReadStream,
  createWriteStream,
  ensureDir,
  pathExists,
  readdir,
} from "fs-extra";

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
    const fileDirents = await readdir(from, { withFileTypes: true });

    await Promise.all(
      fileDirents.map(async (fileDirent) => {
        const fileName = fileDirent.name;
        if (fileDirent.isDirectory()) {
          // readdir recursive
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

          // Read from template, Replace texts, Write to plugin
          await new Promise((resolve, reject) => {
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
                reject(error);
              })
              .on("finish", resolve);
          });
        }
      }),
    );
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
