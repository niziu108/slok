/** Czyste funkcje i typy, bez dostępu do dysku/Redisa.
 *  Osobny plik, żeby komponenty klienckie mogły to importować bez wciągania
 *  `fs` z pricingStore/soldStore do bundla przeglądarki. */

export type HeroStats = {
  dostepne: number;
  sprzedane: number;
  wszystkie: number;
  cenaOd: number | null;
};

/** "Cena: 133 020 zł brutto" -> 133020. Zwraca null, gdy nie da się odczytać. */
export function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null;
  const m = String(raw).match(/([\d\s ]+)\s*z/);
  if (!m) return null;
  const n = Number(m[1].replace(/[\s ]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const formatPLN = (n: number) => n.toLocaleString('pl-PL') + ' zł';

/** Odmiana: 1 działka dostępna / 3 działki dostępne / 29 działek dostępnych */
export function dostepneLabel(n: number) {
  if (n === 1) return '1 działka dostępna';
  const last = n % 10;
  const twoLast = n % 100;
  const maleForm = last >= 2 && last <= 4 && !(twoLast >= 12 && twoLast <= 14);
  return maleForm ? `${n} działki dostępne` : `${n} działek dostępnych`;
}

/** Działki tworzące ośrodek wypoczynkowy (sprzedawane jako całość, nie pojedynczo). */
export const OSRODEK_IDS = new Set([
  '2138-1', '2138-2', '2138-3', '2138-4', '2138-5',
  '2138-6', '2138-8', '2138-9', '2138-10', '2138-11',
]);

/** "1347 m²" po polsku, z separatorem tysięcy. */
export const formatM2 = (n: number) => n.toLocaleString('pl-PL') + ' m²';

export type ParcelStatus = 'dostepna' | 'sprzedana' | 'etap2' | 'osrodek';

export const STATUS_LABEL: Record<ParcelStatus, string> = {
  dostepna: 'Dostępna',
  sprzedana: 'Sprzedana',
  etap2: 'II etap (od 08.2027)',
  osrodek: 'Ośrodek wypoczynkowy',
};

type Czesc = { nazwa: string; m2: number };

/** Główne przeznaczenie działki: pierwsza część, która nie jest lasem.
 *  Karty dzielą powierzchnię na budowlaną/usługową i „przynależną leśną",
 *  a przeznaczenie bierzemy z tej pierwszej. */
export function przeznaczenieZCzesci(czesci: Czesc[]): string {
  const glowna = czesci.find((c) => !/leśn|lesn/i.test(c.nazwa));
  return (glowna ?? czesci[0]).nazwa;
}

/** Powierzchnia gruntu budowlanego/usługowego (bez części leśnej),
 *  albo null gdy działka jest jednorodna. */
export function powierzchniaLesna(czesci: Czesc[]): number | null {
  const les = czesci.find((c) => /leśn|lesn/i.test(c.nazwa));
  return les ? les.m2 : null;
}
