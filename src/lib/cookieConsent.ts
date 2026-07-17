/** Zgoda na cookies analityczne.
 *
 *  RODO wymaga, żeby odmowa była tak samo łatwa jak zgoda i żeby zgodę dało się
 *  wycofać w każdej chwili. Wcześniej był tylko przycisk „Akceptuję" i krzyżyk,
 *  który nic nie rozstrzygał (pytał ponownie w kolejnej sesji), więc nie było
 *  ani realnej odmowy, ani sposobu na wycofanie zgody.
 *
 *  Moduł jest klientowy: localStorage nie istnieje na serwerze. */

const KEY = 'cookie-consent-v3';
const LEGACY_ACCEPT = 'cookie-accepted-v2';
const LEGACY_DISMISS = 'cookie-dismissed-session-v2';

export type Consent = 'granted' | 'denied';

/** Zwraca decyzję użytkownika albo null, gdy jeszcze jej nie podjął. */
export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'granted' || v === 'denied') return v;

    // Migracja: kto zaakceptował w starej wersji, nie jest pytany drugi raz.
    if (localStorage.getItem(LEGACY_ACCEPT) === 'true') {
      localStorage.setItem(KEY, 'granted');
      return 'granted';
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* tryb prywatny może blokować zapis */
  }
}

/** Wycofanie zgody: kasuje decyzję i ciasteczka analityczne. */
export function revokeConsent() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_ACCEPT);
    sessionStorage.removeItem(LEGACY_DISMISS);
  } catch {
    /* ignorujemy */
  }

  if (typeof document === 'undefined') return;

  // Ciasteczka GA (_ga, _ga_XXX, _gid). Kasujemy na bieżącej i nadrzędnej domenie.
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0]?.trim();
    if (!name) return;
    if (!/^_ga/.test(name) && name !== '_gid') return;
    const host = window.location.hostname;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`;
  });
}
