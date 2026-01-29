export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const FILES: Record<string, { filename: string; downloadName: string }> = {
  mpzp: { filename: 'mpzp-slok.pdf', downloadName: 'MPZP-SLOK.pdf' },
  mapa: { filename: 'mapa-slok-mpzp.pdf', downloadName: 'MAPA-SLOK-MPZP.pdf' },
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const entry = FILES[slug];
  if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const filePath = path.join(process.cwd(), 'public', entry.filename);

  try {
    const buf = await readFile(filePath);

    return new Response(buf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(buf.byteLength),
        'X-Content-Type-Options': 'nosniff',
        // ✅ wymuszamy pobieranie
        'Content-Disposition': `attachment; filename="${entry.downloadName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File missing on server' }, { status: 404 });
  }
}