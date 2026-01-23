import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'sold.json');

// KV keys (wspólne dla projektu)
const KV_KEY = 'slok:sold';

function hasKV() {
  return !!process.env.REDIS_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_URL;
}

async function readSoldFromFile(): Promise<string[]> {
  try {
    const buf = await fs.readFile(DATA_FILE, 'utf8');
    const arr = JSON.parse(buf);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeSoldToFile(ids: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(ids, null, 2), 'utf8');
}

export async function readSold(): Promise<string[]> {
  // Produkcja (Vercel) -> Redis/KV
  if (hasKV()) {
    const v = (await kv.get<string[]>(KV_KEY)) ?? [];
    return Array.isArray(v) ? v : [];
  }

  // Lokalnie -> plik
  return readSoldFromFile();
}

export async function writeSold(ids: string[]): Promise<void> {
  const clean = (ids || [])
    .map((x) => String(x).trim())
    .filter(Boolean);

  // Produkcja (Vercel) -> Redis/KV
  if (hasKV()) {
    await kv.set(KV_KEY, clean);
    return;
  }

  // Lokalnie -> plik
  await writeSoldToFile(clean);
}