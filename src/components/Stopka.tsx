// src/components/Stopka.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

export default function Stopka() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";

  const goSmooth = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome) return; // na podstronach normalna nawigacja do /#id
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkCls = "uppercase tracking-[0.035em] hover:opacity-90";

  return (
    <footer className="bg-[#131313] text-[#d9d9d9]">
      {/* GÓRA */}
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-8 text-center md:text-left">
          
          {/* Lewa: DANE FIRMY */}
          <div className="font-evalinor order-2 md:order-1">
            <div className="space-y-3 md:space-y-2 text-base leading-7">
              <div className="uppercase tracking-[0.035em]">DANE FIRMY:</div>
              <div>Słok Sp. z o.o.</div>

              <div className="uppercase pt-1 md:pt-2 tracking-[0.035em]">ADRES:</div>
              <div>Słok 97-400 Bełchatów</div>

              <div className="uppercase pt-1 md:pt-2 tracking-[0.035em]">KONTAKT:</div>
              <div>666 666 666</div>
            </div>
          </div>

          {/* Środek: logo */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/herologo.webp"
              alt="SŁOK"
              width={200}
              height={70}
              className="h-[120px] w-auto md:h-[160px] invert"
              priority
            />
          </div>

          {/* Prawa: menu */}
          <nav className="font-evalinor order-3 text-base md:text-lg leading-7 md:leading-8 md:text-right">
            <ul className="space-y-2 md:space-y-2.5 md:pr-[2px]">
              <li>
                {onHome ? (
                  <Link href="#inwestycja" onClick={(e) => goSmooth(e, "inwestycja")} className={linkCls}>
                    O INWESTYCJI
                  </Link>
                ) : (
                  <Link href="/#inwestycja" className={linkCls}>O INWESTYCJI</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#lokalizacja" onClick={(e) => goSmooth(e, "lokalizacja")} className={linkCls}>
                    LOKALIZACJA
                  </Link>
                ) : (
                  <Link href="/#lokalizacja" className={linkCls}>LOKALIZACJA</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#dlainwestora" onClick={(e) => goSmooth(e, "dlainwestora")} className={linkCls}>
                    DLA INWESTORA
                  </Link>
                ) : (
                  <Link href="/#dlainwestora" className={linkCls}>DLA INWESTORA</Link>
                )}
              </li>
              <li>
                {onHome ? (
                  <Link href="#galeria" onClick={(e) => goSmooth(e, "galeria")} className={linkCls}>
                    GALERIA
                  </Link>
                ) : (
                  <Link href="/#galeria" className={linkCls}>GALERIA</Link>
                )}
              </li>
              <li>
                {/* wyszukiwarka to zawsze osobna podstrona */}
                <Link href="/wyszukiwarka" className={linkCls}>WYSZUKIWARKA</Link>
              </li>
              <li>
                {onHome ? (
                  <Link href="#kontakt" onClick={(e) => goSmooth(e, "kontakt")} className={linkCls}>
                    KONTAKT
                  </Link>
                ) : (
                  <Link href="/#kontakt" className={linkCls}>KONTAKT</Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* DÓŁ */}
      <div className="border-t border-[#d9d9d9]/30">
        <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-[12px] leading-snug max-w-4xl text-center sm:text-left">
            Niniejsza strona ma charakter informacyjny, nie stanowi oferty handlowej w rozumieniu Art. 66 § 1
            Kodeksu Cywilnego. Zamieszczone na stronie materiały graficzne, w tym wizualizacje, mają charakter
            wyłącznie poglądowy, a przedstawione w nich modele budynków oraz zagospodarowanie terenu mogą
            podlegać zmianom na etapie realizacji.
          </p>
          <Link
            href="/polityka-prywatnosci"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] underline-offset-4 hover:underline whitespace-nowrap text-center sm:text-right"
          >
            Polityka prywatności
          </Link>
        </div>

        {/* Podpis na samym dole */}
        <div className="mx-auto max-w-6xl px-8 pb-3">
          <p className="text-[11px] text-center text-[#d9d9d9]">
            design: <a href="mailto:biuro@ultimareality.pl" className="hover:underline">
              biuro@ultimareality.pl
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
