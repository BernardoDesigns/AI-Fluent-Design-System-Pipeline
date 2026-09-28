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

---

## Figma Desktop Bridge teardown (one-time, per machine)

**Not part of the normal reset.** Only run this section when I ask for bridge teardown or a new-machine check. The Figma Console MCP / Desktop Bridge was retired 2026-09-28; all Figma access now goes through the native MCP (`plugin:figma:figma`).

### Pass 1: check (read-only, run all, report a pass/fail table)

| # | Item | Check | Pass |
|---|---|---|---|
| 1 | Port 9223 | `lsof -nP -iTCP:9223 -sTCP:LISTEN` | No output |
| 2 | MCP registration | `claude mcp list` | No `figma-console` server |
| 3 | MCP config files | `grep -l figma-console ~/.claude.json .mcp.json ~/Library/Application\ Support/Claude/claude_desktop_config.json 2>/dev/null` | No output |
| 4 | Local data dir | `ls -d ~/.figma-console-mcp 2>/dev/null` | No output |
| 5 | Env vars (live shell) | `env \| grep -iE 'FIGMA_(ACCESS\|PERSONAL\|API)_?TOKEN\|FIGMA_CONSOLE\|FIGMA_WS'` | No output |
| 6 | Env vars (profiles) | `grep -nE 'FIGMA_(ACCESS\|PERSONAL\|API)_?TOKEN\|figma-console\|9223' ~/.zshrc ~/.zprofile ~/.zshenv ~/.bash_profile ~/.dev-aliases.sh 2>/dev/null` | No output |
| 7 | Global package | `npm ls -g --depth=0 2>/dev/null \| grep -i figma-console` | No output |
| 8 | Permissions | `grep -n figma-console .claude/settings.local.json ~/.claude/settings.json 2>/dev/null` | No output |
| 9 | Figma plugin | Ask me: Figma Desktop > Plugins > Development > Manage plugins in development | "Figma Desktop Bridge" not listed |
| 10 | Figma PAT | Ask me: figma.com > Settings > Security > Personal access tokens | Token created for figma-console-mcp is revoked |
| 11 | Native MCP | Run `/project:status` | Figma connection passes (file-key guard returns `oodzXY4lwyWIu5qK05VTP7`) |

If every row passes: "Bridge teardown verified. Native MCP only." Stop there.

### Pass 2: remove (only for failed rows, confirm each with me first)

1. **Port 9223**: identify the PID from row 1 and confirm it's the figma-console process before `kill <pid>`.
2. **MCP registration**: `claude mcp remove figma-console -s user`, then `-s local` and `-s project` if still listed. Remove any `figma-console` entry from `.mcp.json` or the Claude Desktop config by hand.
3. **Local data dir**: `rm -rf ~/.figma-console-mcp`
4. **Env vars**: delete the matching `export` lines from the profile files in row 6 (show me each line first), then open a new shell. Don't print token values.
5. **Global package**: `npm uninstall -g figma-console-mcp` (use the exact package name row 7 found).
6. **Permissions**: remove `mcp__figma-console__*` entries from the settings files in row 8.
7. **Figma plugin** (me, in Figma Desktop): Plugins > Development > Manage plugins in development > remove "Figma Desktop Bridge".
8. **Figma PAT** (me, on figma.com): revoke the token. Revoking is what kills it; deleting the env var alone doesn't.

Then re-run Pass 1. Every row must pass.
