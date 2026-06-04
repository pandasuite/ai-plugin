import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const EXPECTED_FILES = [
  ".mcp.json",
  "mcp.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".codex-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
  "gemini-extension.json",
  "GEMINI.md",
  ".agents/plugins/marketplace.json",
  "skills/getting-started/SKILL.md",
  "assets/logo.svg",
  "LICENSE",
  "README.md",
  ".release-it.json",
  "package.json",
  "package-lock.json",
  "scripts/sync-version.mjs",
];

const IGNORED_DIRS = new Set([".git", ".omx", "node_modules"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

async function pathExists(relativePath) {
  try {
    await stat(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readText(relativePath) {
  return readFile(path.join(ROOT, relativePath), "utf8");
}

async function readJson(relativePath) {
  try {
    return JSON.parse(await readText(relativePath));
  } catch (error) {
    fail(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
}

async function* walkFiles(directory = ".") {
  for (const entry of await readdir(path.join(ROOT, directory), { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;

    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(relativePath);
    } else if (entry.isFile()) {
      yield relativePath;
    }
  }
}

async function validateJsonFiles() {
  for await (const file of walkFiles()) {
    if (file.endsWith(".json")) {
      await readJson(file);
    }
  }
}

async function validateExpectedFiles() {
  for (const file of EXPECTED_FILES) {
    if (!(await pathExists(file))) {
      fail(`${file}: missing expected file`);
    }
  }
}

async function validateLogo() {
  const logo = await readText("assets/logo.svg");
  if (logo.includes("<!DOCTYPE")) {
    fail("assets/logo.svg: must not contain an external DOCTYPE");
  }
  if (logo.trimStart().startsWith("<?xml")) {
    fail("assets/logo.svg: omit the XML declaration for plugin compatibility");
  }
}

async function validateSkillFrontmatter() {
  for await (const file of walkFiles("skills")) {
    if (!file.endsWith("SKILL.md")) continue;

    const text = await readText(file);
    const match = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) {
      fail(`${file}: missing or unterminated frontmatter`);
      continue;
    }

    const values = Object.fromEntries(
      [...match[1].matchAll(/^([A-Za-z0-9_-]+):[ \t]*(.+?)[ \t]*$/gm)].map((entry) => [
        entry[1],
        entry[2],
      ]),
    );

    for (const key of ["name", "description"]) {
      if (!values[key]) {
        fail(`${file}: frontmatter missing ${key}`);
      }
    }
  }
}

async function validateNoClientPrefixedTools() {
  for await (const file of walkFiles("skills")) {
    if (!file.endsWith("SKILL.md")) continue;
    const text = await readText(file);
    if (text.includes("mcp__")) {
      fail(
        `${file}: contains a client-prefixed tool name (mcp__…). Use the bare tool name — the AI SDK runtime exposes MCP tools without a prefix.`,
      );
    }
  }
}

async function validateManifests() {
  const codex = await readJson(".codex-plugin/plugin.json");
  const claude = await readJson(".claude-plugin/plugin.json");
  const cursor = await readJson(".cursor-plugin/plugin.json");
  const gemini = await readJson("gemini-extension.json");
  const pkg = await readJson("package.json");
  const packageLock = await readJson("package-lock.json");
  const agentsMarketplace = await readJson(".agents/plugins/marketplace.json");
  const claudeMarketplace = await readJson(".claude-plugin/marketplace.json");
  const mcp = await readJson("mcp.json");
  const dotMcp = await readJson(".mcp.json");
  const packageVersion = pkg?.version;

  if (!/^\d+\.\d+\.\d+$/.test(packageVersion ?? "")) {
    fail("package.json: version must be semver-like (x.y.z)");
  }
  if (packageLock?.version !== packageVersion || packageLock?.packages?.[""]?.version !== packageVersion) {
    fail("package-lock.json: version must match package.json");
  }

  for (const [file, manifest] of [
    [".codex-plugin/plugin.json", codex],
    [".claude-plugin/plugin.json", claude],
    [".cursor-plugin/plugin.json", cursor],
    ["gemini-extension.json", gemini],
  ]) {
    if (!manifest) continue;
    if (manifest.name !== "pandasuite") fail(`${file}: name must be pandasuite`);
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) {
      fail(`${file}: version must be semver-like (x.y.z)`);
    }
    if (packageVersion && manifest.version !== packageVersion) {
      fail(`${file}: version must match package.json (${packageVersion})`);
    }
  }

  if (codex) {
    if (codex.skills !== "./skills/") fail(".codex-plugin/plugin.json: skills must point to ./skills/");
    if (codex.mcpServers !== "./.mcp.json") {
      fail(".codex-plugin/plugin.json: mcpServers must point to ./.mcp.json");
    }
    if (codex.interface?.logo !== "./assets/logo.svg") {
      fail(".codex-plugin/plugin.json: interface.logo must point to ./assets/logo.svg");
    }
  }

  for (const [file, config] of [
    ["mcp.json", mcp],
    [".mcp.json", dotMcp],
  ]) {
    const server = config?.mcpServers?.pandasuite;
    if (server?.type !== "http" || server?.url !== "https://mcp.pandasuite.com/mcp") {
      fail(`${file}: unexpected PandaSuite MCP server config`);
    }
  }

  const agentsPlugin = agentsMarketplace?.plugins?.[0];
  if (agentsMarketplace?.name !== "pandasuite" || agentsPlugin?.name !== "pandasuite") {
    fail(".agents/plugins/marketplace.json: marketplace and plugin names must be pandasuite");
  }
  if (agentsPlugin?.source?.url !== "https://github.com/pandasuite/ai-plugin.git") {
    fail(".agents/plugins/marketplace.json: plugin source URL is unexpected");
  }

  const claudePlugin = claudeMarketplace?.plugins?.[0];
  if (claudeMarketplace?.name !== "pandasuite" || claudePlugin?.name !== "pandasuite") {
    fail(".claude-plugin/marketplace.json: marketplace and plugin names must be pandasuite");
  }
  if (claudePlugin?.source !== "./") {
    fail('.claude-plugin/marketplace.json: plugin source must be "./"');
  }
}

await validateExpectedFiles();
await validateJsonFiles();
await validateLogo();
await validateSkillFrontmatter();
await validateNoClientPrefixedTools();
await validateManifests();

if (failures.length) {
  console.error("Validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Plugin validation passed");
