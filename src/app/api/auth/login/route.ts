export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getCookieName, makeToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const raw = body?.password;
  const input = typeof raw === 'string' ? raw.trim() : '';

  const envPassRaw = process.env.ADMIN_PASSWORD ?? '';
  const envPass = envPassRaw.trim();

  // 🔎 LOGI DIAGNOSTYCZNE (tymczasowe, do konsoli serwera)
  console.log('[LOGIN] input.len=', input.length, ' env.len=', envPass.length);

  const ok = input.length > 0 && envPass.length > 0 && input === envPass;
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = makeToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dni
  });
  return res;
}