# Pipeline Slash Commands

Custom Claude Code commands for the design-to-production pipeline.
Type `/project:commandname` in Claude Code to run any of these.

| Command | What it does |
|---------|-------------|
| `/project:status` | Pre-flight check. Verifies Figma connection, git state, dependencies. Run this first. |
| `/project:sync` | Full sync over the native Figma MCP. Creates branch, syncs all tokens from Figma by variable ID, commits and pushes. |
| `/project:sync-legacy` | RETIRED. Old Desktop Bridge sync, kept for reference. Don't run. |
| `/project:reset` | Emergency reset. Returns to clean main, clears all caches. |
| `/project:map` | Quick summary of everything in design-map.json. |
| `/project:demo-prep` | Pre-demo checklist. Verifies every piece is ready for a live run. |

## Typical workflow

```
/project:status       # check everything is connected
/project:sync         # sync changes, creates branch: design-system-update/token-sync-2026-03-17-1430
```

## Notes

- The `sync` command uses "Switch to" as the opening verb intentionally. "Create" and "Build" trigger Claude Code built-in skills and cause problems.
- Figma access is the native Figma MCP (`plugin:figma:figma`, `use_figma` tool). Commands that touch Figma run a read-only file-key guard first (live file `oodzXY4lwyWIu5qK05VTP7`) and stop on any other key. If the tool is missing, reconnect with `/mcp`.
- The Figma Console MCP / Desktop Bridge is retired. See the teardown section in `reset.md`.
- These are project-scoped commands (committed to the repo). Team members get them automatically on clone.
