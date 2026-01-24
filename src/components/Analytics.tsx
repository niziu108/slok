'use client';

import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;
const ACCEPT_KEY = 'cookie-accepted-v2';

function loadGA() {
  if ((window as any).__ga_loaded) return;
  (window as any).__ga_loaded = true;

  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true,
  });
}

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    // jeśli zgoda była już wcześniej
    if (localStorage.getItem(ACCEPT_KEY) === 'true') {
      loadGA();
    }

    // nasłuch na kliknięcie "Akceptuję"
    const handler = () => {
      if (localStorage.getItem(ACCEPT_KEY) === 'true') {
        loadGA();
      }
    };

    window.addEventListener('cookie-accepted', handler);
    return () => window.removeEventListener('cookie-accepted', handler);
  }, []);

  return null;
}