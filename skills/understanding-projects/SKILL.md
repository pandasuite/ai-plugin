---
name: understanding-projects
description: Use when exploring, describing, or explaining a PandaSuite project to a user — its screens, navigation, persistent layers (masters/foreground/background), components, and interactivity. Translates the MCP's technical type names into the names users see in Studio and keeps explanations jargon-free for non-developers (no-coders).
---

# Understanding a PandaSuite project

The people you talk to live in **PandaSuite's Studio** — they think in _screens, elements, interactions_, not data types or tool names. Speak in those concepts, and narrate your steps the same way: _"I'm looking at how your home screen is built"_, not the tool calls and ids behind it.

## Resolve names live — never invent them

A unit's technical `type` (`button`, `list`, `html`, …) is **not** the name the user sees. Resolve it from the live catalog: `getManifest(type)` gives the Studio label (in the user's language) and a plain description; `listComponents()` scans what exists. The catalog evolves — don't carry a private list in your head.

**Ids that actively mislead — always resolve, never trust the id:**

- `button` → a **Multi-state**, not a button (cycles user-defined layers — toggles, tabs, selectors)
- `list` → a **layout box** (Flexbox), not a data list
- `collection` → the *real* data list (repeats a template per data row)
- `module` → a **downloadable sub-project**, not code
- `html` → embedded **Web** content
- `video` vs `videoplayer` → fullscreen video vs. inline player

## The mental model (not in the catalog — keep it in mind)

- **Screens** (one per `ViewFolder`). **Only one shows at a time**; the app navigates between them. Start any explanation here.
- **Foreground** (*Avant-plan*) and **Background** (*Arrière-plan*) — optional layers in front of / behind a screen's content (a header that stays put, a backdrop). Many screens have neither. Internally "masters" (`masterFront`/`masterBack`); the user only ever hears "Foreground" / "Background".
- **The project level** — the `rootUnit`, holding what's shared everywhere: dimensions, device, colors, languages, fonts.
- **Interactivity & data** — behavior reads as *when [something happens], do [something]*; a **binding** is a value pulled live from elsewhere (it updates on its own).

## Rich behavior is composed

Effects emerge from simple pieces combined, not from big widgets — this is your lens for reading a project. Seeing a **Synchronization**, a **Multi-state**, or a **Collection**, ask what user-facing effect they add up to. E.g. **parallax** = two **Scrolling Areas** linked by a **Synchronization**; **tabs** = one **Multi-state**. For "how do I build X", search the docs/showcase (docs-how-to skill) rather than guessing.

## Never show the user

The raw layer is for *your* reasoning, not the user's eyes — read it freely, translate when you speak.

Pure plumbing — translate or omit: `statestack`, `TMWorld`, `rootunit`, `worldId`, `did`, `masterFront`/`masterBack` (say "Foreground"/"Background"), and the raw `type` ids (`button`, `list`, …).

**Binding & action expressions** (`[data:…]`, `…/@getByIndex`, `[eval:…]`) — never paste the raw string; say what the binding *does*, in the source/field names the user sees, resolved from the project + `searchDocs` (e.g. a collection exposes **Current Item** / *Élément courant*). Don't reproduce the path or invent a separator notation.
