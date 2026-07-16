import 'server-only';

import DETAILS from '@/data/parcels-details.json';
import { readPricing } from '@/lib/pricingStore';
import { readSold } from '@/lib/soldStore';
import { readStage2 } from '@/lib/stage2Store';
import {
  parsePrice,
  OSRODEK_IDS,
  przeznaczenieZCzesci,
  powierzchniaLesna,
  type ParcelStatus,
} from '@/lib/parcelFormat';

type Czesc = { nazwa: string; m2: number };

type RawDetail = {
  id: string;
  numery: string[];
  powierzchnia: number;
  czesci: Czesc[];
  wymiary: string[];
  sumaOk: boolean;
  uwaga: string | null;
};

const RAW = DETAILS as RawDetail[];
const BY_ID = new Map(RAW.map((d) => [d.id, d]));

/** Pełny obiekt działki, złożony z trzech źródeł:
 *  - metraż/wymiary/części z kart (src/data/parcels-details.json),
 *  - cena z Redisa (/api/pricing),
 *  - status sprzedane/etap2 z Redisa (/api/sold, /api/stage2).
 *  Pole `uwaga` z danych NIE jest tu przenoszone: to notatki do wewnętrznej
 *  weryfikacji (dom do remontu, przepompownia itd.), nie treść publiczna. */
export type Parcel = {
  id: string;
  numery: string[];
  powierzchnia: number;
  powierzchniaLesna: number | null;
  wymiary: string[];
  przeznaczenie: string;
  status: ParcelStatus;
  cena: number | null;
  zlM2: number | null;
  obraz: string;
};

function statusOf(id: string, sold: Set<string>, stage2: Set<string>): ParcelStatus {
  if (OSRODEK_IDS.has(id)) return 'osrodek';
  if (sold.has(id)) return 'sprzedana';
  if (stage2.has(id)) return 'etap2';
  return 'dostepna';
}

function build(d: RawDetail, pricing: Record<string, string>, sold: Set<string>, stage2: Set<string>): Parcel {
  const cena = parsePrice(pricing[d.id]);
  return {
    id: d.id,
    numery: d.numery,
    powierzchnia: d.powierzchnia,
    powierzchniaLesna: powierzchniaLesna(d.czesci),
    wymiary: d.wymiary,
    przeznaczenie: przeznaczenieZCzesci(d.czesci),
    status: statusOf(d.id, sold, stage2),
    cena,
    zlM2: cena && d.powierzchnia ? Math.round(cena / d.powierzchnia) : null,
    obraz: `/${d.id}.webp`,
  };
}

/** Lista ID wszystkich działek, które mają stronę (kolejność jak w danych). */
export function allParcelIds(): string[] {
  return RAW.map((d) => d.id);
}

export async function getParcel(id: string): Promise<Parcel | null> {
  const d = BY_ID.get(id);
  if (!d) return null;
  const [pricing, sold, stage2] = await Promise.all([readPricing(), readSold(), readStage2()]);
  return build(d, pricing, new Set(sold), new Set(stage2));
}

export async function getAllParcels(): Promise<Parcel[]> {
  const [pricing, sold, stage2] = await Promise.all([readPricing(), readSold(), readStage2()]);
  const s = new Set(sold);
  const t = new Set(stage2);
  return RAW.map((d) => build(d, pricing, s, t));
}
