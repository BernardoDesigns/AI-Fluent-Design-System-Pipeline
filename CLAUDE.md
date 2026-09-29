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
