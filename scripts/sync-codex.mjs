import { cp, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Codex installs the plugin from codex/ (.agents/plugins/marketplace.json). With no
// plugin.json there, Codex loads it in its native format, which has no budget on MCP
// tools: as an Agent Plugin, tools past a 64 KB budget shared by all plugins are hidden.
// A native manifest cannot point outside its folder, so the files it uses are copied in.
export const CODEX_COPIES = [".mcp.json", "assets/logo.svg", "skills"];

export async function syncCodex() {
  for (const source of CODEX_COPIES) {
    await rm(`codex/${source}`, { recursive: true, force: true });
    await cp(source, `codex/${source}`, { recursive: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await syncCodex();
  console.log("Synchronized codex/ with the root .mcp.json, logo and skills");
}
