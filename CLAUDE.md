# design-system-poc

A Next.js 16 design system proof of concept. Built with App Router, Tailwind v4, shadcn/ui, and Storybook. Deployed to Vercel via GitHub integration.

## Deploying

This project deploys via Vercel git integration. To ship changes:

1. `git add .`
2. `git commit -m "descriptive message"`
3. `git push origin main`

Vercel auto-deploys from the push. Never use `vercel deploy` or `vercel --prod` from the CLI. There's no local `.vercel/` link and we don't want one.

## Auth gate

This project is password-gated using a cookie-based auth pattern. Four files implement it:

- `src/middleware.ts` — checks session cookie, redirects unauthenticated visitors to `/unlock.html`
- `src/app/api/auth/route.ts` — validates password, sets signed HttpOnly cookie (Edge runtime)
- `public/unlock.html` — branded password page (self-contained, no `styles.css` dep)
- `public/assets/logo.png` — the B mark

Same pattern as the experiments in sibling project `musical-octo-carnival`, but with Next.js-specific adaptations.

### CRITICAL: Next.js middleware MUST use NextRequest/NextResponse

Non-obvious and cost an hour to discover. In `src/middleware.ts`, the function signature MUST use Next.js types from `next/server`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  // ...
  return NextResponse.next(); // not `return undefined`
}
```

Using plain Web standard `Request` and `Response` causes `MIDDLEWARE_INVOCATION_FAILED` at runtime, even though TypeScript will let it complie.

For redirects, use `NextResponse.redirect(url)` not `new Response(null, { status: 302, headers: { Location: url } })`. Same reason.

This rule is specific to Next.js middleware. The api route at `src/app/api/auth/route.ts` is allowed to use plain Web standards because regular API routes are not bound by the middleware runtime constraints.

### Edge runtime on the auth route

`src/app/api/auth/route.ts` declares Edge runtime via:

```typescript
export const runtime = 'edge';
```

Do not remove this line. The function uses Web Crypto (`crypto.subtle`) for HMAC signing which works in Edge but not in Vercel's default Node runtime for Next.js routes.

Note the syntax: `export const runtime = 'edge';` (App Router convention). NOT `export const config = { runtime: 'edge' };` (vanilla Vercel api convention used in the sibling monorepo). Both projects use Edge but the export shape differs by framework.

### Matcher pattern

The middleware matcher exempts `/api`, `/unlock`, `_next/static`, `_next/image`, and common static file extensions. Uses non-capturing groups `(?:css|js|...)` because Vercel's matcher parser rejects capturing groups `(css|js|...)` with a "Capturing groups are not allowed" build error.

### Env vars (set in Vercel dashboard, not in code)

Production scope:
- `SITE_PASSWORD` — the password visitors type to get past the gate
- `SESSION_SECRET` — long random hex string (32+ chars) used to sign session cookies. Generate with `openssl rand -hex 32`.

After changing either env var, redeploy the project so functions pick up the new values.

## File map

```
src/middleware.ts          ← auth gate, Next.js middleware
src/app/api/auth/route.ts  ← auth endpoint, Edge runtime
public/unlock.html         ← branded password page
public/assets/logo.png     ← B mark
src/app/                   ← Next.js App Router pages
src/components/            ← shadcn/ui components
src/stories/               ← Storybook stories
```

## Related

Sibling project `musical-octo-carnival` uses the same auth gate concept on vanilla Vercel static sites. The pattern is the same but the file paths and Vercel runtime declaration syntax differ. If you need to apply this gate to a new project, decide first whether it's Next.js (use the conventions in this repo) or vanilla Vercel (use the conventions in musical-octo-carnival).
