'use client';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const ACCEPT_KEY = 'cookie-accepted-v2';

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const accepted = typeof window !== 'undefined' && localStorage.getItem(ACCEPT_KEY) === 'true';
    if (!accepted) return; // nie ładuj GA bez zgody

    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.async = true;
    document.head.appendChild(s);

    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    function gtag(){ window.dataLayer.push(arguments); }
    // @ts-ignore
    gtag('js', new Date());
    // @ts-ignore
    gtag('config', GA_ID);
  }, []);

  return null;
}