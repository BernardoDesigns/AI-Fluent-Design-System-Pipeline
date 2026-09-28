---
description: Full Figma-to-code token sync over the native Figma MCP. Matches on variable ID, diffs alias bindings, surfaces new variables. Creates branch, commits and pushes.
allowed-tools: Bash(git:*), Read, Write, Edit, Glob, Grep, Skill, mcp__plugin_figma_figma__use_figma
---

# Design System Sync (native MCP)

Direction is **Figma → code only**. Every `use_figma` call in this command is READ-ONLY against the live file: no `setValueForMode`, no `create*`, no property assignment. If a script would mutate anything, don't run it.

Load the `figma:figma-use` skill before the first `use_figma` call.

## Pre-flight

1. **File guard.** Run one read-only `use_figma` call with `fileKey: "oodzXY4lwyWIu5qK05VTP7"` that returns `figma.fileKey`.
   - It must equal `oodzXY4lwyWIu5qK05VTP7` (live Bernardo Designs System) AND match `meta.figmaFileKey` in design-map.json.
   - If it returns `73hToYOQf1TRgE3sRDq6f0` (scratch copy), anything else, or null: **STOP** and tell me which key came back. Do not sync.
   - Don't use `figma.root.name` as the check. It returns `"Document"`, not the file title.
   - If the tool is unavailable or the call errors: STOP and tell me to reconnect the Figma MCP (`/mcp`). No fallback to the Desktop Bridge.

2. Make sure we are on the `main` branch with a clean working tree. If there are uncommitted changes, stop and ask me what to do.

## Read Figma

For each collection in `design-map.json → collections`, read the live collection by its `figmaCollectionId`. Return for **every** variable in the collection (not only mapped ones):

- `id`, `name`, `resolvedType`
- for each mode ID in the map's `modes[*].figmaModeId`: the **raw stored value** from `valuesByMode`, not a resolved value
  - if it's `VARIABLE_ALIAS`: record the direct target `{ id, name }`, then walk the chain one hop at a time (using each target collection's `defaultModeId`) until a raw value, recording every hop as `{ id, name }` and the terminal value
  - if it's a color: hex, uppercase, `#RRGGBB` or `#RRGGBBAA` when alpha < 1

Reference script (split into one call per collection if the output gets large):

```js
const COL_ID = "<figmaCollectionId>";
const MODE_IDS = ["<figmaModeId>", "..."];
const hex = c => '#' + [c.r, c.g, c.b].concat(c.a !== undefined && c.a < 1 ? [c.a] : [])
  .map(n => Math.round(n * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const norm = v => (v && typeof v === 'object' && 'r' in v) ? hex(v) : v;
// KNOWN LIMITATION: walk() follows each hop via the target collection's defaultModeId.
// Correct for single-mode target collections (raw colors, brand colors, alpha), which is
// every chain today. If a semantic token ever aliases per-mode to another MULTI-mode
// token (the shape a Parent > Child semantic layer would introduce), the dark-mode chain
// would be walked through the target's default (light) mode and report the wrong hops and
// terminal value. Not fixed yet; if a chain hop lands in a multi-mode collection, flag it
// in the summary instead of trusting the terminal value.
const walk = async alias => {
  const chain = []; let cur = alias;
  while (cur && cur.type === 'VARIABLE_ALIAS' && chain.length < 10) {
    const t = await figma.variables.getVariableByIdAsync(cur.id);
    if (!t) { chain.push({ id: cur.id, name: null, unresolved: true }); return { chain, terminal: null }; }
    const tc = await figma.variables.getVariableCollectionByIdAsync(t.variableCollectionId);
    chain.push({ id: t.id, name: t.name });
    cur = t.valuesByMode[tc.defaultModeId];
  }
  return { chain, terminal: norm(cur) };
};
const col = await figma.variables.getVariableCollectionByIdAsync(COL_ID);
const out = [];
for (const vid of col.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(vid);
  const modes = {};
  for (const m of MODE_IDS) {
    const raw = v.valuesByMode[m];
    modes[m] = (raw && raw.type === 'VARIABLE_ALIAS') ? { alias: true, ...(await walk(raw)) } : { alias: false, value: norm(raw) };
  }
  out.push({ id: v.id, name: v.name, type: v.resolvedType, modes });
}
return { fileKey: figma.fileKey, collection: col.name, count: out.length, variables: out };
```

Check `fileKey` in every response is still `oodzXY4lwyWIu5qK05VTP7`. If not, STOP.

If any read comes back truncated or over the output limit, re-read that collection alone in a compact form, then cross-check counts, IDs, values, names and alias targets against the first read before applying anything. Never apply a partial read.

## Match

**Join key is `figmaVariableId`. Never match by name.** Names are labels. Map keys are stable slugs owned by the map (`general/primary-foreground`) and deliberately don't follow Figma names (`general/primary foreground`), so name matching would produce false adds/deletes.

For each Figma variable, find the map token with the same `figmaVariableId` in that collection:

- **Matched** → diff it (below).
- **In Figma, not in map** → NEW (see "New variables").
- **In map, not in Figma** → MISSING. Do not delete the map entry or its CSS. Flag it in the summary for me to decide.

## Diff (per matched token, per mode)

Compare against the map in this order:

1. **Name.** `figmaName` stores the full Figma path (`general/primary foreground`, not `primary foreground`). If the full Figma `name` ≠ `figmaName`: update `figmaName` only.
   - **Never rename the map key.** Keys are stable slugs; the ID is the join key, so the key never needs to follow Figma. This keeps Figma's spaces and commas out of the map.
   - **Never change `codeToken` or `tailwindKey`** because of a Figma rename. If the new name looks like it implies a code-name change, flag it in the summary under Renames and leave it.
   - Don't compare Figma `name` to the map key. They're expected to differ.
2. **Binding.** Compare the direct alias target ID per mode against `aliasTargets.<mode>.id` in the map.
   - alias → different alias = binding change
   - alias → raw value, or raw → alias = binding change
   - If the map has no `aliasTargets` yet (first native run), backfill it silently and don't report it as a change. Use the legacy `aliasOf` name only as a sanity check.
3. **Value.** Compare the chain's terminal value (or the raw value) against `values.<mode>`.

A binding can change while the hex stays the same, and the hex can change while the binding stays the same (the target's value moved). Report both independently.

### Map schema for aliases

Keep the existing `aliasOf` field untouched in shape (string, name of the light-mode direct target, or null) for backward compatibility, and update it when the light-mode target changes. Add or refresh `aliasTargets`, per mode, with the full chain (never flattened):

```json
"aliasTargets": {
  "light": { "id": "VariableID:1699:8", "name": "brand-neutrals/500",
             "chain": [ { "id": "VariableID:1699:8", "name": "brand-neutrals/500" },
                        { "id": "VariableID:6:106",  "name": "neutral/500" } ] },
  "dark":  { "id": "VariableID:1699:3", "name": "brand-neutrals/50",
             "chain": [ { "id": "VariableID:1699:3", "name": "brand-neutrals/50" },
                        { "id": "VariableID:6:101",  "name": "neutral/50" } ] }
}
```

Mode keys (`light`, `dark`) come from the map's `modes` object, mapped via `figmaModeId`. For a mode holding a raw value, set that mode to `null`.

In code (CSS), keep emitting the resolved value as today. The chain lives in the map, not in CSS.

## New variables

For every variable in a mapped collection that has no map entry:

- **Add a draft map entry** under that collection, keyed by a proposed slug that follows the sibling keys' convention (lowercase, spaces → hyphens, same prefix pattern the collection already uses, e.g. `spacing/…`, `radius/…`), with its real `figmaVariableId` (new variables get fresh IDs like `VariableID:6003:*`; never guess or derive one from the name), `figmaName`, `resolvedType`, `values`, `aliasOf`, `aliasTargets`, and `"status": "new-unreviewed"`.
- Leave `codeToken` and `tailwindKey` as `null`, and do **not** write it into any CSS or code file.
- List it in the summary under NEW, with the proposed key, so I decide whether to ship it and can change the key before it does.

Names containing `test/` or `obra-shadcn-docs/`: still add a draft entry, but mark them `"status": "ignored-candidate"` in the summary.

Scope stays at the collections already in the map. Don't read or add other collections this run.

## Sync

Switch to a new branch named `design-system-update/token-sync-{today's date and time as YYYY-MM-DD-HHmm}`.

Apply the changes:

- design-map.json: `figmaName` updates, `values`, `aliasOf`, `aliasTargets`, draft NEW entries, `lastSynced` (ISO timestamp), `lastSyncDirection: "figma-to-code"`, and append a `syncLog` entry (`timestamp`, `direction`, `action: "native-sync"`, `tokensChanged`, `componentsChanged`, `notes` including binding changes, NEW and MISSING counts).
- Code files: only for matched tokens whose resolved value changed.
- For any font-family changes, read the `fontConfig.fonts` section and follow every `syncTarget` for each changed font.

If nothing changed (no value, binding, `figmaName`, NEW or MISSING), don't create a commit. Delete the branch, switch back to main, and tell me it's in sync.

Commit all changes to this branch and push to origin.

## Post-sync

After pushing, give me a short summary with these sections (omit empty ones):

- **Value changes:** `name (mode): old hex > new hex`
- **Binding changes:** `name (mode): old target > new target` with IDs, e.g. `general/primary (light): amber/700 (VariableID:534:30373) > brand-shades/600 (VariableID:1699:20)`. Note if the resolved hex is unchanged.
- **Figma renames:** `map key (VariableID): old figmaName > new figmaName`. Mark any where `codeToken`/`tailwindKey` might need a human rename.
- **NEW (not shipped, needs my call):** name, ID, collection, values
- **MISSING from Figma:** map key, ID
- **Files modified**
- The branch name and a reminder to run `./sync.sh` to restart local servers
