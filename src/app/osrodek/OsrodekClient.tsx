'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';

import GlobalMenu from '@/components/GlobalMenu';
import PageLoader from '@/components/PageLoader';
import GaleriaOsrodek from '@/components/GaleriaOsrodek';
import Kontakt from '@/components/kontakt';

const BG = '#131313';
const TXT = '#d9d9d9';

const EASE: Easing = [0.22, 1, 0.36, 1];

const letter: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.04 },
  }),
};

const riseSlow: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export default function OsrodekClient() {
  const [ready, setReady] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const title = 'OŚRODEK WYPOCZYNKOWY';
  const words = title.split(' ');

  return (
    <section className="relative w-full overflow-hidden bg-[#131313] text-[#d9d9d9]">
      {!ready && (
        <div className="fixed inset-0 z-[9999]">
          <PageLoader />
        </div>
      )}

      {/* GLOBAL MENU */}
      <GlobalMenu />

      {/* HERO */}
      <div className="min-h-screen max-w-6xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center justify-center text-center">

        {/* TYTUŁ — mniejszy, premium */}
        <h1
          className="
            font-evalinor uppercase text-center
            leading-[0.9] tracking-[-0.02em]
            text-[clamp(2rem,5vw,4rem)]
          "
          aria-label={title}
        >
          {words.map((word, wIdx) => (
            <span key={wIdx} className="inline-block mr-[0.2em] last:mr-0">
              {Array.from(word).map((ch, i) => (
                <motion.span
                  key={`${wIdx}-${i}`}
                  custom={wIdx * 20 + i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={letter}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* OPIS — czysty, bez pogrubień */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={riseSlow}
          className="mt-10 max-w-[70ch] mx-auto space-y-6 text-[16px] md:text-[18px] leading-relaxed"
        >
          <p>
            Na sprzedaż w pełni funkcjonujący ośrodek wypoczynkowy
            zlokalizowany na działce o powierzchni 7748 m²,
            z bezpośrednim wyjściem nad wodę.
          </p>

          <p>
            Obiekt obejmuje cztery niezależne domy oferujące łącznie 47 miejsc noclegowych.
            Każdy dom wyposażony jest w kuchnię, a pokoje posiadają prywatne łazienki.
            Na terenie znajduje się również wydzielone kamperowisko.
          </p>

          <p>
            Ośrodek prowadzony jest nieprzerwanie i generuje przychody.
            Szczegóły finansowe oraz warunki sprzedaży udostępniane są po kontakcie.
          </p>
        </motion.div>

        {/* PRZYCISK */}
        <motion.button
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={riseSlow}
          onClick={scrollToGallery}
          className="
            mt-10
            bg-[#d9d9d9] text-[#131313]
            px-10 py-4
            text-[12px] uppercase tracking-[0.25em]
            transition
            hover:bg-white
            active:scale-[0.99]
          "
        >
          ZOBACZ GALERIĘ OŚRODKA
        </motion.button>
      </div>

      {/* GALERIA */}
      <div ref={galleryRef} className="scroll-mt-24">
        <GaleriaOsrodek />
      </div>

      {/* KONTAKT */}
      <Kontakt />
    </section>
  );
}
