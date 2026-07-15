'use client';

import GlobalMenu from "@/components/GlobalMenu";
import HeroDesktop from "@/components/HeroDesktop";
import Inwestycja from "@/components/Inwestycja";
import Lokalizacja from "@/components/Lokalizacja";
import OSloku from "@/components/Osloku";
import Galeria from "@/components/galeria";
import DlaInwestora from "@/components/dlainwestora";
import Kontakt from "@/components/kontakt";

import SectionHashOnScroll from "@/components/SectionHashOnScroll";
import SeoSiteSchema from "@/components/SeoSiteSchema";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf5]">
      {/* Hash w adresie podczas scrolla */}
      <SectionHashOnScroll />

      <GlobalMenu />

      {/* HERO (obsługuje mobil + desktop) */}
      <section id="hero">
        <HeroDesktop />
      </section>

      <section id="inwestycja">
        <Inwestycja />
      </section>

      <section id="lokalizacja">
        <Lokalizacja />
      </section>

      {/* Dla inwestora */}
      <section id="dlainwestora" className="py-0">
        <DlaInwestora />
      </section>

      {/* O Słoku */}
      <section id="osada">
        <OSloku />
      </section>

      <section id="galeria" className="py-0">
        <Galeria />
      </section>

      <section id="kontakt" className="py-0">
        <Kontakt />
      </section>

      {/* --------- SCHEMAS (SEO) ---------
          FAQSchema celowo wyłączony: Google wymaga, aby dane strukturalne
          odzwierciedlały treść widoczną na stronie, a tych pytań na stronie nie ma.
          Włączyć ponownie dopiero razem z widoczną sekcją FAQ. */}
      <SeoSiteSchema />
    </main>
  );
}