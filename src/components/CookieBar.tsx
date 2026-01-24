'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadGA } from '@/components/Analytics';

const LS_ACCEPT_KEY = 'cookie-accepted-v2';
const SS_DISMISS_KEY = 'cookie-dismissed-session-v2';

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const accepted = localStorage.getItem(LS_ACCEPT_KEY) === 'true';
      const dismissed = sessionStorage.getItem(SS_DISMISS_KEY) === 'true';

      if (!accepted && !dismissed) {
        setVisible(true);

        // auto-hide po 20 sekundach (bez zgody)
        const t = setTimeout(() => {
          try {
            sessionStorage.setItem(SS_DISMISS_KEY, 'true');
          } catch {}
          setVisible(false);
        }, 20_000);

        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(LS_ACCEPT_KEY, 'true');
    } catch {}

    setVisible(false);

    // 🔥 odpal GA po zgodzie
    loadGA();
  };

  const closeForSession = () => {
    try {
      sessionStorage.setItem(SS_DISMISS_KEY, 'true');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] bg-[#131313] text-[#fbfaf5] border-t border-[#fbfaf5]/20"
      role="dialog"
      aria-live="polite"
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6 py-2 flex items-center gap-3 sm:gap-4">
        <p className="flex-1 text-[12px] sm:text-[13px] leading-snug text-center sm:text-left">
          Ta strona korzysta z plików cookie w celu poprawy działania i analizy ruchu. Więcej w&nbsp;
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            Polityce prywatności
          </Link>.
        </p>

        <button
          onClick={accept}
          className="h-8 px-3 rounded-md text-[12px] font-medium bg-[#fbfaf5] text-[#131313] hover:opacity-90 transition"
        >
          Akceptuję
        </button>

        <button
          onClick={closeForSession}
          aria-label="Zamknij pasek cookies"
          title="Zamknij"
          className="h-8 w-8 grid place-items-center text-[20px] text-[#fbfaf5] hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}