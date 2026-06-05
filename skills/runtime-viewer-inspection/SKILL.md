---
name: runtime-viewer-inspection
description: Use when you need to see what a published PandaSuite viewer actually does as it runs — after a tap, a navigation, a timer, or a binding or condition firing — not just how it's configured in Studio.
---

# Inspecting a published viewer at runtime

The Studio MCP tells you what a project is **configured** to do; the published **viewer** is the only place to see what it *actually does* once screens render, timers run, and gestures fire. This skill is for that gap — observed runtime behavior. It complements project inspection (getting-started, understanding-projects skills); it never replaces it.

## Start in Studio, confirm in the viewer

Read the project first — `openProject`, `describe`, `execute` (getting-started skill) answer "what's configured" faster and more reliably than any runtime probe. Open the viewer only when the question is about what *happens*: navigation, show/hide, timers, gestures, conditions, variables, local data, bindings — behavior you can't read off the configuration with confidence.

Given a publication short id, open it with the debug flag:

```text
https://viewer.pandasuite.com/{shortId}?debug
```

`?debug` makes the viewer narrate itself to the console — that trace is what you read cause and effect from.

## Probe one thing at a time

Drive the viewer with your environment's browser-control tool (its name varies by client). The discipline matters more than the tool: capture the state, perform **one** action, capture the delta. A single tap measured against a clean before/after is worth more than ten chained actions you can't untangle. Read the console trace, the URL/screen, and the network in that window — then report the chain in the user's words ("New Game opens Level 1 and seeds the local datastore"), not raw event ids.

## Reading the debug trace

Read for cause and effect, in Studio terms:

- navigation between **screens**, and show/hide of **Foreground**/**Background**, popups, overlays
- taps, clicks, gestures
- **variable** and **datastore** creation or update
- **binding** and **condition** evaluation
- media playback, and loading or network failures (missing assets, API errors)

Skip the noise — pointer resolution, layout reflow, repeated low-level traces — unless the user is asking about exactly that.

## Guardrails

- Stay on PandaSuite runtime domains (`viewer.pandasuite.com`, `data.pandasuite.com`, and the API/assets that viewer pulls) unless the user sends you elsewhere.
- Never surface tokens, auth headers, cookies, or full signed asset URLs.
- Keep the action budget tight; when a flow needs many steps, say what you verified and what's still uncertain.
- Logs alone don't prove a project is misconfigured — cross-check against Studio before you say so.
- Internal ids help you diagnose, but translate them to Studio concepts before answering (understanding-projects skill).
