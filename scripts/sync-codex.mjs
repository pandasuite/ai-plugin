import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Codex installs the plugin from codex/ (.agents/plugins/marketplace.json). With no
// plugin.json there, Codex loads it in its native format, which has no budget on MCP
// tools: as an Agent Plugin, tools past a 64 KB budget shared by all plugins are hidden.
// A native manifest cannot point outside its folder, so the files it uses are copied in.
// Everything in codex/ is generated: edit the root files, then run `npm run codex:sync`.
export const CODEX_COPIES = [".mcp.json", "assets/logo.svg", "skills"];
export const CODEX_MANIFEST = "codex/.codex-plugin/plugin.json";

// The native manifest, built from the root Agent Plugins manifest. The spec's closed schema
// bars `interface` from the root's top level, so it rides there under extensions["com.openai"].
export function codexManifest(root) {
  const { $schema, extensions, ...fields } = root;
  return {
    ...fields,
    skills: "./skills/",
    mcpServers: "./.mcp.json",
    interface: extensions?.["com.openai"]?.interface,
  };
}

export const serializeManifest = (manifest) => `${JSON.stringify(manifest, null, 2)}\n`;

export async function syncCodex() {
  for (const source of CODEX_COPIES) {
    await rm(`codex/${source}`, { recursive: true, force: true });
    await cp(source, `codex/${source}`, { recursive: true });
  }
  const root = JSON.parse(await readFile("plugin.json", "utf8"));
  await mkdir("codex/.codex-plugin", { recursive: true });
  await writeFile(CODEX_MANIFEST, serializeManifest(codexManifest(root)));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await syncCodex();
  console.log("Synchronized codex/ with the root plugin.json, .mcp.json, logo and skills");
}
