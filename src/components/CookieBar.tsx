'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadGA } from '@/components/Analytics';
import { readConsent, writeConsent } from '@/lib/cookieConsent';

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pytamy tylko, gdy użytkownik nie podjął jeszcze decyzji.
    if (readConsent() === null) setVisible(true);

    // Wycofanie zgody ze stopki: pokaż pasek ponownie bez przeładowania strony.
    const onRevoke = () => setVisible(true);
    window.addEventListener('slok:cookies-revoked', onRevoke);
    return () => window.removeEventListener('slok:cookies-revoked', onRevoke);
  }, []);

  const accept = () => {
    writeConsent('granted');
    setVisible(false);
    loadGA();
  };

  const reject = () => {
    writeConsent('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookie"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#fbfaf5]/20 bg-[#131313] text-[#fbfaf5]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <p className="flex-1 text-[12px] leading-snug sm:text-[13px]">
          Używamy plików cookie do analizy ruchu, aby wiedzieć, co poprawiać. To dobrowolne, strona
          działa tak samo bez nich. Więcej w{' '}
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            Polityce prywatności
          </Link>
          .
        </p>

        {/* Odmowa musi być tak samo łatwa jak zgoda: te same rozmiary i waga. */}
        <div className="flex shrink-0 gap-2">
          <button
            onClick={reject}
            className="h-9 flex-1 rounded-md border border-[#fbfaf5]/50 px-4 text-[12px] font-medium text-[#fbfaf5] transition hover:bg-[#fbfaf5]/10 sm:flex-none"
          >
            Odrzuć
          </button>
          <button
            onClick={accept}
            className="h-9 flex-1 rounded-md bg-[#fbfaf5] px-4 text-[12px] font-medium text-[#131313] transition hover:bg-white sm:flex-none"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
