---
name: getting-started
description: Use when connecting to the PandaSuite MCP or reading a Studio project — the read-only contract and how to operate its describe / execute catalog tools.
---

# Operating the PandaSuite MCP

This MCP exposes a **read-only** view of a PandaSuite Studio *project* — screens, units, states, bindings, actions, resources. It never modifies anything. To explain what you find in the user's own terms, see the understanding-projects skill.

## The flow

Each step is a separate MCP tool call:

1. **`listPublications({})`** — discover the account's projects; the value you open is a folder id at `publications[].folders[].id`. *(Skip if you already have the `folder_id`, e.g. from the Studio URL.)* Each publication has a `name` and an `archived` flag; both publications and folders carry an `updatedAt`, and a publication has one folder per device (folders have no name). So when a project link is missing or invalid, don't ask the user to resend it — open the most recently edited non-archived project (newest publication `updatedAt`, then its newest folder), or a clear name match.
2. **`openProject({ folder_id })`** — set the current project. Required first, or catalog calls fail with `NoCurrentProject`.
3. **`describe({})`** — the manual of every `codemode.*` function available in `execute`, with signatures and worked examples. It is the source of truth for the live catalog; read it rather than memorizing.
4. **`execute({ code })`** — run **JavaScript** (not TypeScript — the catalog types are documentation only) that calls `codemode.*` functions and `return`s a result.

## Worth knowing

- First call triggers OAuth sign-in.
- The `type` and ids you read (`worldId`, …) are internal — never surface them to the user; translate to Studio names first (understanding-projects skill).
- `listComponents` / `getManifest` inspect a component *type's* contract and work **without** an open project.
- `openProject` doesn't load *DataProviders* (Datastores) — you open each one explicitly when you need it. So a `getQueryableView` that comes back `state: "closed"` / `node: null` means *not loaded yet*, not *empty*; describe's `getQueryableView` / `openDataProvider` entries say how.
