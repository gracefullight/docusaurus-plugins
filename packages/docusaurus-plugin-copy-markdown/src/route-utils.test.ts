import { describe, expect, it } from "vitest";
import { addPathnameKeys, createRouteExclusionMatcher } from "./route-utils";

describe("createRouteExclusionMatcher", () => {
  const isExcluded = createRouteExclusionMatcher();

  it("excludes built-in utility routes", () => {
    expect(isExcluded("/search")).toBe(true);
    expect(isExcluded("/404")).toBe(true);
    expect(isExcluded("/blog/tags")).toBe(true);
    expect(isExcluded("/blog/archive")).toBe(true);
  });

  it("allows regular docs and blog routes", () => {
    expect(isExcluded("/docs/intro")).toBe(false);
    expect(isExcluded("/blog/welcome")).toBe(false);
  });

  it("matches trailing slashes consistently", () => {
    expect(isExcluded("/search/")).toBe(true);
    expect(isExcluded("/blog/welcome/")).toBe(false);
  });

  it("supports custom glob patterns", () => {
    const customMatcher = createRouteExclusionMatcher(["/draft/**"]);

    expect(customMatcher("/draft/secret")).toBe(true);
    expect(customMatcher("/published/post")).toBe(false);
  });
});

describe("addPathnameKeys", () => {
  it("stores both trailing and non-trailing slash keys", () => {
    const routes: Record<string, string> = {};

    addPathnameKeys(routes, "/blog/welcome", "markdown");

    expect(routes["/blog/welcome"]).toBe("markdown");
    expect(routes["/blog/welcome/"]).toBe("markdown");
  });

  it("stores both variants when the pathname already has a trailing slash", () => {
    const routes: Record<string, string> = {};

    addPathnameKeys(routes, "/blog/welcome/", "markdown");

    expect(routes["/blog/welcome/"]).toBe("markdown");
    expect(routes["/blog/welcome"]).toBe("markdown");
  });
});
