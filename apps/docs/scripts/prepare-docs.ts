import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";

async function main() {
  const monorepoRoot = join(process.cwd(), "..", "..");
  const packagesRoot = join(monorepoRoot, "packages");
  const outDir = join(process.cwd(), "docs", "plugins");

  await rm(outDir, { force: true, recursive: true });
  await mkdir(outDir, { recursive: true });

  // Copy the monorepo README as the docs intro page
  const repoReadme = join(monorepoRoot, "README.md");
  const introDoc = join(process.cwd(), "docs", "intro.md");
  try {
    await access(repoReadme);
    const raw = await readFile(repoReadme, "utf8");
    // Rewrite repo-relative links that would 404 on the docs site
    const rewritten = raw.replace(
      /\((?:\.\/)?LICENSE(?:\.md)?\)/g,
      "(#license)",
    );
    await writeFile(introDoc, rewritten, "utf8");
  } catch {
    // ignore if the root README does not exist
  }

  // Copy each package README under docs/plugins
  const packages = await readdir(packagesRoot, { withFileTypes: true });

  for (const dir of packages) {
    if (!dir.isDirectory() || dir.name === "tsconfig") continue;
    const readme = join(packagesRoot, dir.name, "README.md");
    try {
      await access(readme);
      await copyFile(readme, join(outDir, `${dir.name}.md`));
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
