'use client';

import { useEffect, useState } from 'react';

type PageLoaderProps = {
  logoSrc?: string;   // np. "/logo-mobile.png"
  bg?: string;        // np. "#131313"
  minShowMs?: number; // np. 2000
  fadeMs?: number;    // np. 300
  maxTotalMs?: number; // opcjonalnie: twardy timeout gdyby "load" nie przyszedł
};

export default function PageLoader({
  logoSrc = '/logo-mobile.png',
  bg = '#131313',
  minShowMs = 2000,
  fadeMs = 300,
  maxTotalMs,
}: PageLoaderProps) {
  const [supportsMask, setSupportsMask] = useState<boolean | null>(null);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const ok =
        (window as any).CSS?.supports?.('mask-image', `url("${logoSrc}")`) ||
        (window as any).CSS?.supports?.('-webkit-mask-image', `url("${logoSrc}")`) ||
        false;
      setSupportsMask(!!ok);
    } catch {
      setSupportsMask(false);
    }

    const tMin = setTimeout(() => setMinTimeDone(true), minShowMs);

    const markLoaded = () => setPageLoaded(true);
    if (document.readyState === 'complete') {
      markLoaded();
    } else {
      window.addEventListener('load', markLoaded, { once: true });
    }

    // preload logo
    const img = new Image();
    img.src = logoSrc;

    // opcjonalny "bezpiecznik" — jakby event load nie przyszedł
    const tMax =
      typeof maxTotalMs === 'number'
        ? setTimeout(() => setPageLoaded(true), maxTotalMs)
        : null;

    return () => {
      clearTimeout(tMin);
      if (tMax) clearTimeout(tMax);
      window.removeEventListener('load', markLoaded);
    };
  }, [logoSrc, minShowMs, maxTotalMs]);

  useEffect(() => {
    if (minTimeDone && pageLoaded) {
      setHidden(true);
      const t = setTimeout(() => {
        const el = document.getElementById('page-loader-root');
        if (el) el.style.display = 'none';
      }, fadeMs);
      return () => clearTimeout(t);
    }
  }, [minTimeDone, pageLoaded, fadeMs]);

  const readyToShowLogo = supportsMask !== null;

  return (
    <div
      id="page-loader-root"
      className={`fixed inset-0 z-[9999] grid place-items-center transition-opacity duration-300 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: bg,
        transitionDuration: `${fadeMs}ms`,
      }}
    >
      {readyToShowLogo ? (
        supportsMask ? (
          <div
            aria-hidden="true"
            className="animate-breathe will-change-transform"
            style={{
              width: 300,
              height: 300,
              backgroundColor: '#D9D9D9',
              WebkitMaskImage: `url("${logoSrc}")`,
              maskImage: `url("${logoSrc}")`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        ) : (
          <img
            src={logoSrc}
            alt="Logo"
            width={300}
            height={300}
            className="animate-breathe select-none"
            draggable={false}
            style={{
              filter:
                'brightness(0) invert(91%) sepia(5%) saturate(12%) hue-rotate(180deg)',
            }}
          />
        )
      ) : null}

      <style jsx global>{`
        @keyframes breathe {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-breathe {
          animation: breathe 1.6s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}