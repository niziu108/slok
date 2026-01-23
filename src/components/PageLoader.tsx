'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [supportsMask, setSupportsMask] = useState<boolean | null>(null);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const ok =
        (window as any).CSS?.supports?.('mask-image', 'url("/logo-mobile.png")') ||
        (window as any).CSS?.supports?.('-webkit-mask-image', 'url("/logo-mobile.png")') ||
        false;
      setSupportsMask(!!ok);
    } catch {
      setSupportsMask(false);
    }

    const t = setTimeout(() => setMinTimeDone(true), 2000);

    const markLoaded = () => setPageLoaded(true);
    if (document.readyState === 'complete') {
      markLoaded();
    } else {
      window.addEventListener('load', markLoaded, { once: true });
    }

    const img = new Image();
    img.src = '/logo-mobile.png';

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', markLoaded);
    };
  }, []);

  useEffect(() => {
    if (minTimeDone && pageLoaded) {
      setHidden(true);
      const t = setTimeout(() => {
        const el = document.getElementById('page-loader-root');
        if (el) el.style.display = 'none';
      }, 300);
      return () => clearTimeout(t);
    }
  }, [minTimeDone, pageLoaded]);

  const readyToShowLogo = supportsMask !== null;

  return (
    <div
      id="page-loader-root"
      className={`fixed inset-0 z-[9999] grid place-items-center bg-[#131313] transition-opacity duration-300 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
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
              WebkitMaskImage: 'url("/logo-mobile.png")',
              maskImage: 'url("/logo-mobile.png")',
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
            src="/logo-mobile.png"
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
