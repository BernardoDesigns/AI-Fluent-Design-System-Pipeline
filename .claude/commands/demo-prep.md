---
description: Pre-demo checklist. Verifies every piece of the pipeline is ready for a live demonstration.
allowed-tools: Bash(git:*), Bash(npm:*), Bash(lsof:*), Bash(ls:*), Read, Skill, mcp__plugin_figma_figma__use_figma, mcp__dspoc-storybook__docs-list
---

# Demo Prep Checklist

Launch order matters: start Next.js and Storybook in their own tabs first, then start Claude Code. MCP servers connect when the session starts, so a Storybook started afterward isn't visible until you reconnect with `/mcp`.

Run through every item and report pass/fail. Stop on the first failure and tell me how to fix it.

## Connections
1. **Figma connection**: Load the `figma:figma-use` skill, then run one READ-ONLY `use_figma` call (`plugin:figma:figma`) with `fileKey: "oodzXY4lwyWIu5qK05VTP7"` that returns `figma.fileKey`. Must return `oodzXY4lwyWIu5qK05VTP7`. If the tool is missing, tell me to reconnect with `/mcp`.
2. **Git status**: Must be on `main` with a clean working tree.
3. **Remote sync**: `git pull origin main` should show "Already up to date" or pull cleanly.

## Local servers
4. **Next.js running**: Check if port 3000 is in use (`lsof -i:3000`). If not running, tell me to start it with `./sync.sh` in a separate terminal tab.
5. **Storybook running**: Check if port 6006 is in use (`lsof -i:6006`). If not running, tell me to start it with `npm run storybook` in a separate terminal tab.
6. **Storybook MCP connected**: Call `docs-list` on the `dspoc-storybook` server. Pass = it returns one component for each file in `src/components/ui/` and no `Example/*` entries. If the tool is missing or the connection is refused, Storybook wasn't up when this session started: tell me to confirm check 5 passes, then reconnect `dspoc-storybook` with `/mcp` (or restart Claude Code) and re-run this checklist. If the counts don't match, list which components are missing from the manifest.

## Files
7. **design-map.json**: Exists and is valid JSON.
8. **globals.css**: Exists at `src/app/globals.css`.
9. **preview-head.html**: Exists at `.storybook/preview-head.html`.

## Approval prompts
10. Remind me: "Have you pre-approved Claude Code permission prompts by running a test sync? If not, do a dry run first so you're not clicking 'Yes, and don't ask again' during the live demo."

If all checks pass: "Demo ready. Break a leg."
