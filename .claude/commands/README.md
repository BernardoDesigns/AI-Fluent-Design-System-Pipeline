# Pipeline Slash Commands

Custom Claude Code commands for the design-to-production pipeline.
Type `/project:commandname` in Claude Code to run any of these.

| Command | What it does |
|---------|-------------|
| `/project:status` | Pre-flight check. Verifies Figma connection, git state, dependencies. Run this first. |
| `/project:sync` | Full sync. Creates branch, syncs all tokens from Figma, commits and pushes. |
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
- All commands check Figma connection first and will tell you to restart the Desktop Bridge if it's down.
- These are project-scoped commands (committed to the repo). Team members get them automatically on clone.
