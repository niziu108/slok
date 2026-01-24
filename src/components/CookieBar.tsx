'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadGA } from '@/components/Analytics';

const LS_ACCEPT_KEY = 'cookie-accepted-v2';
const SS_DISMISS_KEY = 'cookie-dismissed-session-v2';

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(LS_ACCEPT_KEY) === 'true';
    const dismissed = sessionStorage.getItem(SS_DISMISS_KEY) === 'true';

    if (!accepted && !dismissed) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(LS_ACCEPT_KEY, 'true');
    sessionStorage.setItem(SS_DISMISS_KEY, 'true'); // 🔑 ważne
    setVisible(false);
    loadGA();
  };

  const closeForSession = () => {
    sessionStorage.setItem(SS_DISMISS_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-[#131313] text-[#fbfaf5] border-t border-[#fbfaf5]/20">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 py-3 flex items-center gap-4">
        <p className="flex-1 text-[12px] sm:text-[13px] leading-snug">
          Ta strona korzysta z plików cookie w celu poprawy działania i analizy ruchu. Więcej w&nbsp;
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            Polityce prywatności
          </Link>.
        </p>

        <button
          onClick={accept}
          className="h-8 px-3 rounded-md text-[12px] font-medium bg-[#fbfaf5] text-[#131313]"
        >
          Akceptuję
        </button>

        <button
          onClick={closeForSession}
          aria-label="Zamknij"
          className="h-8 w-8 text-[20px]"
        >
          ×
        </button>
      </div>
    </div>
  );
}