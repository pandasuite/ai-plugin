---
name: runtime-viewer-inspection
description: Use when a published PandaSuite viewer behaves differently from what Studio says it should — a suspected bug, or a tap, navigation, timer, or binding that fires wrong or not at all — and reading the project (getting-started) hasn't explained why. It's the escalation after Studio, not a first look: how to build something, whether it's supported, or how a layout is designed stay in Studio and the docs (docs-how-to).
---

# Inspecting a published viewer at runtime

Studio tells you what a project is **configured** to do. The published **viewer** is the only place to see what it *actually does* once screens render, timers run, and gestures fire. This skill is for the gap between the two — and only that gap. Driving the live viewer is slow and costly: reach for it when the configuration can't explain what you're seeing, not before.

## Read Studio first — it usually answers

`openProject`, `describe`, `execute` (getting-started) tell you what's configured faster and more reliably than any runtime probe. Most questions end here: how something is built, whether a feature is supported, why a layout looks the way it does — that's Studio and the docs (docs-how-to), not the viewer.

Open the viewer only once Studio has run and still can't account for the behavior — the app diverges from its configuration, or a gesture, timer, binding, or condition misbehaves live in a way you can't read off the setup. If the config explains it, stop there.

## Find the viewer

The published viewer lives at `https://viewer.pandasuite.com/{shortId}`. Customers usually paste such a URL — open it directly. Otherwise get the `shortId` from `listPublications` (one per publication).

Add `?debug` to make the viewer narrate itself to the console:

```text
https://viewer.pandasuite.com/{shortId}?debug
```

`?debug` is INFO level — that trace is where you read cause and effect. Escalate to `?debug=5` (DEBUG) when INFO isn't fine-grained enough.

## Probe one thing at a time

Drive the viewer with your environment's browser-control tool (the name varies by client); the discipline matters more than the tool. Capture the state, perform **one** action, capture the delta. A single tap against a clean before/after is worth more than ten chained actions you can't untangle. Read the console, the screen/URL, and the network in that window — then report the chain in the user's words ("New Game opens Level 1 and seeds the local datastore"), never raw event ids.

## Read the trace in Studio terms

- navigation between **screens**; show/hide of **Foreground**/**Background**, popups, overlays
- taps, clicks, gestures
- **variable** and **datastore** creation or update
- **binding** and **condition** evaluation
- media playback; loading or network failures (missing assets, API errors)

Skip the noise — pointer resolution, layout reflow, repeated low-level traces — unless that's exactly what's being asked.

## Guardrails

- Stay on PandaSuite runtime domains (`viewer.pandasuite.com`, `data.pandasuite.com`, and the API/assets the viewer pulls) unless the user sends you elsewhere.
- Never surface tokens, auth headers, cookies, or full signed asset URLs.
- Keep the action budget tight; when a flow needs many steps, say what you verified and what's still uncertain.
- A trace alone doesn't prove misconfiguration — cross-check against Studio before you say so.
- Internal ids are for your diagnosis; translate them to Studio concepts before answering (understanding-projects).
