---
description: Quick pre-flight check. Verifies the native Figma MCP connection and live-file guard, and repo state.
allowed-tools: Bash(git:*), Skill, mcp__plugin_figma_figma__use_figma
---

# Pipeline Status Check

Run these checks in order and report results as a simple pass/fail table:

1. **Figma connection**: Load the `figma:figma-use` skill, then run one READ-ONLY `use_figma` call (`plugin:figma:figma`) with `fileKey: "oodzXY4lwyWIu5qK05VTP7"` that returns `figma.fileKey`. Pass = it returns `oodzXY4lwyWIu5qK05VTP7` and matches `meta.figmaFileKey` in design-map.json. Anything else (including the scratch key `73hToYOQf1TRgE3sRDq6f0`) = fail. No writes.
2. **Git branch**: Run `git branch --show-current`. Report current branch name.
3. **Working tree**: Run `git status --short`. Pass = clean (no uncommitted changes). If dirty, list the changed files.
4. **Node modules**: Check that `node_modules/` exists in the repo root. Pass = directory exists.
5. **design-map.json**: Check that `design-map.json` exists in the repo root. Pass = file exists.

If the Figma connection check fails: if the tool is missing or errors, tell me to reconnect the Figma MCP with `/mcp` (server `plugin:figma:figma`); if it returned the wrong file key, tell me which key came back. Then re-run `/project:status`.

If everything passes, say "All clear, ready to sync."
