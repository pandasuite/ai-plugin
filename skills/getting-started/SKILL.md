---
name: getting-started
description: Use when connecting to the PandaSuite MCP or reading a Studio project — the read-only contract and how to operate its describe / execute catalog tools.
---

# Operating the PandaSuite MCP

This MCP exposes a **read-only** view of a PandaSuite Studio *project* — screens, units, states, bindings, actions, resources. It never modifies anything. To explain what you find in the user's own terms, see the understanding-projects skill.

## The flow

Each step is a separate `mcp__pandasuite__*` tool call:

1. **`listPublications({})`** — discover the account's projects; the value you open is a folder id at `publications[].folders[].id`. *(Skip if you already have the `folder_id`, e.g. from the Studio URL.)*
2. **`openProject({ folder_id })`** — set the current project. Required first, or catalog calls fail with `NoCurrentProject`.
3. **`describe({})`** — the manual of every `codemode.*` function available in `execute`, with signatures and worked examples. It is the source of truth for the live catalog; read it rather than memorizing.
4. **`execute({ code })`** — run **JavaScript** (not TypeScript — the catalog types are documentation only) that calls `codemode.*` functions and `return`s a result.

## Worth knowing

- First call triggers OAuth sign-in.
- The `type` and ids you read (`worldId`, …) are internal — never surface them to the user; translate to Studio names first (understanding-projects skill).
- `listComponents` / `getManifest` inspect a component *type's* contract and work **without** an open project.
