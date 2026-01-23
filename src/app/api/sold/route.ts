export const runtime = 'nodejs'; // potrzebne, żeby mieć dostęp do plików na serwerze

import { NextRequest, NextResponse } from 'next/server';
import { readSold, writeSold } from '@/lib/soldStore';
import { isAuthedViaCookies } from '@/lib/auth';

export async function GET() {
  const ids = await readSold();
  return NextResponse.json({ ids });
}

export async function POST(req: NextRequest) {
  if (!isAuthedViaCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const addList: string[] = Array.isArray(body?.ids) ? body.ids : body?.id ? [body.id] : [];
  if (!addList.length) return NextResponse.json({ error: 'No ids' }, { status: 400 });

  const current = new Set(await readSold());
  addList.forEach((id) => current.add(String(id).trim()));
  const next = [...current].filter(Boolean).sort();

  await writeSold(next);
  return NextResponse.json({ ok: true, ids: next });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthedViaCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (body?.all) {
    await writeSold([]);
    return NextResponse.json({ ok: true, ids: [] });
  }

  const delList: string[] = Array.isArray(body?.ids) ? body.ids : body?.id ? [body.id] : [];
  if (!delList.length) return NextResponse.json({ error: 'No ids' }, { status: 400 });

  const set = new Set(await readSold());
  delList.forEach((id) => set.delete(String(id).trim()));
  const next = [...set].sort();

  await writeSold(next);
  return NextResponse.json({ ok: true, ids: next });
}
