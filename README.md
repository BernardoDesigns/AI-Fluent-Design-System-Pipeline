# AI-Fluent Design System Pipeline

**A Figma-to-code design token pipeline run by Claude Code.** A designer changes a variable in Figma, runs one command, and Claude Code reads the live file, diffs every token against a mapping layer, opens a branch, updates the code, and pushes it for review. No hand-copied hex values, no drift between design and production.

[Live demo](https://ai-design-system-poc.vercel.app) · [Case study](https://www.bellwetherdesigns.io/projects/design-system-poc) · Built by [Bernardo Garcia](https://www.bellwetherdesigns.io)

---

## Why this exists

Design systems drift. Figma says the primary color is orange, the codebase still says blue, and nobody notices until a launch review. The usual fix is a person copying values between tools, which is slow and error prone.

This project tests a different idea: give an AI agent a precise map between Figma and code, a strict set of rules, and a narrow job. The agent does the translation. The designer stays in Figma and approves the result.

## How it works

```
Figma (live file)
   │  native Figma MCP, read-only
   ▼
Claude Code  ──reads──▶  design-map.json  (the "Rosetta Stone")
   │
   │  match by variable ID → diff names, alias bindings, values
   ▼
New git branch → updated CSS tokens + map → commit → push → PR → Vercel deploy
```

1. **Pre-flight.** A file-key guard confirms Claude is connected to the live design system file (and not a scratch copy). If the check fails, the sync stops.
2. **Read.** Claude reads every variable in each mapped collection, including the full alias chain (e.g. `primary → brand/500 → orange/600`), not just the resolved value.
3. **Match.** Tokens are joined on Figma's `figmaVariableId`, never on name. Renaming a variable in Figma never creates false adds or deletes.
4. **Diff.** Each token is checked three ways, independently: name change, alias binding change, and value change. A binding can move while the hex stays the same, and the summary reports both.
5. **Guardrails.** New Figma variables become draft map entries marked `new-unreviewed` and never reach CSS until a human approves them. Variables missing from Figma are flagged, never deleted.
6. **Ship.** If anything changed, Claude creates a `design-system-update/token-sync-<timestamp>` branch, updates the code and the map, commits, and pushes. If nothing changed, it says so and touches nothing.

## What's in the map today

| Collection | Tokens | Modes |
|---|---|---|
| Semantic colors | 54 | light, dark |
| Typography | 58 | default |
| Spacing | 27 | default |
| Border radii | 10 | default |

That's 149 variables plus mapped `button` and `card` components, with 21 logged syncs in `design-map.json → syncLog`.

## Slash commands

Project-scoped Claude Code commands live in `.claude/commands/`, so anyone who clones the repo gets them.

| Command | What it does |
|---|---|
| `/project:status` | Pre-flight check: Figma connection, file guard, git state, dependencies |
| `/project:sync` | Full Figma → code sync over the native Figma MCP |
| `/project:map` | Quick summary of everything in `design-map.json` |
| `/project:demo-prep` | Checklist that verifies every piece is ready for a live demo |
| `/project:reset` | Emergency reset to a clean `main` with caches cleared |
| `/project:sync-legacy` | Retired. Kept for reference only |

## Key files

| File | Purpose |
|---|---|
| `design-map.json` | The mapping layer between Figma variables and CSS tokens, Tailwind keys and components |
| `design-map-schema-reference.md` | Full schema documentation for the map |
| `FINDINGS.md` | Issues the pipeline surfaced in the source Figma file (see below) |
| `CLAUDE.md` | Project instructions Claude Code reads at the start of every session |
| `src/styles/` | Generated token CSS (colors, typography, spacing, radius) |
| `src/components/ui/` | shadcn/ui components that consume the tokens |
| `src/stories/` | Storybook stories for every component |
| `sync.sh` | Restarts the local dev server with a clean build cache |

## What the pipeline found

Reading every variable and every alias chain turned out to be a useful design audit on its own. `FINDINGS.md` documents eight issues in the source Figma file that a visual review missed, including:

- Popover surface and foreground colors swapped between light and dark mode
- Small shadow tokens pointing at fully transparent black, so they rendered nothing
- A "serif" font token that actually held a sans-serif value
- Chart and focus colors hard-coded as hex instead of aliasing the color ramps

## Design decisions worth noting

- **IDs over names.** Names are labels that people change. IDs are stable. Map keys are slugs owned by the map and never follow Figma renames.
- **Read-only by default.** The sync never writes to Figma. Direction today is Figma → code. The map schema is built to support code → Figma later.
- **Humans approve anything new.** New tokens are drafted, not shipped.
- **Migrated mid-project.** The pipeline started on a WebSocket "Desktop Bridge" plugin and moved to the native Figma MCP in September 2026, which made it possible to match on IDs and diff alias bindings. The retired command stays in the repo as a record.
- **Known limitation.** Alias chains are walked through each target collection's default mode. That's correct for every chain in this file today, but a future multi-mode semantic layer would need per-mode walking. The sync flags that case instead of trusting the result.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix · Storybook 10 · Claude Code · Figma MCP · Vercel

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run storybook    # http://localhost:6006
```

The sync itself needs Claude Code with the Figma MCP connected and access to the source Figma file, so it's a demo of the approach more than a drop-in tool.

## License

MIT
