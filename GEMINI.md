# PandaSuite Studio (MCP)

PandaSuite Studio is a no-code platform for interactive apps. This MCP gives a **read-only** view of a Studio project.

Use this flow (each is a separate `pandasuite` MCP tool call):

1. Connect the `pandasuite` MCP (OAuth on first use).
2. `listPublications({})` → take a folder id from `publications[].folders[].id` (an id from a Studio dashboard link is a publication id, not a folder id — pass it as `query` to find the project).
3. `openProject({ folder_id })` → required before any catalog call.
4. `describe({})` → manual of the `codemode.*` functions available inside `execute`. Read before writing `execute` code.
5. `execute({ code })` → run JavaScript calling `codemode.*` and `return` a result.

Read-only. Write JavaScript (not TypeScript) inside `execute`.
