export const runtime = 'edge';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const expected = process.env.SITE_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    return new Response(JSON.stringify({ ok: false, error: 'server misconfigured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (password !== expected) {
    await new Promise(r => setTimeout(r, 200));
    return new Response(JSON.stringify({ ok: false }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const signature = await signHmac(String(expiresAt), secret);
  const token = `${expiresAt}.${signature}`;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `pm_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

async function signHmac(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}
