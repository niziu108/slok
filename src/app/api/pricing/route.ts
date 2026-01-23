export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { readPricing, writePricing, PricingMap } from '@/lib/pricingStore';
import { isAuthedViaCookies } from '@/lib/auth';

/** GET /api/pricing */
export async function GET() {
  const pricing = await readPricing();
  return NextResponse.json({ pricing });
}

/** POST /api/pricing
 *  Body:
 *   - { pricing: { "2138-103": "235 000 zł", ... } }
 *   - { key: "2138-103", value: "235 000 zł" }
 */
export async function POST(req: NextRequest) {
  if (!isAuthedViaCookies()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const current = await readPricing();

  if (body?.pricing && typeof body.pricing === 'object') {
    const incoming = body.pricing as PricingMap;
    await writePricing(incoming);
    return NextResponse.json({ ok: true, pricing: incoming });
  }

  if (typeof body?.key === 'string' && typeof body?.value === 'string') {
    const next = { ...current, [body.key]: body.value };
    await writePricing(next);
    return NextResponse.json({ ok: true, pricing: next });
  }

  return NextResponse.json({ error: 'Bad body' }, { status: 400 });
}
