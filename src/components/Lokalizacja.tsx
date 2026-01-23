'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

const SPACING = {
  headerToNumbers: 'mt-8',
  numbersToLabels: 'mb-4',
  labelsToAxis: 'mb-4',
  axisToPhotos: 'mt-10',
  mobileBlockGap: 'mb-4',
};

const cards = [
  { icon: "/autostrady.png",   title: "SZYBKIE POŁĄCZENIA", desc: "Węzeł dróg ekspresowych i autostrad tuż obok. Dojedziesz wszędzie, wygodnie i szybko." },
  { icon: "/lasiwoda.webp",    title: "OTOCZENIE NATURY",   desc: "Zalew Słok, pachnące lasy i cisza, wszystko na wyciągnięcie ręki." },
  { icon: "/belchatow.webp",   title: "MIASTO POD RĘKĄ",    desc: "Zakupy, szkoły, rozrywka, wszystko 10 minut drogi od domu." },
  { icon: "/centrumpolski.webp", title: "CENTRUM POLSKI",  desc: "Idealny punkt na mapie, z każdego kierunku tu blisko." },
  { icon: "/rowery.webp",      title: "ŚCIEŻKI ROWEROWE",   desc: "Aktywny wypoczynek w naturalnym otoczeniu, liczne ścieżki rowerowe." },
  { icon: "/lotniska.webp",    title: "BRAMA NA ŚWIAT",     desc: "Wygodny dojazd do lotnisk, idealna baza wypadowa w każdy zakątek globu." },
];

const points = [
  { dist: '25 M', label: 'ZALEW SŁOK',         img: '/zalew.webp' },
  { dist: '50 M', label: 'KORTY TENISOWE',     img: '/tenis.webp' },
  { dist: '1 KM', label: 'ŚCIEŻKI ROWEROWE',   img: '/rowery1.webp' },
  { dist: '12 KM', label: 'CENTRUM BEŁCHATOWA',img: '/belchatow1.webp' },
  { dist: '15 KM', label: 'GÓRA KAMIEŃSK',     img: '/kamiensk.webp' },
  { dist: '18 KM', label: 'SOLPARK KLESZCZÓW', img: '/aquapark.webp' },
];

export default function Lokalizacja() {
  return (
    <>
      {/* 1) OPIS + LISTA KORZYŚCI */}
      <section className="w-full bg-[#131313] text-[#d9d9d9] px-4 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bungee mb-6"
            >
              OSADA SŁOK TO MIEJSCE WYJĄTKOWE NIE TYLKO Z NATURY
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-lg md:text-xl mb-8"
            >
              Położona w samym sercu Polski, w otoczeniu lasów i czystej przyrody, Osada SŁOK łączy spokój natury z wygodą lokalizacji. Codzienne dojazdy stają się proste, a wypoczynek naturalny.
              Dzięki bliskości autostrad, lotnisk i dużych miast, to idealna baza wypadowa zarówno na spontaniczne wyjazdy, jak i codzienne życie z dala od zgiełku.
              Tu centrum Polski spotyka się z centrum spokoju.
            </motion.p>

            <motion.a
              href="https://maps.app.goo.gl/YiyM6zSnFL8oXnab6"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="border border-[#d9d9d9] text-[#d9d9d9] px-6 py-3 rounded-full hover:bg-[#d9d9d9] hover:text-[#131313] transition w-max mx-auto md:mx-0"
            >
              OTWÓRZ W MAPACH GOOGLE
            </motion.a>
          </div>

          <div className="grid sm:grid-cols-1 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={48}
                  height={48}
                  className="min-w-[48px] mt-1"
                />
                <p className="text-base md:text-[15px] leading-snug">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2) OŚ ODLEGŁOŚCI */}
      <DistancesTimeline />

      {/* 3) MAPA (bez hotspotów i bez wyciemnienia) */}
      <section id="mapa" className="relative w-full bg-[#131313]">
        <div className="relative w-full aspect-square md:aspect-video xl:aspect-auto xl:h-screen">
          <Image
            src="/mapaslok.webp"
            alt="Mapa lokalizacji Osady SŁOK"
            fill
            priority
            className="object-cover"
            draggable={false}
            sizes="100vw"
          />
        </div>
      </section>
    </>
  );
}

/* ---------- Distances Timeline ---------- */
function DistancesTimeline() {
  const [active, setActive] = useState(0);
  const controls = useAnimation();
  const { ref, inView } = useInView({ amount: 0.4, triggerOnce: true });

  const progress = useMemo(() => {
    if (points.length <= 1) return '0%';
    return `${(active / (points.length - 1)) * 100}%`;
  }, [active]);

  useEffect(() => {
    if (inView) {
      controls.start({ width: progress, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } });
    }
  }, [inView, progress, controls]);

  return (
    <section ref={ref} className="w-full bg-[#131313] text-[#d9d9d9] px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <h3 className="font-bungee text-3xl md:text-5xl text-left md:text-center">
          ODLEGŁOŚĆ OD OSADY SŁOK
        </h3>
        <DesktopAxis active={active} setActive={setActive} controls={controls} />
        <MobileSliderStatic />
      </div>
    </section>
  );
}

/* ---------- Desktop Axis ---------- */
function DesktopAxis({ active, setActive, controls }: { active: number; setActive: (i: number) => void; controls: ReturnType<typeof useAnimation> }) {
  return (
    <div className="hidden md:block">
      <div className="relative h-[460px]">
        <motion.div className={`absolute inset-x-0 top-0 flex justify-between ${SPACING.headerToNumbers}`}>
          {points.map((p, i) => (
            <div key={i} className="flex flex-col items-center cursor-pointer select-none" onMouseEnter={() => setActive(i)} tabIndex={0}>
              <motion.div className={`font-bold text-4xl lg:text-3xl leading-none ${SPACING.numbersToLabels}`}>
                {p.dist}
              </motion.div>
              <motion.div className={`text-xs lg:text-sm tracking-wide opacity-85 ${SPACING.labelsToAxis}`}>
                {p.label}
              </motion.div>
            </div>
          ))}
        </motion.div>
        <div className="absolute left-0 right-0 top-1/3 -translate-y-1/2">
          <div className="h-[6px] bg-[#F3EFF5]/25" />
          <motion.div initial={{ width: 0 }} animate={controls} className="h-[6px] -mt-[6px] bg-[#F3EFF5]" />
        </div>
        <div className={`absolute inset-x-0 bottom-30 flex justify-between ${SPACING.axisToPhotos}`}>
          {points.map((p, i) => (
            <motion.div key={i} animate={{ opacity: i === active ? 1 : 0 }} className="w-[240px] h-[160px]">
              <div className="relative w-full h-full overflow-hidden">
                <Image src={p.img} alt={p.label} fill className="object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile Slider ---------- */
function MobileSliderStatic() {
  const N = points.length;
  return (
    <div className="md:hidden mt-8 relative">
      <div className="overflow-x-auto snap-x snap-mandatory flex gap-6 pb-10 [&::-webkit-scrollbar]:hidden">
        {points.map((p, i) => {
          const fraction = N > 1 ? i / (N - 1) : 0;
          return (
            <div key={i} className="snap-center shrink-0 w-[88%]">
              <div className={SPACING.mobileBlockGap}>
                <span className="block text-4xl font-bold">{p.dist}</span>
                <span className="block text-xs tracking-wide opacity-80">{p.label}</span>
              </div>
              <div className={SPACING.mobileBlockGap}>
                <div className="h-[6px] bg-[#F3EFF5]/25" />
                <div className="h-[6px] -mt-[6px] bg-[#F3EFF5]" style={{ width: `${Math.round(fraction * 100)}%` }} />
              </div>
              <div className={SPACING.mobileBlockGap}>
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image src={p.img} alt={p.label} fill className="object-cover" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
