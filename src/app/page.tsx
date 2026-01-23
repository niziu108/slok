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
import FAQSchema from "@/components/FAQSchema";
import SeoSiteSchema from "@/components/SeoSiteSchema";
import CookieBar from "@/components/CookieBar"; // ⬅️ import tutaj

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

      {/* --------- SCHEMAS (SEO) --------- */}
      <FAQSchema
        items={[
          { q: "Gdzie leży Osada SŁOK?", a: "Nad zbiornikiem Słok, ok. 9 km od Bełchatowa." },
          { q: "Jakie są przybliżone odległości?", a: "Bełchatów 9 km, Częstochowa 67 km, Katowice 146 km, Wrocław 189 km, Warszawa 180 km, Radom 143 km, Lublin 275 km." },
          { q: "Czy są dostępne media?", a: "Szczegóły mediów i uzbrojenia znajdziesz w kartach działek oraz sekcji Inwestycja." },
          { q: "Jak sprawdzić dostępność działek?", a: "Skorzystaj z interaktywnej mapy i listy działek w sekcji Dla Inwestora/Działki." },
          { q: "Jak dojechać do Osady SŁOK?", a: "Dojazd z Bełchatowa zajmuje ok. kilkanaście minut – szczegóły w sekcji Lokalizacja." },
        ]}
      />

      <SeoSiteSchema />

      {/* Pasek cookie (fixed, więc i tak przyklei się na dole) */}
      <CookieBar />
    </main>
  );
}