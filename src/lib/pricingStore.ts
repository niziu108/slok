import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'pricing.json');

export type PricingMap = Record<string, string>;

// KV keys (wspólne dla projektu)
const KV_KEY = 'slok:pricing';

function hasKV() {
  // Na Twoim screenie z Vercela jest REDIS_URL — to jest OK i wystarcza
  return !!process.env.REDIS_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_URL;
}

async function readPricingFromFile(): Promise<PricingMap> {
  try {
    const buf = await fs.readFile(DATA_FILE, 'utf8');
    const obj = JSON.parse(buf);
    if (obj && typeof obj === 'object') return obj as PricingMap;
    return {};
  } catch {
    return {};
  }
}

async function writePricingToFile(map: PricingMap): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(map, null, 2), 'utf8');
}

export async function readPricing(): Promise<PricingMap> {
  // Produkcja (Vercel) -> Redis/KV
  if (hasKV()) {
    const v = (await kv.get<PricingMap>(KV_KEY)) ?? {};
    return v && typeof v === 'object' ? v : {};
  }

  // Lokalnie -> plik
  return readPricingFromFile();
}

export async function writePricing(map: PricingMap): Promise<void> {
  // Produkcja (Vercel) -> Redis/KV
  if (hasKV()) {
    await kv.set(KV_KEY, map);
    return;
  }

  // Lokalnie -> plik
  await writePricingToFile(map);
}