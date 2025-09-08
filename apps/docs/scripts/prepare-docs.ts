import { access, copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "..", "..", "packages");
const outDir = join(process.cwd(), "docs", "plugins");

await rm(outDir, { force: true, recursive: true });
await mkdir(outDir, { recursive: true });

const packages = await readdir(root, { withFileTypes: true });

for (const dir of packages) {
  if (!dir.isDirectory() || dir.name === "tsconfig") continue;
  const readme = join(root, dir.name, "README.md");
  try {
    await access(readme);
    await copyFile(readme, join(outDir, `${dir.name}.md`));
  } catch {
    /* ignore */
  }
}
