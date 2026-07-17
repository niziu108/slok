// src/app/wyszukiwarka/page.tsx
import type { Metadata } from "next";
import GlobalMenu from "@/components/GlobalMenu";
import WyszukiwarkaClient from "@/components/WyszukiwarkaClient";
import Kontakt from "@/components/kontakt";
import { getOfferStats } from "@/lib/parcels";

// Licznik sprzedaży musi nadążać za panelem.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Wyszukiwarka działek",
  description:
    "Interaktywna mapa działek w Osadzie SŁOK nad zbiornikiem Słok, 9 km od Bełchatowa. Sprawdź dostępność, powierzchnię i cenę każdej działki.",
  alternates: { canonical: "https://slok.com.pl/wyszukiwarka" },
};

export default async function Page() {
  const stats = await getOfferStats();

  return (
    <main className="min-h-screen bg-[#131313] text-[#F3EFF5] pt-20 md:pt-24">
      {/* ↑ pt-20/md:pt-24 = odstęp pod fixed menu */}
      <GlobalMenu />
      <WyszukiwarkaClient stats={stats} />

      {/* ⬇️ Formularz kontaktowy na dole strony */}
      <div className="mt-20">
        <Kontakt />
      </div>
    </main>
  );
}
