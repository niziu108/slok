'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';

const BG = '#131313';
const TXT = '#d9d9d9';

// ✅ Type-safe easing dla Framer Motion (Vercel/Linux/TS nie marudzi)
const EASE: Easing = [0.22, 1, 0.36, 1];

// ✅ Animacja dla liter (Variants + custom)
const letter: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.12 },
  }),
};

// ✅ Animacja dla reszty elementów (logo, opis, zdjęcia)
const riseSlow: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};

export default function Inwestycja() {
  const title = 'OSADA SŁOK';
  const words = title.split(' ');

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: BG, color: TXT }}>
      {/* HERO */}
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-14 md:py-24 flex flex-col items-center justify-center text-center">
        {/* LOGO */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          variants={riseSlow}
          className="mb-10 md:mb-14"
          aria-hidden
        >
          <div
            className="w-40 h-40 md:w-56 md:h-56"
            style={{
              backgroundColor: TXT,
              WebkitMaskImage: "url('/burger.webp')",
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskImage: "url('/burger.webp')",
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              maskSize: 'contain',
            }}
          />
        </motion.div>

        {/* TYTUŁ — animacja liter, łamanie między słowami */}
        <h1
          className="
            font-evalinor uppercase text-center mx-auto max-w-[92vw]
            leading-[0.82] tracking-[-0.035em] [word-spacing:-0.06em]
            text-[clamp(3.5rem,11vw,12rem)]
            mb-4 md:mb-6
          "
          style={{ color: TXT }}
          aria-label={title}
        >
          {words.map((word, wIdx) => (
            <span key={wIdx} className="inline-block mr-[0.18em] last:mr-0 align-baseline">
              {Array.from(word).map((ch, i) => (
                <motion.span
                  key={`${wIdx}-${i}`}
                  custom={wIdx * 10 + i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.7 }}
                  variants={letter}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* OPIS — jak wcześniej + dopisane MPZP */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          variants={riseSlow}
          className="mt-8 md:mt-10 text-lg md:text-2xl max-w-[75ch] mx-auto"
        >
          Oferujemy działki budowlane, inwestycyjne i rekreacyjne położone wśród lasów, w bezpośrednim sąsiedztwie
          zalewu Słok, dla tych, którzy chcą ciszy, przestrzeni i natury, bez rezygnacji z wygody. Dla inwestycji
          podpisane są umowy na przyłącza energetyczne z PGE, a warunki przyłączenia do sieci wodociągowej zostały
          wydane przez Urząd Gminy Bełchatów. Dla terenu obowiązuje miejscowy plan zagospodarowania przestrzennego
          (MPZP).
        </motion.p>

        {/* PRZYCISKI MPZP — otwieranie PDF w nowej karcie (bez route) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          variants={riseSlow}
          className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-4"
        >
          <a
            href="/mpzp-slok.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              rounded-full
              border border-[#d9d9d9]
              px-7 py-3
              text-xs md:text-sm
              uppercase tracking-[0.22em]
              transition
              hover:bg-[#d9d9d9]
              hover:text-[#131313]
              active:scale-[0.99]
            "
          >
            Otwórz MPZP (PDF)
          </a>

          <a
            href="/mapa-slok-mpzp.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              rounded-full
              border border-[#d9d9d9]
              px-7 py-3
              text-xs md:text-sm
              uppercase tracking-[0.22em]
              transition
              hover:bg-[#d9d9d9]
              hover:text-[#131313]
              active:scale-[0.99]
            "
          >
            Otwórz mapę MPZP (PDF)
          </a>
        </motion.div>

        {/* ZDJĘCIE — MOBILE */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          variants={riseSlow}
          className="relative mt-8 w-full aspect-square overflow-hidden md:hidden"
        >
          <Image
            src="/galeria3.webp"
            alt="SŁOK – idea miejsca"
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-contain select-none"
            priority
            draggable={false}
          />
        </motion.div>
      </div>

      {/* ZDJĘCIE — DESKTOP */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={riseSlow}
        className="relative hidden md:block w-full aspect-video"
      >
        <Image
          src="/SLOK1.webp"
          alt="SŁOK — główne ujęcie 16×9"
          fill
          sizes="100vw"
          priority
          draggable={false}
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none bg-gradient-to-b from-transparent to-[#131313]" />
      </motion.div>
    </section>
  );
}
