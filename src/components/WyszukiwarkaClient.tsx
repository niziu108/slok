'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PageLoader from '@/components/PageLoader';
import { Info, MousePointerClick, Square } from 'lucide-react';

const MapaSlok = dynamic(() => import('@/components/MapaSlok'), { ssr: false });

const TITLE = 'WYSZUKIWARKA DZIAŁEK';

const BlueSquare = ({ className = '' }: { className?: string }) => (
  <Square
    size={18}
    className={`mt-1 text-[#F3EFF5] fill-[#5AA0FF] ${className}`}
  />
);

export default function WyszukiwarkaClient() {
  const [ready, setReady] = useState(false);

  return (
    <section className="px-4 pb-12 relative">
      {!ready && (
        <div className="fixed inset-0 z-[9999]">
          <PageLoader />
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <h1
          className="font-evalinor text-center whitespace-nowrap leading-tight tracking-wide text-[clamp(22px,8vw,48px)]"
          aria-label={TITLE}
        >
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15 * i,
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </h1>

        <div className="mx-auto mt-4 grid grid-cols-1 md:grid-cols-[6px_1fr] gap-4 md:gap-6 items-start">
          <div className="hidden md:block h-full w-[6px] bg-[#F3EFF5]/70" />
          <div className="space-y-4">
            <div className="space-y-2 text-left">
              <div className="hidden md:flex flex-col gap-2 text-[18px] leading-relaxed tracking-[0.01em] text-[#F3EFF5]/90">
                <p className="flex items-start gap-2">
                  <Info size={18} className="mt-1 text-[#F3EFF5]" />
                  <span>
                    Najedź na działkę, aby w prawym dolnym rogu zobaczyć jej numer i przeznaczenie.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <MousePointerClick size={18} className="mt-1 text-[#F3EFF5]" />
                  <span>Kliknij, by otworzyć kartę ze szczegółami.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Square size={18} className="mt-1 text-[#F3EFF5]" />
                  <span>Działki oznaczone na czarno są już sprzedane.</span>
                </p>
                <p className="flex items-start gap-2">
                  <BlueSquare />
                  <span>
                    Działki oznaczone na niebiesko będą sprzedawane w drugim etapie – dostępne od 01.08.2027 r.
                  </span>
                </p>
              </div>

              <div className="md:hidden flex flex-col gap-2 text-[17px] leading-relaxed tracking-[0.01em] text-[#F3EFF5]/90">
                <p className="flex items-start gap-2">
                  <MousePointerClick size={18} className="mt-1 text-[#F3EFF5]" />
                  <span>Dotknij działkę, aby otworzyć jej kartę ze szczegółami.</span>
                </p>
                <p className="flex items-start gap-2">
                  <Square size={18} className="mt-1 text-[#F3EFF5]" />
                  <span>Działki oznaczone na czarno są już sprzedane.</span>
                </p>
                <p className="flex items-start gap-2">
                  <BlueSquare />
                  <span>Działki oznaczone na niebiesko to drugi etap – dostępne od 01.08.2027r.</span>
                </p>
              </div>
            </div>

            <MapaSlok onReady={() => setReady(true)} />
          </div>
        </div>
      </div>
    </section>
  );
}
