# Repository Guidelines

## Project Structure & Module Organization
- packages: Docusaurus plugins (e.g., `packages/docusaurus-plugin-sentry`) with `src/index.ts` and built `dist/`.
- packages/tsconfig: Shared TS configs.
- apps: Reserved for examples (currently empty).
- config: Tooling configs (commitlint, lint-staged).
- .changeset: Versioning and release metadata.

## Build, Test, and Development Commands
- `pnpm build`: Build all packages via Turbo (`dist/**`).
- `pnpm dev`: Watch builds across packages.
- `pnpm --filter <pkg> build`: Build a single package (e.g., `@gracefullight/docusaurus-plugin-sentry`).
- `pnpm format`: Format code with Biome.
- `pnpm lint`: Lint and auto-fix with Biome.
- `pnpm publish-packages`: Build + version + publish with Changesets.
- Requirements: Node `22`, pnpm `10`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; line width 80; LF endings; JS quotes: double (Biome enforced).
- Filenames: kebab-case (e.g., `index.ts`, `my-plugin.ts`).
- Imports: auto-organized; unused code disallowed by Biome.
- TypeScript: strict; shared config in `packages/tsconfig`; package output is CJS with `.d.ts`.

## Testing Guidelines
- No active test suite in this repo. If adding tests, colocate as `*.test.ts` next to sources. Avoid `test/` folders (excluded from workspace).
- Aim for small, deterministic unit tests around plugin hooks.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Hooks enforce `commitlint` and Biome via Husky/lint-staged. Devmoji is available; emoji use is optional.
- PRs: One focused change per PR. Include a summary, screenshots if UI-related (e.g., example app), and link related issues. Update `.changeset` with an appropriate bump for affected packages.
- Naming: Prefer scopes per package (e.g., `@gracefullight/docusaurus-plugin-<name>`).

## Security & Configuration Tips
- Plugins often inject third-party scripts. Validate IDs/keys via Docusaurus config and avoid committing secrets.
- Keep external script options minimal and documented in each package `README.md`.
