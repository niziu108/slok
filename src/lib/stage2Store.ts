import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'stage2.json');

// KV keys
const KV_KEY = 'slok:stage2';

function hasKV() {
  // jeśli masz tylko REDIS_URL i @vercel/kv by nie działał u Ciebie,
  // to damy wersję na node-redis. Na razie trzymamy spójnie z soldStore.
  return !!process.env.REDIS_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_URL;
}

async function readFromFile(): Promise<string[]> {
  try {
    const buf = await fs.readFile(DATA_FILE, 'utf8');
    const arr = JSON.parse(buf);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeToFile(ids: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(ids, null, 2), 'utf8');
}

export async function readStage2(): Promise<string[]> {
  if (hasKV()) {
    const v = (await kv.get<string[]>(KV_KEY)) ?? [];
    return Array.isArray(v) ? v : [];
  }
  return readFromFile();
}

export async function writeStage2(ids: string[]): Promise<void> {
  const clean = (ids || []).map((x) => String(x).trim()).filter(Boolean);

  if (hasKV()) {
    await kv.set(KV_KEY, clean);
    return;
  }

  await writeToFile(clean);
}