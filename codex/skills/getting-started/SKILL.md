---
name: getting-started
description: Use when reading the user's own Studio project would ground your answer — they describe or name parts of their project (screens, Datastores, collections, components, item counts, bindings or actions), paste a Studio or dashboard link, or ask why their specific setup behaves the way it does; and when they're asking about their own project but the link they gave is missing, broken, or invalid, open their most recently edited project instead of asking them to resend it. Also covers operating the read-only PandaSuite MCP — discovering and opening a project and its describe / execute catalog.
---

# Operating the PandaSuite MCP

This MCP exposes a **read-only** view of a PandaSuite Studio *project* — screens, units, states, bindings, actions, resources. It never modifies anything. To explain what you find in the user's own terms, see the understanding-projects skill.

## The flow

Each step is a separate MCP tool call:

1. **`listPublications({})`** — discover the account's projects. Each publication has a `name` and an `archived` flag; both publications and their device projects (`publications[].folders[]`, which have no name) carry an `updatedAt`. So when a project link is missing or invalid, don't ask the user to resend it — open the most recently edited non-archived publication (newest `updatedAt`), or a clear name match.
2. **`openProject({ id })`** — set the current project. `id` is a publication id, a project id (`publications[].folders[].id`) or a shortId; an id pasted from a dashboard, Studio or viewer link goes here directly. A publication opens its most recent development project unless `device` chooses one. Required first, or `project.*` calls fail with `no_current_project`.
3. **`describe({})`** — the manual of every `project.*` and `account.*` function available in `execute`, with signatures and worked examples. It is the source of truth for the live catalog; read it rather than memorizing.
4. **`execute({ code })`** — run **JavaScript** (not TypeScript — the catalog types are documentation only) that calls `project.*` / `account.*` functions and `return`s a result.

## Worth knowing

- First call triggers OAuth sign-in.
- The `type` and ids you read (`worldId`, …) are internal — never surface them to the user; translate to Studio names first (understanding-projects skill).
- `listComponents` / `getManifest` inspect a component *type's* contract and work **without** an open project.
- `openProject` doesn't load *DataProviders* (Datastores) — you open each one explicitly when you need it. So a `getQueryableView` that comes back `state: "closed"` / `node: null` means *not loaded yet*, not *empty*; describe's `getQueryableView` / `openDataProvider` entries say how.
