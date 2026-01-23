// src/components/Galeria.tsx
'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 5 zdjęć (1600x1200)
const BASE = ['/galeria1.webp','/galeria2.webp','/galeria3.webp','/galeria4.webp','/galeria5.webp'];

// Potrójna sekwencja dla płynnej pętli (środkowa = „prawdziwa”)
const TRIPLE = [...BASE, ...BASE, ...BASE];

/** Wejście nagłówka od dołu (spójne z KONTAKT) */
const headlineRise = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Galeria() {
  const rowRef = useRef<HTMLDivElement>(null);

  // Stan gestu (touch/mouse)
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    startScroll: 0,
    startTime: 0,
    lastTime: 0,
    lockedAxis: null as null | 'x' | 'y',
  });

  // Metryki layoutu
  const getMetrics = useCallback(() => {
    const row = rowRef.current!;
    const card = row.querySelector<HTMLDivElement>('[data-card]')!;
    const style = getComputedStyle(row);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    const cardW = card.clientWidth;
    const step = cardW + gap;
    const centerOffset = (row.clientWidth - cardW) / 2;
    const n = BASE.length;
    const seqW = step * n;
    return { row, step, centerOffset, n, seqW };
  }, []);

  // Ustaw wycentrowanie slajdu o indeksie w TRIPLE
  const centerIndex = useCallback(
    (idxTriple: number, behavior: ScrollBehavior = 'instant') => {
      const { row, step, centerOffset } = getMetrics();
      row.scrollTo({ left: step * idxTriple - centerOffset, behavior });
    },
    [getMetrics]
  );

  // „Teleport” o pełną sekwencję, gdy wyjedziemy poza środek
  const teleportIfNeeded = useCallback(() => {
    const { row, step, centerOffset, n, seqW } = getMetrics();
    const approx = (row.scrollLeft + centerOffset) / step; // indeks TRIPLE (float)
    if (approx < n - 1) {
      row.scrollLeft += seqW;
    } else if (approx > 2 * n + 1) {
      row.scrollLeft -= seqW;
    }
  }, [getMetrics]);

  // Normalizacja do środkowej sekwencji
  const normalizeToMiddle = useCallback((idxTriple: number) => {
    const { n } = getMetrics();
    const within = ((idxTriple % n) + n) % n; // 0..n-1
    return n + within;                        // n..2n-1
  }, [getMetrics]);

  // Przejście o 1 slajd (strzałki)
  const go = (dir: -1 | 1) => {
    const { row, step, centerOffset } = getMetrics();
    const approxTriple = Math.round((row.scrollLeft + centerOffset) / step);
    const midIdx = normalizeToMiddle(approxTriple);
    const nextMid = normalizeToMiddle(midIdx + dir);
    centerIndex(nextMid, 'smooth');
  };

  // Snap po puszczeniu gestu
  const snapToNearest = useCallback((preferDir: -1 | 0 | 1 = 0) => {
    const { row, step, centerOffset } = getMetrics();
    const raw = (row.scrollLeft + centerOffset) / step;
    let target = Math.round(raw);

    if (preferDir !== 0) {
      const floor = Math.floor(raw);
      const ceil = Math.ceil(raw);
      target = preferDir > 0 ? ceil : floor;
    }

    const mid = normalizeToMiddle(target);
    centerIndex(mid, 'smooth');
  }, [centerIndex, getMetrics, normalizeToMiddle]);

  // Start + pętla + resize + gesty
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const { n } = getMetrics();
    centerIndex(n, 'instant');

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        teleportIfNeeded();
      });
    };

    const onResize = () => {
      const { row, step, centerOffset } = getMetrics();
      const approxTriple = Math.round((row.scrollLeft + centerOffset) / step);
      const snapMid = normalizeToMiddle(approxTriple);
      centerIndex(snapMid, 'instant');
    };

    row.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const d = dragRef.current;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return; // tylko LPM
      d.active = true;
      d.lockedAxis = null;
      d.startX = e.clientX;
      d.lastX = e.clientX;
      d.startScroll = row.scrollLeft;
      d.startTime = performance.now();
      d.lastTime = d.startTime;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!d.active) return;
      const dx = e.clientX - d.startX;

      if (!d.lockedAxis) {
        const dy = (e as any).clientY ? (e as any).clientY - (e as any).pageY + (e as any).pageY : 0;
        if (Math.abs(dx) > 6) d.lockedAxis = 'x';
        else if (Math.abs(dy) > 6) d.lockedAxis = 'y';
      }

      if (d.lockedAxis === 'x') {
        e.preventDefault();
        row.scrollLeft = d.startScroll - dx;
        d.lastX = e.clientX;
        d.lastTime = performance.now();
      }
    };

    const onPointerUp = () => {
      if (!d.active) return;
      d.active = false;

      const dt = Math.max(1, performance.now() - d.lastTime);
      const vx = (d.lastX - d.startX) / dt; // >0 w prawo
      const distance = d.lastX - d.startX;
      const fast = Math.abs(vx) > 0.35;
      const far = Math.abs(distance) > 60;

      let prefer: -1 | 0 | 1 = 0;
      if (fast || far) prefer = distance < 0 ? 1 : -1;

      snapToNearest(prefer);
    };

    row.addEventListener('pointerdown', onPointerDown, { passive: true });
    row.addEventListener('pointermove', onPointerMove as any, { passive: false });
    row.addEventListener('pointerup', onPointerUp, { passive: true });
    row.addEventListener('pointercancel', onPointerUp, { passive: true });
    row.addEventListener('lostpointercapture', onPointerUp, { passive: true });

    return () => {
      row.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      row.removeEventListener('pointerdown', onPointerDown as any);
      row.removeEventListener('pointermove', onPointerMove as any);
      row.removeEventListener('pointerup', onPointerUp as any);
      row.removeEventListener('pointercancel', onPointerUp as any);
      row.removeEventListener('lostpointercapture', onPointerUp as any);
    };
  }, [getMetrics, centerIndex, teleportIfNeeded, normalizeToMiddle, snapToNearest]);

  return (
    <section className="relative w-full bg-[#131313] text-[#d9d9d9]">
      {/* Nagłówek — pozycja jak miałeś */}
      <div className="max-w-7xl mx-auto px-4 pt-18 pb-0">
        <motion.h2
          variants={headlineRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="
            font-evalinor text-center uppercase text-[#F3EFF5]
            leading-[0.9] tracking-[0.035em]
            !text-4xl sm:!text-6xl md:!text-7xl
            whitespace-nowrap
            !mb-0
          "
        >
          GALERIA
        </motion.h2>
      </div>

      {/* Wrapper */}
      <div className="relative max-w-[2200px] mx-auto px-2 sm:px-4 pb-16 overflow-hidden">
        {/* Pasek slajdów — snap OFF na mobile, ON na desktopie */}
        <div
          ref={rowRef}
          style={{
            scrollPaddingLeft: '12vw',
            scrollPaddingRight: '12vw',
            WebkitOverflowScrolling: 'touch', // płynniej na iOS
          }}
          className="
            relative flex gap-4 sm:gap-5 lg:gap-6
            overflow-x-auto hide-scrollbar
            items-center overscroll-x-contain
            select-none
            pb-8 -mb-8
            touch-pan-y
            md:snap-x md:snap-mandatory
          "
        >
          {TRIPLE.map((src, i) => (
            <div
              key={`${src}-${i}`}
              data-card
              /* 📱 delikatnie większe na tel */
              style={{ height: 'clamp(34vh, 62vw, 78vh)' }}
              className="shrink-0 aspect-[4/3] bg-[#131313] md:snap-center"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={src}
                  alt={`Wizualizacja ${((i % BASE.length) + 1)}`}
                  fill
                  sizes="100vw"
                  className="object-cover pointer-events-none"
                  priority={i < 3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: strzałki — tło = #131313 */}
        <div className="hidden md:flex pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-16 z-20 gap-3">
          <button
            aria-label="Poprzednie zdjęcie"
            onClick={() => go(-1)}
            className="pointer-events-auto h-10 w-10 rounded-full bg-[#131313] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            aria-label="Następne zdjęcie"
            onClick={() => go(1)}
            className="pointer-events-auto h-10 w-10 rounded-full bg-[#131313] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* Mobile: strzałki — też #131313 */}
        <div className="md:hidden mt-4 flex items-center justify-center gap-4">
          <button
            aria-label="Poprzednie zdjęcie"
            onClick={() => go(-1)}
            className="h-10 w-10 rounded-full bg-[#131313] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            aria-label="Następne zdjęcie"
            onClick={() => go(1)}
            className="h-10 w-10 rounded-full bg-[#131313] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
