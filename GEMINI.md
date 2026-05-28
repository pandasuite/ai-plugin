# PandaSuite Studio (MCP)

PandaSuite Studio is a no-code platform for interactive apps. This MCP gives a **read-only** view of a Studio project.

Use this flow (each is a separate `pandasuite` MCP tool call):

1. Connect the `pandasuite` MCP (OAuth on first use).
2. `listPublications({})` → take a folder id from `publications[].folders[].id` (skip if you already know the `folder_id`).
3. `openProject({ folder_id })` → required before any catalog call.
4. `describe({})` → manual of the `codemode.*` functions available inside `execute`. Read before writing `execute` code.
5. `execute({ code })` → run JavaScript calling `codemode.*` and `return` a result.

Read-only. Write JavaScript (not TypeScript) inside `execute`.
