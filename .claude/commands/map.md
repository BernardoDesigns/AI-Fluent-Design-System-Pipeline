---
description: Shows a summary of everything currently mapped in design-map.json. Token counts, components, last sync info.
allowed-tools: Read
---

# Design Map Summary

Read `design-map.json` from the repo root and provide a concise summary:

1. **Collections**: List each collection name, the number of tokens in it, and the mode names (e.g., "Colors: 6 tokens, modes: light/dark")
2. **Components**: List each mapped component, its sync status, and its code path
3. **Last sync**: Show the most recent syncLog entry (timestamp, direction, what changed)
4. **Font config**: If fontConfig exists, list the mapped fonts and their current values

Keep it brief. This is a quick reference, not a deep dive.
