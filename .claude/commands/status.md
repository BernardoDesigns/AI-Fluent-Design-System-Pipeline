---
description: Quick pre-flight check. Verifies Figma MCP connection, Desktop Bridge status, and repo state.
allowed-tools: Bash(git:*)
---

# Pipeline Status Check

Run these checks in order and report results as a simple pass/fail table:

1. **Figma connection**: Run `Check Figma status`. Pass = WebSocket Bridge active with a file name listed.
2. **Git branch**: Run `git branch --show-current`. Report current branch name.
3. **Working tree**: Run `git status --short`. Pass = clean (no uncommitted changes). If dirty, list the changed files.
4. **Node modules**: Check that `node_modules/` exists in the repo root. Pass = directory exists.
5. **design-map.json**: Check that `design-map.json` exists in the repo root. Pass = file exists.

If the Figma connection check fails, tell me to restart the Desktop Bridge plugin: **Plugins > Development > Figma Desktop Bridge** in Figma Desktop, then re-run `/project:status`.

If everything passes, say "All clear, ready to sync."
