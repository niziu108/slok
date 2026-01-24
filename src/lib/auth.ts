import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'slok_admin';

export function getCookieName() {
  return COOKIE_NAME;
}

// Token zawsze liczony z ENV (ADMIN_PASSWORD + AUTH_SECRET)
export function makeToken() {
  const secret = process.env.AUTH_SECRET || 'dev-secret';
  const password = process.env.ADMIN_PASSWORD || '';
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export async function isAuthedViaCookies(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE_NAME)?.value;
  const expected = makeToken();
  return Boolean(c && expected && c === expected);
}