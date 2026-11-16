# design-system-poc

A Next.js 16 design system proof of concept. Built with App Router, Tailwind v4, shadcn/ui, and Storybook. Deployed to Vercel via GitHub integration.

## Deploying

This project deploys via Vercel git integration. To ship changes:

1. `git add .`
2. `git commit -m "descriptive message"`
3. `git push origin main`

Vercel auto-deploys from the push. Never use `vercel deploy` or `vercel --prod` from the CLI. There's no local `.vercel/` link and we don't want one.

## File map

```
public/assets/logo.png     ← B mark
src/app/                   ← Next.js App Router pages
src/components/            ← shadcn/ui components
src/stories/               ← Storybook stories
```

## Storybook MCP (component source of truth)

Storybook runs an MCP server named `dspoc-storybook` at `http://localhost:6006/mcp` (start it with `npm run storybook`). The component list it serves is generated from the code, so it reflects what exists today.

- Before building or changing any UI, check the system first: call `docs-list`, then `docs-show` for each component you plan to use.
- Never guess props, variants or sizes. Use only what the docs or story examples show. If something isn't documented, ask before inventing it.
- Reach for an existing component before writing a new one. Story names don't always match prop names, so confirm props through the docs.
- Get current story-writing guidance from `get-storybook-story-instructions` before writing stories.
- Use `stories-preview` so a human can look at the rendered result.
- End every prototype with a short list of which system components you used and anything you had to invent.
- The `Example/*` stories are Storybook's starter files, not part of the design system. They're excluded from the manifest; don't build with them.
