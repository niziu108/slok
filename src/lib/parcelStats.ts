import 'server-only';

import PARCELS from '@/data/parcels.json';
import { readPricing } from '@/lib/pricingStore';
import { readSold } from '@/lib/soldStore';
import { readStage2 } from '@/lib/stage2Store';
import { parsePrice, OSRODEK_IDS, type HeroStats } from '@/lib/parcelFormat';

/** Jedyne źródło prawdy o tym, które działki istnieją: ID wyciągnięte z mapy SVG.
 *  W Redisie zostają wpisy cen po działkach, których nie ma już na mapie
 *  (2138-7, 2138-26, 2138-73, 2138-82), i bez tego filtra trafiałyby do statystyk
 *  jako realna oferta, zaniżając "cenę od" do 11 280 zł. */
export const ALL_PARCELS: string[] = PARCELS as string[];

export type { HeroStats };

/** Liczy stan oferty po stronie serwera, żeby liczby trafiły do HTML (SEO/GEO),
 *  a nie dociągały się dopiero w przeglądarce jak na mapie. */
export async function getHeroStats(): Promise<HeroStats | null> {
  try {
    const [pricing, sold, stage2] = await Promise.all([
      readPricing(),
      readSold(),
      readStage2(),
    ]);

    const soldSet = new Set(sold);
    const stage2Set = new Set(stage2);

    const dostepne = ALL_PARCELS.filter(
      (id) => !soldSet.has(id) && !stage2Set.has(id) && !OSRODEK_IDS.has(id)
    );

    // BEZPIECZNIK. Gdy zabraknie REDIS_URL, store po cichu czyta lokalny
    // data/pricing.json, w którym leżą stawki zł/m² i kilka starych cen. Bez tej
    // kontroli strona opublikowałaby wtedy fałszywe ceny nieruchomości.
    // Realna baza pokrywa ~78% działek, awaryjny plik ~4%.
    const pokrycie = ALL_PARCELS.filter((id) => parsePrice(pricing[id]) !== null).length;
    if (pokrycie / ALL_PARCELS.length < 0.5) return null;

    const ceny = dostepne
      .map((id) => parsePrice(pricing[id]))
      .filter((n): n is number => n !== null);

    // Bez danych wolę nie pokazać nic niż pokazać liczbę wziętą z sufitu.
    if (!dostepne.length || !ceny.length) return null;

    return {
      dostepne: dostepne.length,
      sprzedane: ALL_PARCELS.filter((id) => soldSet.has(id)).length,
      wszystkie: ALL_PARCELS.length,
      cenaOd: Math.min(...ceny),
    };
  } catch {
    return null;
  }
}
