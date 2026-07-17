'use client';

import { useEffect } from 'react';

import { readConsent } from '@/lib/cookieConsent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __ga_loaded__?: boolean;
  }
}

export function loadGA() {
  if (!GA_ID) return;
  if (typeof window === 'undefined') return;

  // Tylko po wyraźnej zgodzie. Odmowa albo brak decyzji = nie ładujemy GA.
  if (readConsent() !== 'granted') return;

  // nie ładuj drugi raz
  if (window.__ga_loaded__) return;
  window.__ga_loaded__ = true;

  // dataLayer + gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer!.push(arguments);
    };

  // skrypt gtag
  const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`);
  if (!existing) {
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.async = true;
    document.head.appendChild(s);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    // page_path: window.location.pathname, // opcjonalnie
  });
}

/** Wysyła zdarzenie do GA4.
 *  Cicho nic nie robi, gdy nie ma zgody na cookies (wtedy gtag nie istnieje)
 *  albo gdy GA nie jest skonfigurowane. To celowe: bez zgody nie mierzymy. */
export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params ?? {});
}

export default function Analytics() {
  useEffect(() => {
    // przy wejściu na stronę (jeśli ktoś już wcześniej zaakceptował)
    loadGA();
  }, []);

  return null;
}