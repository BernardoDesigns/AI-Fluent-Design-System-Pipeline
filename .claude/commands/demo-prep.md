---
description: Pre-demo checklist. Verifies every piece of the pipeline is ready for a live demonstration.
allowed-tools: Bash(git:*), Bash(npm:*), Bash(lsof:*), Read
---

# Demo Prep Checklist

Run through every item and report pass/fail. Stop on the first failure and tell me how to fix it.

## Connections
1. **Figma connection**: Run `Check Figma status`. Must show WebSocket Bridge active.
2. **Git status**: Must be on `main` with a clean working tree.
3. **Remote sync**: `git pull origin main` should show "Already up to date" or pull cleanly.

## Local servers
4. **Next.js running**: Check if port 3000 is in use (`lsof -i:3000`). If not running, tell me to start it with `./sync.sh` in a separate terminal tab.
5. **Storybook running**: Check if port 6006 is in use (`lsof -i:6006`). If not running, tell me to start it with `npm run storybook` in a separate terminal tab.

## Files
6. **design-map.json**: Exists and is valid JSON.
7. **globals.css**: Exists at `src/app/globals.css`.
8. **preview-head.html**: Exists at `.storybook/preview-head.html`.

## Approval prompts
9. Remind me: "Have you pre-approved Claude Code permission prompts by running a test sync? If not, do a dry run first so you're not clicking 'Yes, and don't ask again' during the live demo."

If all checks pass: "Demo ready. Break a leg."
