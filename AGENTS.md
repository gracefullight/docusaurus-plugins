# Repository Guidelines

## Project Structure & Module Organization
- packages: Docusaurus plugins (e.g., `packages/docusaurus-plugin-sentry`) with `src/index.ts` and built `dist/`.
- packages/tsconfig: Shared TS configs.
- apps: Reserved for examples (currently empty).
- config: Tooling configs (commitlint, lint-staged).
- .changeset: Versioning and release metadata.

## Build, Test, and Development Commands
- `bun run build`: Build all packages via Turbo (`dist/**`).
- `bun run dev`: Watch builds across packages.
- `bun run --filter <pkg> build`: Build a single package (e.g., `@gracefullight/docusaurus-plugin-sentry`).
- `bun run format`: Format code with Biome.
- `bun run lint`: Lint and auto-fix with Biome.
- `bun run publish-packages`: Build + version + publish with Changesets.
- Requirements: Node `24`, bun `1`.

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

<!-- OMA:START — managed by oh-my-agent. Do not edit this block manually. -->

# oh-my-agent

## Architecture

- **SSOT**: `.agents/` directory (do not modify directly)
- **Response language**: Follows `language` in `.agents/oma-config.yaml`
- **Skills**: `.agents/skills/` (domain specialists)
- **Workflows**: `.agents/workflows/` (multi-step orchestration)
- **Subagents**: Same-vendor native dispatch via Codex custom agents in `.codex/agents/{name}.toml`; cross-vendor fallback via `oma agent:spawn`

## Per-Agent Dispatch

1. Resolve `target_vendor_for_agent` from `.agents/oma-config.yaml`.
2. If `target_vendor_for_agent === current_runtime_vendor`, use the runtime's native subagent path.
3. If vendors differ, or native subagents are unavailable, use `oma agent:spawn` for that agent only.

## Code Search

Prefer **serena MCP** tools over native find/grep when locating code — they are symbol-aware and faster on large repos. Fall back to native Read / Glob / Grep only when serena is unavailable or for plain file content reads.

| Task | Preferred tool |
|------|----------------|
| Locate a symbol definition (class / function / variable) | `find_symbol` |
| Find references / callers of a symbol | `find_referencing_symbols` |
| Outline a file's top-level symbols | `get_symbols_overview` |
| Pattern or regex search across the codebase | `search_for_pattern` |
| Find a file by name | `find_file` |
| List directory contents | `list_dir` |

## Workflows

Execute by naming the workflow in your prompt. Keywords are auto-detected via hooks.

| Workflow | File | Description |
|----------|------|-------------|
| orchestrate | `orchestrate.md` | Parallel subagents + Review Loop |
| work | `work.md` | Step-by-step with remediation loop |
| ultrawork | `ultrawork.md` | 5-Phase Gate Loop (11 reviews) |
| plan | `plan.md` | PM task breakdown |
| brainstorm | `brainstorm.md` | Design-first ideation |
| review | `review.md` | QA audit |
| debug | `debug.md` | Root cause + minimal fix |
| deepsec | `deepsec.md` | Drive `oma-deepsec` end-to-end (setup / scan / pr-review / matchers / triage) |
| scm | `scm.md` | SCM + Git operations + Conventional Commits |
| docs | `docs.md` | Documentation drift verify + sync |
| recap | `recap.md` | Daily / period AI conversation recap |

To execute: read and follow `.agents/workflows/{name}.md` step by step.

## Auto-Detection

Hooks: `UserPromptSubmit` (keyword detection), `PreToolUse`, `Stop` (persistent mode)
Keywords defined in `.agents/hooks/core/triggers.json` (multi-language).
Persistent workflows (orchestrate, ultrawork, work) block termination until complete.
Deactivate: say "workflow done".

## Rules

1. **Do not modify `.agents/` files** (SSOT protection).
2. Workflows execute via keyword detection or explicit naming, never self-initiated.
3. Response language follows `.agents/oma-config.yaml`

## Project Rules

Read the relevant file from `.agents/rules/` when working on matching code.

| Rule | File | Scope |
|------|------|-------|
| backend | `.agents/rules/backend.md` | on request |
| commit | `.agents/rules/commit.md` | on request |
| database | `.agents/rules/database.md` | **/*.{sql,prisma} |
| debug | `.agents/rules/debug.md` | on request |
| design | `.agents/rules/design.md` | on request |
| dev-workflow | `.agents/rules/dev-workflow.md` | on request |
| frontend | `.agents/rules/frontend.md` | **/*.{tsx,jsx,css,scss} |
| i18n-guide | `.agents/rules/i18n-guide.md` | always |
| infrastructure | `.agents/rules/infrastructure.md` | **/*.{tf,tfvars,hcl} |
| market | `.agents/rules/market.md` | on request |
| mobile | `.agents/rules/mobile.md` | **/*.{dart,swift,kt} |
| quality | `.agents/rules/quality.md` | on request |

<!-- OMA:END -->
