'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Bungee } from 'next/font/google';
import { motion } from 'framer-motion';

const bungee = Bungee({ subsets: ['latin-ext'], weight: '400' });

// Animacje
const stagger = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// STRZAŁKA LEWA
function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 24" aria-hidden="true" {...props}>
      <line x1="198" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
      <polyline points="20,2 2,12 20,22" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
// STRZAŁKA PRAWA
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 24" aria-hidden="true" {...props}>
      <line x1="2" y1="12" x2="180" y2="12" stroke="currentColor" strokeWidth="2" />
      <polyline points="180,2 198,12 180,22" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function SlokGlowna() {
  const imagesDesktop = ['/SLOK1.webp', '/SLOKGLOWNE.webp', '/SLOK2.webp'];
  const imagesMobile = ['/tel.webp', '/tel1.webp', '/tel2.webp'];

  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? imagesDesktop.length - 1 : i - 1)),
    []
  );
  const next = useCallback(
    () => setCurrent((i) => (i === imagesDesktop.length - 1 ? 0 : i + 1)),
    []
  );

  // Klawiatura (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // Swipe (mobile)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    if (delta < -50) next();
    touchStartX.current = null;
  };

  return (
    <>
      {/* DESKTOP (≥ 1024px) */}
      <section className="relative hidden lg:block w-full h-screen overflow-hidden bg-[#131313] text-[#d9d9d9]">
        <button
          aria-label="Poprzednie"
          onClick={prev}
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
          tabIndex={-1}
        />
        <button
          aria-label="Następne"
          onClick={next}
          className="absolute inset-y-0 right-0 w-1/3 cursor-pointer"
          tabIndex={-1}
        />

        <Image
          src={imagesDesktop[current]}
          alt={`Slajd ${current + 1}`}
          fill
          priority
          draggable={false}
          className="object-cover select-none"
        />

        {/* Tekst na obrazie (jak w mobile) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="absolute left-10 top-16 z-10"
        >
          <motion.p variants={fadeUp} className={`${bungee.className} text-7xl leading-[0.9]`}>
            PRZYSZŁOŚĆ
          </motion.p>
          <motion.p variants={fadeUp} className={`${bungee.className} text-7xl leading-[0.9]`}>
            NATURA
          </motion.p>
          <motion.p variants={fadeUp} className={`${bungee.className} text-7xl leading-[0.9]`}>
            SPOKÓJ
          </motion.p>
        </motion.div>

        {/* Strzałki */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-10">
          <button aria-label="Poprzednie" onClick={prev} className="p-2">
            <ArrowLeft className="w-[220px] h-6 text-[#d9d9d9]" />
          </button>
          <button aria-label="Następne" onClick={next} className="p-2">
            <ArrowRight className="w-[220px] h-6 text-[#d9d9d9]" />
          </button>
        </div>
      </section>

      {/* MOBILE (<1024px) — dark theme + fade-up + blokada poziomego scrolla */}
      <section className="lg:hidden w-full max-w-[100vw] bg-[#131313] text-[#d9d9d9] overflow-x-hidden">
        <motion.div
          className="min-h-screen flex flex-col justify-center gap-6 px-4 w-full max-w-[100vw] mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Tekst */}
          <motion.div variants={fadeUp} className="text-left">
            <p className={`${bungee.className} text-4xl sm:text-5xl leading-tight`}>PRZYSZŁOŚĆ</p>
            <p className={`${bungee.className} text-4xl sm:text-5xl leading-tight`}>NATURA</p>
            <p className={`${bungee.className} text-4xl sm:text-5xl leading-tight`}>SPOKÓJ</p>
          </motion.div>

          {/* Galeria: pełna szerokość, kwadrat 1:1, ostre rogi */}
          <motion.div
            variants={fadeUp}
            className="relative w-full max-w-[100vw] aspect-square overflow-hidden rounded-none select-none [touch-action:pan-y]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={imagesMobile[current]}
              alt={`Slajd ${current + 1} (mobile)`}
              fill
              priority
              draggable={false}
              className="object-cover"
            />
            {/* klik-strefy tylko w obrębie obrazu */}
            <button aria-label="Poprzednie" onClick={prev} className="absolute inset-y-0 left-0 w-1/3" />
            <button aria-label="Następne" onClick={next} className="absolute inset-y-0 right-0 w-1/3" />
          </motion.div>

          {/* Strzałki pod galerią */}
          <motion.div variants={fadeUp} className="w-full max-w-[100vw] flex items-center justify-center gap-6">
            <button aria-label="Poprzednie" onClick={prev} className="p-2">
              <ArrowLeft className="w-[120px] h-6 text-[#d9d9d9]" />
            </button>
            <button aria-label="Następne" onClick={next} className="p-2">
              <ArrowRight className="w-[120px] h-6 text-[#d9d9d9]" />
            </button>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
