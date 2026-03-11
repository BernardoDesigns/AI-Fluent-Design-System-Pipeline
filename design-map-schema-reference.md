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
  "description": "Primary action color"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `figmaVariableId` | string | Figma's internal variable ID. Used for write operations. |
| `figmaName` | string | Variable name as it appears in Figma |
| `resolvedType` | string | `"COLOR"`, `"FLOAT"`, `"STRING"`, or `"BOOLEAN"` |
| `codeToken` | string | CSS custom property name |
| `tailwindKey` | string | Tailwind config key |
| `values` | object | Resolved values per mode |
| `unit` | string? | For FLOAT types: `"px"`, `"rem"`, `"%"` etc |
| `aliasOf` | string? | If this aliases another token, the source token's figmaName |
| `description` | string | What this token is for |

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

**Reading (Figma to Code):** Calls `figma_get_variables` via MCP, looks up the matching variable in the map, reads `codeToken` and `tailwindKey`, generates CSS/Tailwind output.

**Writing (Code to Figma):** Detects a code change, looks up the `figmaVariableId` in the map, calls `figma_update_variable` via MCP to push the new value.

**Drift Detection:** Compares current Figma values against stored `values` in the map. Flags mismatches.

---

## Populating This File

The placeholder IDs need to be replaced with real data from your Figma file:

1. Install Figma Console MCP and connect to your Obra kit
2. Run `figma_get_variables` with your file URL
3. Copy real collection IDs, mode IDs, and variable IDs into this file
4. Map each Figma variable name to its code equivalent
5. For components, use `figma_get_component` to pull keys and node IDs

One-time setup. After that, Claude Code maintains the file during sync operations.

---

*This file lives in the repo root alongside package.json and tailwind.config.ts.*
