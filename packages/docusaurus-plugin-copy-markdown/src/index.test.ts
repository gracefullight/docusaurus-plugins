import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  COPY_MARKDOWN_BUTTON_LABEL_ID,
  COPY_MARKDOWN_COPIED_LABEL_ID,
  DEFAULT_BUTTON_LABEL,
  DEFAULT_COPIED_LABEL,
} from "./constants";
import copyMarkdownPlugin, { validateOptions } from "./index";

describe("validateOptions", () => {
  it("applies defaults for omitted options", () => {
    const validated = validateOptions({
      options: {},
      validate: (schema, options) => schema.validate(options).value,
    });

    expect(validated.includeDocs).toBe(true);
    expect(validated.includeBlog).toBe(true);
    expect(validated.stripFrontmatter).toBe(true);
    expect(validated.injectTitleFromFrontmatter).toBe(true);
  });
});

describe("copyMarkdownPlugin", () => {
  it("registers the built JavaScript client module", async () => {
    const plugin = await copyMarkdownPlugin({} as never, {});
    const [clientModule] = plugin.getClientModules?.() ?? [];
    const normalizedClientModule = clientModule.split(path.sep).join("/");

    expect(normalizedClientModule).toMatch(
      /dist\/client\/copy-markdown-button\.js$/,
    );
    expect(normalizedClientModule).not.toContain("/src/");
    expect(normalizedClientModule).not.toMatch(/\.ts$/);
  });

  it("registers English default code translation messages", async () => {
    const plugin = await copyMarkdownPlugin({} as never, {});

    expect(plugin.getDefaultCodeTranslationMessages?.()).toEqual({
      [COPY_MARKDOWN_BUTTON_LABEL_ID]: DEFAULT_BUTTON_LABEL,
      [COPY_MARKDOWN_COPIED_LABEL_ID]: DEFAULT_COPIED_LABEL,
    });
  });
});

describe("package manifest", () => {
  it("only publishes built files", () => {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
      files: string[];
    };

    expect(packageJson.files).toEqual(["dist"]);
  });
});
