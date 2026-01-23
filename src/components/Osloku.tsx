// src/components/OSloku.tsx
'use client';

import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function OSloku() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    // pełny ekran + bezpieczne strefy
    <section ref={ref} className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden">
      {/* Tło */}
      <Image
        src="/osloku.webp"
        alt="Słok z lotu ptaka"
        fill
        className="object-cover z-0"
        priority
        sizes="100vw"
      />

      {/* Przyciemnienie */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Treść */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="
          relative z-20 flex flex-col items-center justify-center
          w-full h-full text-center
          px-4 sm:px-6 md:px-8
          pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        "
      >
        {/* Nagłówek – Evalinor + responsywne clamp */}
        <h2
          className="
            font-evalinor uppercase text-[#fbfaf5]
            leading-[0.88] tracking-[-0.02em]
            text-[clamp(2rem,6vw,5.5rem)]
            !mb-4 sm:!mb-6 md:!mb-8
          "
        >
          PRZYSZŁOŚĆ MA SWOJE MIEJSCE
        </h2>

        {/* Opis */}
        <p
          className="
            max-w-[92ch] md:max-w-[80ch] lg:max-w-[70ch]
            text-[#dad7cd]
            text-base sm:text-lg md:text-xl lg:text-2xl
            leading-relaxed md:leading-relaxed
          "
        >
          Zainspirowani naturą i przyszłością, tworzymy miejsce, które stanie się nowym
          symbolem samowystarczalnego życia. Sołectwo Słok to przestrzeń w bezpośrednim
          sąsiedztwie lasów iglastych i zbiornika wodnego, zaprojektowana jako zwarte,
          autonomiczne osiedle XXI wieku. Kameralne, lecz bogate w miejsca sprzyjające
          społecznym relacjom. Przestrzenie wspólne i rekreacyjne – wszystko to w harmonii
          z naturą i człowiekiem.
        </p>
      </motion.div>
    </section>
  );
}
