'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Image from 'next/image';

type Item = {
  number: string;
  title: string;
  content: string;
};

const SECTIONS: Item[] = [
  {
    number: '01.',
    title: 'DZIAŁKI BUDOWLANE',
    content: `Na sprzedaż działki budowlane o zróżnicowanych powierzchniach.  

To doskonała propozycja zarówno dla inwestorów poszukujących gruntu z potencjałem wzrostu wartości, jak i dla osób planujących budowę własnego domu w spokojnym otoczeniu.  

Zakup kilku działek jednocześnie pozwala zrealizować większy projekt, natomiast pojedyncze parcele świetnie sprawdzą się pod zabudowę jednorodzinną.  

Regularny kształt, wygodny dojazd i atrakcyjne położenie łączą bezpieczeństwo lokaty kapitału z praktycznym wykorzystaniem w przyszłości.`,
  },
  {
    number: '02.',
    title: 'DZIAŁKI USŁUGOWE',
    content: `Na sprzedaż 6 działek usługowych i 54 budowlano-usługowych o powierzchniach od 788 m² do 6432 m².  

Teren o dużym potencjale inwestycyjnym – sprawdzi się zarówno dla drobnych przedsięwzięć komercyjnych (sklep, punkt usługowy, niewielkie biuro), jak i dla większego projektu, np. nowoczesnej, kompaktowej galerii handlowej lub kompleksu usługowego.  

Zróżnicowane metraże pozwalają dopasować skalę inwestycji do potrzeb, a otoczenie rozwijającej się zabudowy i elastyczny charakter działek czynią z oferty solidne miejsce do ulokowania kapitału.`,
  },
  {
    number: '03.',
    title: 'DZIAŁKA REKREACYJNA',
    content: `Działka rekreacyjno-usługowa o powierzchni 9796 m² położona w sercu Słoku – jednej z najbardziej perspektywicznych lokalizacji regionu.  

Jej metraż daje szerokie możliwości zagospodarowania: od zabudowy rekreacyjnej, przez obiekty turystyczne, aż po projekt o charakterze inwestycyjnym.  

Położenie w sąsiedztwie lasów i terenów zielonych wyróżnia działkę w długiej perspektywie.  

To solidna baza pod przyszłe przedsięwzięcia komercyjne związane z rekreacją i wypoczynkiem. Tak duże parcele w tej okolicy pojawiają się na rynku niezwykle rzadko.`,
  },
];

const riseOnce: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function DlaInwestora() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#131313] text-[#d9d9d9] min-h-screen flex flex-col">
      {/* HEADER — pieniek nad tekstem, do lewej */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 mb-8 md:mb-12">
          <motion.div
            variants={riseOnce}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col items-start gap-5"
          >
            <Image
              src="/pien.webp"
              alt="Pieniek"
              width={120}
              height={120}
              className="opacity-90"
              priority
            />
            <span className="font-evalinor uppercase text-3xl md:text-6xl leading-[0.92] tracking-[0.035em] text-[#F3EFF5]">
              DLA INWESTORA
            </span>
          </motion.div>
        </div>
      </div>

      {/* LISTA: 3 sekcje (akordeon) */}
      <div className="max-w-6xl mx-auto w-full px-4 pb-20 md:pb-24 flex-1 flex flex-col justify-center">
        <div className="w-full">
          {SECTIONS.map((s, i) => {
            const opened = openIndex === i;
            return (
              <motion.div
                key={i}
                variants={riseOnce}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="border-t border-white/10"
              >
                <button
                  onClick={() => setOpenIndex(opened ? null : i)}
                  className="w-full grid grid-cols-12 items-center gap-4 py-6 md:py-8 text-left"
                >
                  {/* NUMER */}
                  <span className="col-span-2 select-none">
                    <span className="font-evalinor block text-4xl md:text-6xl leading-none text-[#F3EFF5]">
                      {s.number}
                    </span>
                  </span>

                  {/* TYTUŁ */}
                  <span className="col-span-9">
                    <span className="font-evalinor block uppercase tracking-[0.035em] text-3xl md:text-6xl leading-tight text-[#F3EFF5]">
                      {s.title}
                    </span>
                  </span>

                  {/* STRZAŁKA */}
                  <span className="col-span-1 flex justify-end">
                    <motion.svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ rotate: opened ? 180 : 0 }}
                      transition={{ duration: 0.28 }}
                      className="shrink-0 text-[#F3EFF5]"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </span>
                </button>

                {/* OPIS */}
                <AnimatePresence initial={false}>
                  {opened && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pb-10 pl-2 md:pl-[calc(16.666%)] pr-2 md:pr-8 text-base md:text-lg leading-relaxed text-[#d9d9d9] whitespace-pre-line">
                        {s.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}