---
description: Emergency reset. Discards uncommitted changes, returns to main, and clears caches.
allowed-tools: Bash(git:*), Bash(rm:*), Bash(./sync.sh:*)
---

# Pipeline Reset

**Use this when things go sideways. Discards all uncommitted work and returns to a clean state on main.**

1. Discard all uncommitted changes: `git checkout -- .`
2. Remove any untracked files: `git clean -fd`
3. Switch to main: `git checkout main`
4. Pull latest: `git pull origin main`
5. Prune deleted remote branches: `git fetch --prune`
6. Clear Next.js cache: `rm -rf .next`
7. Clear Storybook cache: `rm -rf node_modules/.cache/storybook`

After completing all steps, say: "Reset complete. You're on main with a clean slate. Run `./sync.sh` to restart the dev server."
