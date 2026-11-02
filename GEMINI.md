# PandaSuite Studio (MCP)

PandaSuite Studio is a no-code platform for interactive apps. This MCP gives a **read-only** view of a Studio project.

Use this flow (each is a separate `pandasuite` MCP tool call):

1. Connect the `pandasuite` MCP (OAuth on first use).
2. `listPublications({})` → find the project (`query` matches a name, an id or a shortId).
3. `openProject({ id })` → `id` is a publication id, a project id (`publications[].folders[].id`) or a shortId, e.g. from a dashboard or Studio link; `device` picks the device. Required before any `project.*` call.
4. `describe({})` → manual of the `project.*` and `account.*` functions available inside `execute`. Read before writing `execute` code.
5. `execute({ code })` → run JavaScript calling `project.*` / `account.*` and `return` a result.

Read-only. Write JavaScript (not TypeScript) inside `execute`.
