# PandaSuite — AI plugin

Give your AI agent eyes on the app you built in [PandaSuite](https://pandasuite.com).

PandaSuite is a no-code studio for interactive apps, where rich behavior is *composed* from simple pieces rather than dropped in as one big widget. This plugin lets an agent read a Studio project and talk about it the way you do — in screens, elements, and interactions, not data types or tool names.

Ask it to:

- **Explain a project** — yours, or one a teammate built — screen by screen, in plain language.
- **Work out why something won't work** — an audio that won't play, a link that doesn't trigger — by reading both the documentation and how your app is actually built.
- **Show you how to make something** — what's behind a set of tabs, or a parallax — grounded in the docs, not guesswork.

It's **read-only**. The agent sees your project; it never changes it.

Works in Claude Code, Codex, Cursor, Antigravity, and Gemini CLI. Sign-in is OAuth in the browser — no API key to paste.

## Install

**Claude Code**
- `/plugin marketplace add pandasuite/ai-plugin`, then `/plugin install pandasuite@pandasuite`.
- Local (dev): `claude --plugin-dir /path/to/ai-plugin` (the cloned repo).

**Gemini CLI**
- `gemini extensions install https://github.com/pandasuite/ai-plugin`
- Note: Gemini CLI is being folded into Antigravity; consumer access (free and AI Pro/Ultra) ends June 18, 2026 (enterprise licenses keep it). New users → use Antigravity below.

**Antigravity**
- CLI: `agy plugin install https://github.com/pandasuite/ai-plugin` — installs the skills and the MCP together.
- IDE: add the plugin from the **Customizations** page.
- OAuth runs on first use — ask the agent about your project and it'll prompt.

**Codex**
- `codex plugin marketplace add pandasuite/ai-plugin`, then `codex plugin add pandasuite@pandasuite` (or run `codex` and use `/plugins`).
- Sign in: `codex mcp login pandasuite` — opens the browser for OAuth. Check it with `codex mcp get pandasuite`.

**Cursor**
- Install from this repo via Cursor's plugin settings (ships `.cursor-plugin/plugin.json`).

## What's inside

One MCP gives the agent a read-only connection; three skills teach it to use that connection well.

- **getting-started** — how to connect and read a project: the read-only contract, and the connect → open → explore flow.
- **understanding-projects** — how to read a project the way Studio shows it: screens, foreground and background layers, and the real meaning behind technical names (the thing called a "button" is often a Multi-state; a "list" is a layout box).
- **docs-how-to** — how to answer how-to and troubleshooting questions from the documentation and your own project together, and cite its sources.

The connection is the **PandaSuite MCP** (`https://mcp.pandasuite.com`) — read-only, one Studio project at a time. It discovers what a project contains from the live catalog, not a frozen list, so it stays accurate as PandaSuite evolves.

## Use the skills in your own agent

The skills also ship as a data package, so you can drop them into your own AI SDK agent (e.g. the Claude Agent SDK) without installing the full plugin.

```sh
npm install @pandasuite/skills
```

```js
import { skills } from "@pandasuite/skills";

// skills: { name, description, body, files? }[]
const gettingStarted = skills.find((s) => s.name === "getting-started");
console.log(gettingStarted?.body); // the SKILL.md markdown, ready to inject
```

Each entry comes from a `SKILL.md`: its `name`, `description`, the markdown `body`, and any companion `files` (relative path → contents). Tool names in the bodies are harness-neutral (no `mcp__` prefix), so they work as-is in an AI SDK runtime.

## Legal

[Privacy Policy](https://www.iubenda.com/privacy-policy/47093119) · [Terms](https://www.iubenda.com/terms-and-conditions/47093119) · [Cookie Policy](https://www.iubenda.com/privacy-policy/47093119/cookie-policy)
