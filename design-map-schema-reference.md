# design-map.json Schema Reference

> The Rosetta Stone between Figma and code.
> Version 1.0.0 | Bernardo Designs Pipeline

---

## What is this file?

The `design-map.json` is the middleware layer that sits between your Figma design system and your codebase. It's the single source of truth for how every token, variable, and component in Figma maps to its code equivalent.

Think of it like a bilingual dictionary. Figma speaks one language (variable IDs, collection names, mode IDs). Your codebase speaks another (CSS custom properties, Tailwind keys, React props). This file translates between them.

Claude Code reads this file to know exactly how to translate in both directions:

- **Figma to Code:** Extract a Figma variable, look up its `codeToken` and `tailwindKey`, generate the right CSS/React output.
- **Code to Figma:** Read a code change, look up the corresponding `figmaVariableId`, push the update back to Figma via MCP Console.

Without this file, Claude Code is guessing. With it, Claude Code is translating.

---

## Top-Level Structure

```
{
  "$schema": "design-map-v1",
  "version": "1.0.0",
  "lastSynced": "ISO-8601",
  "lastSyncDirection": "...",

  "meta": { ... },
  "collections": { ... },
  "components": { ... },
  "syncLog": [ ... ]
}
```

| Field | Purpose |
|-------|---------|
| `$schema` | Schema version identifier |
| `version` | Your map version (bump on changes) |
| `lastSynced` | When the last sync happened |
| `lastSyncDirection` | `"figma-to-code"` or `"code-to-figma"` |

---

## Section: meta

Project-level configuration. Tells Claude Code what it's working with.

| Field | Type | Description |
|-------|------|-------------|
| `projectName` | string | Human readable project name |
| `figmaFileKey` | string | The key from your Figma file URL (after `/design/`) |
| `figmaFileName` | string | The Figma file name for reference |
| `repository` | string | Git repo URL |
| `codeFramework` | string | `"react"`, `"vue"`, `"svelte"` etc |
| `uiLibrary` | string | `"shadcn-ui"`, `"radix"`, `"chakra"` etc |
| `cssStrategy` | string | `"tailwind"`, `"css-modules"`, `"styled-components"` etc |
| `storybook` | boolean | Whether to generate Storybook stories |

---

## Section: collections

Each collection corresponds to a Figma Variable Collection (Colors, Spacing, Radius, etc).

### Collection structure

```
"colors": {
  "figmaCollectionId": "VariableCollectionId:1:23",
  "figmaCollectionName": "Colors",
  "modes": {
    "light": { "figmaModeId": "1:0", "cssSelector": ":root" },
    "dark": { "figmaModeId": "1:1", "cssSelector": ".dark" }
  },
  "tokens": { ... }
}
```

The `modes` object maps your mode names to Figma mode IDs and CSS selectors. This is what lets the pipeline handle light/dark themes.

### Token structure

```
"colors/primary": {
  "figmaVariableId": "VariableID:2:110",
  "figmaName": "colors/primary",
  "resolvedType": "COLOR",
  "codeToken": "--primary",
  "tailwindKey": "primary",
  "values": { "light": "#171717", "dark": "#FAFAFA" },
  "aliasOf": null,
  "aliasTargets": { "light": null, "dark": null },
  "description": "Primary action color"
}
```

The token key (`"colors/primary"` above) is a stable slug owned by the map. It does not follow Figma renames. `figmaVariableId` is the join key; `figmaName` tracks the current Figma name.

| Field | Type | Description |
|-------|------|-------------|
| `figmaVariableId` | string | Figma's internal variable ID. The join key between Figma and the map: sync matches on this, never on name. Also used for write operations. |
| `figmaName` | string | Variable name as it appears in Figma. Updated on sync when Figma renames the variable. |
| `resolvedType` | string | `"COLOR"`, `"FLOAT"`, `"STRING"`, or `"BOOLEAN"` |
| `codeToken` | string | CSS custom property name |
| `tailwindKey` | string | Tailwind config key |
| `values` | object | Resolved values per mode |
| `unit` | string? | For FLOAT types: `"px"`, `"rem"`, `"%"` etc |
| `aliasOf` | string? | Legacy. Name of the direct alias target in the default (light) mode, or null. Name only, one mode only. Kept for backward compatibility; use `aliasTargets` for diffing. |
| `aliasTargets` | object? | Per-mode alias binding, keyed by the collection's mode names. See below. |
| `status` | string? | Only on draft entries added by sync for variables new in Figma: `"new-unreviewed"` or `"ignored-candidate"`. These have `codeToken`/`tailwindKey` null and aren't emitted to code until reviewed. Absent on shipped tokens. |
| `description` | string | What this token is for |

#### aliasTargets

Records what each mode is bound to, by ID, with the full chain. Never flattened.

```
"aliasTargets": {
  "light": {
    "id": "VariableID:1699:8",
    "name": "brand-neutrals/500",
    "chain": [
      { "id": "VariableID:1699:8", "name": "brand-neutrals/500" },
      { "id": "VariableID:6:106",  "name": "neutral/500" }
    ]
  },
  "dark": null
}
```

- `id` / `name`: the direct target (first hop).
- `chain`: every hop from the direct target to the variable holding the raw value, in order. The terminal value itself lives in `values`.
- A mode set to `null` holds a raw value, not an alias.
- Sync diffs bindings on `id`, independently of `values`. A binding can change while the hex stays the same, and vice versa.
- Chains are walked using each target collection's default mode. Correct when targets are single-mode (raw colors, brand colors, alpha); not reliable if a token aliases another multi-mode token.

---

## Section: components

Maps Figma components to code. This is DIY Code Connect for Figma Pro.

```
"button": {
  "figmaComponentKey": "abc123def456",
  "figmaNodeId": "16:1234",
  "figmaName": "Button",
  "codePath": "src/components/ui/button.tsx",
  "shadcnComponent": "Button",
  "storyPath": "src/components/ui/button.stories.tsx",
  "variants": { ... },
  "lastSynced": null,
  "status": "figma-only"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `figmaComponentKey` | string | Stable component key across file versions |
| `figmaNodeId` | string | Node ID in the current file |
| `codePath` | string | Relative path to the React component file |
| `shadcnComponent` | string | shadcn/ui component name |
| `storyPath` | string | Path to the Storybook story file |
| `variants` | object | Maps Figma properties to code props |
| `lastSynced` | ISO-8601? | Last sync time. Null if never synced. |
| `status` | string | `"synced"`, `"figma-only"`, `"code-only"`, `"drift"` |

---

## Section: syncLog

Running history of sync operations. Claude Code appends an entry on every sync.

```
{
  "timestamp": "2026-03-12T00:00:00Z",
  "direction": "figma-to-code",
  "action": "token-update",
  "tokensChanged": ["colors/primary"],
  "componentsChanged": [],
  "notes": "Updated primary palette"
}
```

Used for audit trail and drift detection.

---

## How Claude Code Uses This File

All Figma access goes through the native Figma MCP (`plugin:figma:figma`), using the `use_figma` tool (Plugin API scripts). Every call first checks `figma.fileKey` against `meta.figmaFileKey` and stops on any other key.

**Reading (Figma to Code):** `/sync` runs read-only `use_figma` scripts over each mapped collection (`getVariableCollectionByIdAsync`, `getVariableByIdAsync`), pairs each variable to its map entry by `figmaVariableId`, reads `codeToken` and `tailwindKey`, and generates CSS/Tailwind output. Alias bindings are read from the raw `valuesByMode` and stored in `aliasTargets`, not flattened.

**Writing (Code to Figma):** Looks up the `figmaVariableId` in the map, then uses `use_figma` to call `setValueForMode` on that variable (raw values, or `figma.variables.createVariableAlias(target)` for aliases) and reads the value back to verify it. No command does this yet; `/sync` is Figma → code only. Test writes against the scratch copy first.

**Drift Detection:** Compares current Figma values against stored `values`, and current alias target IDs against `aliasTargets`, per mode. Flags value and binding changes separately.

---

## Populating This File

The placeholder IDs need to be replaced with real data from your Figma file:

1. Connect the native Figma MCP in Claude Code (`/mcp`, server `plugin:figma:figma`)
2. Run a read-only `use_figma` script against your file key: `getLocalVariableCollectionsAsync()` for collection and mode IDs, then `getVariableByIdAsync()` per variable for IDs, full names, raw `valuesByMode` and alias targets
3. Copy real collection IDs, mode IDs, and variable IDs into this file
4. Map each Figma variable to its code equivalent (`codeToken`, `tailwindKey`). Keys are stable slugs; `figmaName` is the full Figma path
5. For components, use `get_metadata` or a read-only `use_figma` script to pull component keys and node IDs

One-time setup. After that, Claude Code maintains the file during sync operations.

---

*This file lives in the repo root alongside package.json and tailwind.config.ts.*
