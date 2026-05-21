export const config = {
  matcher: '/((?!api|unlock|_next/static|_next/image|.*\\.(?:css|js|png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot|json|map)$).*)',
};

export default async function middleware(request: Request): Promise<Response | undefined> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return redirectToUnlock(request);

  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)pm_session=([^;]+)/);
  if (!match) return redirectToUnlock(request);

  const [expiresAtStr, sig] = match[1].split('.');
  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || !sig || Date.now() > expiresAt) return redirectToUnlock(request);

  const valid = await verifyHmac(expiresAtStr, sig, secret);
  if (!valid) return redirectToUnlock(request);

  return undefined;
}

function redirectToUnlock(request: Request): Response {
  const url = new URL(request.url);
  const next = encodeURIComponent(url.pathname + url.search);
  return new Response(null, {
    status: 302,
    headers: { Location: `/unlock.html?next=${next}` },
  });
}

async function verifyHmac(payload: string, sigHex: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['verify']
  );
  const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)?.map(h => parseInt(h, 16)) || []);
  return crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(payload));
}
