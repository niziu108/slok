'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const ACCEPT_KEY = 'cookie-accepted-v2';

export default function Analytics() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const accepted =
      typeof window !== 'undefined' &&
      localStorage.getItem(ACCEPT_KEY) === 'true';

    if (accepted) setCanLoad(true);
  }, []);

  if (!canLoad || !GA_ID || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}