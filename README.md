# PandaSuite — AI plugin

Connect an AI agent to your [PandaSuite Studio](https://pandasuite.com) project. Read-only exploration of screens, units, structure, and state via the PandaSuite MCP (`https://mcp.pandasuite.com`), plus a getting-started skill. Works in Claude Code, Codex, Cursor, and Gemini CLI.

Authentication is OAuth — no API key to paste. Most tools trigger it on first connect; Codex uses an explicit `codex mcp login pandasuite` (see below).

## Install

**Claude Code**
- `/plugin marketplace add pandasuite/ai-plugin`, then `/plugin install pandasuite@pandasuite`.
- Local (dev): `claude --plugin-dir /path/to/ai-plugin` (the cloned repo).

**Gemini CLI**
- `gemini extensions install https://github.com/pandasuite/ai-plugin`

**Codex**
- Install: `codex plugin marketplace add pandasuite/ai-plugin`, then `codex plugin add pandasuite@pandasuite`. (Or run `codex` and use `/plugins` in the TUI.)
- Sign in: `codex mcp login pandasuite` — opens your browser for PandaSuite OAuth. Verify with `codex mcp get pandasuite`.

**Cursor**
- Install from this repo via Cursor's plugin settings (ships `.cursor-plugin/plugin.json`).

## What you get

- The PandaSuite MCP (code mode): session tools `openProject` / `getCurrentProject`, account discovery `listPublications` / `listChannels`, plus `describe` (the catalog manual) and `execute` (runs JavaScript over the `codemode.*` catalog).
- A `getting-started` skill explaining the domain model and the connect → `listPublications` → `openProject` → `describe` → `execute` flow.

## Legal

[Privacy Policy](https://www.iubenda.com/privacy-policy/47093119) · [Terms](https://www.iubenda.com/terms-and-conditions/47093119) · [Cookie Policy](https://www.iubenda.com/privacy-policy/47093119/cookie-policy)
