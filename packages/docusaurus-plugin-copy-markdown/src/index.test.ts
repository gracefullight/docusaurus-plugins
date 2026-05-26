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
  it("registers English default code translation messages", async () => {
    const plugin = await copyMarkdownPlugin({} as never, {});

    expect(plugin.getDefaultCodeTranslationMessages?.()).toEqual({
      [COPY_MARKDOWN_BUTTON_LABEL_ID]: DEFAULT_BUTTON_LABEL,
      [COPY_MARKDOWN_COPIED_LABEL_ID]: DEFAULT_COPIED_LABEL,
    });
  });
});
