---
name: getting-started
description: Use when working with a PandaSuite Studio project via the PandaSuite MCP — the domain model, the read-only contract, and the connect → listPublications → openProject → describe → execute flow.
---

# Getting started with PandaSuite Studio

PandaSuite Studio is a no-code platform for building interactive apps. This MCP exposes a **read-only** view of a Studio *project* — screens, units, containers, states, bindings, actions, and resources. It never modifies anything.

## Domain model

- **unit** — the atomic building block (button, image, group, gallery, data provider, …). Every unit has an `id`, a `type` (its manifest id), and a place in the tree.
- **screen** — a `ViewFolder`; traverse its `worldId` to reach the units on it.
- **container** — a unit that holds children (group, gallery, world, …).
- **state** — containers can carry states; `statePath` is an *ordered array* — treat it as an array, never assume length 1.
- **project root** — the top of the unit tree.

## How to use this MCP

Each step is a separate MCP tool call (`mcp__pandasuite__*`):

1. **Connect** the `pandasuite` MCP. The first call triggers OAuth sign-in to PandaSuite.
2. **`listPublications({})`** — discover the account's projects. Each publication carries a `folders` array; the value you open is a folder id at `publications[].folders[].id`. *(Skip if you already know the `folder_id`, e.g. from the Studio URL.)*
3. **`openProject({ folder_id })`** — set the current project. Required before any catalog call; otherwise catalog functions return `NoCurrentProject`.
4. **`describe({})`** — returns the manual of every `codemode.*` function available inside `execute`, with typed signatures and worked examples. **Read it before writing `execute` code** — it is the source of truth for the live catalog.
5. **`execute({ code })`** — run JavaScript that calls the documented `codemode.*` functions and `return`s a result.

## Worked example

```
describe({})
execute({ code: "const screens = await codemode.getScreens(); return codemode.getChildren({ unitId: screens[0].worldId });" })
```

## Notes

- **Read-only** — nothing here mutates the project.
- **Component *contracts* vs project *instances*.** The flow above reads the *open project*. To inspect a component *type* itself (its properties, events, actions — what any instance can do), `describe({})` also surfaces manifest tools (`listComponents` / `getManifest`) that do **not** require an open project.
- **Write JavaScript, not TypeScript**, inside `execute`; the catalog is documented in TypeScript for reference only.
- The catalog evolves with the product — always rely on `describe({})` for the current function list rather than memorizing it.
