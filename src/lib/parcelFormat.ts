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
