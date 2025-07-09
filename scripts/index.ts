import { Builtins, Cli } from "clipanion";
import { name } from "../package.json";
import * as Commands from "./commands";

const [, , ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `${name}-cli`,
  binaryName: "pnpm cmd",
  binaryVersion: "0.1.0",
});

cli.register(Builtins.HelpCommand);
cli.register(Commands.NewPluginCommand);

cli.runExit(args);
