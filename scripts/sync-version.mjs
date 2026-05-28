import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSIONED_MANIFESTS = [
  "package.json",
  "package-lock.json",
  ".claude-plugin/plugin.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "gemini-extension.json",
];

const version = process.argv[2];

if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("Usage: node scripts/sync-version.mjs <semver>");
  process.exit(1);
}

async function updateManifest(relativePath) {
  const filePath = path.join(process.cwd(), relativePath);
  const manifest = JSON.parse(await readFile(filePath, "utf8"));
  manifest.version = version;
  if (relativePath === "package-lock.json" && manifest.packages?.[""]) {
    manifest.packages[""].version = version;
  }
  await writeFile(filePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

await Promise.all(VERSIONED_MANIFESTS.map(updateManifest));
console.log(`Synchronized plugin manifests to v${version}`);
