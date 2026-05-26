import { DEFAULT_EXCLUDED_ROUTES } from "./constants";

function routePatternToRegExp(pattern: string): RegExp {
  const normalized = pattern.endsWith("/")
    ? `${pattern.slice(0, -1)}`
    : pattern;
  const escaped = normalized
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]+");
  return new RegExp(`^${escaped}(/)?$`);
}

export function createRouteExclusionMatcher(
  extraPatterns: string[] = [],
): (pathname: string) => boolean {
  const patterns = [...DEFAULT_EXCLUDED_ROUTES, ...extraPatterns];

  return (pathname: string) => {
    const normalized =
      pathname.endsWith("/") && pathname.length > 1
        ? pathname.slice(0, -1)
        : pathname;

    return patterns.some((pattern) =>
      routePatternToRegExp(pattern).test(normalized),
    );
  };
}

export function addPathnameKeys<T>(
  routes: Record<string, T>,
  pathname: string,
  value: T,
): void {
  routes[pathname] = value;

  if (pathname.endsWith("/") && pathname.length > 1) {
    routes[pathname.slice(0, -1)] = value;
    return;
  }

  if (!pathname.endsWith("/")) {
    routes[`${pathname}/`] = value;
  }
}
