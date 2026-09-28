---
description: RETIRED 2026-09-28. Legacy Desktop Bridge sync. Use /sync (native Figma MCP) instead.
allowed-tools: Bash(git:*), Read, Write, Glob, Grep
---

> **RETIRED 2026-09-28. Do not run.** This command depends on the Figma Console MCP Desktop Bridge (WebSocket, port 9223), which has been torn down, and it matched tokens by name instead of `figmaVariableId`. Replaced by `/sync` (native `plugin:figma:figma` MCP, file-key guard, ID matching, alias-binding diff). Kept for reference only.

# Design System Sync (legacy)

## Pre-flight

1. Verify Figma connection: run `Check Figma status`. If it does NOT show "WebSocket Bridge (active)", **stop and tell me to restart the Desktop Bridge plugin in Figma** (Plugins > Development > Figma Desktop Bridge). Do not proceed with a sync if the connection check fails.

2. Make sure we are on the `main` branch with a clean working tree. If there are uncommitted changes, stop and ask me what to do.

## Sync

Switch to a new branch named `design-system-update/token-sync-{today's date and time as YYYY-MM-DD-HHmm}`.

Then sync all token changes from Figma using design-map.json. For any font-family changes, read the fontConfig.fonts section and follow every syncTarget for each changed font.

Commit all changes to this branch and push to origin.

## Post-sync

After pushing, give me a short summary of:
- Which tokens changed (name + old value > new value)
- Which files were modified
- The branch name and a reminder to run `./sync.sh` to restart local servers
