// src/app/wyszukiwarka/page.tsx
import GlobalMenu from "../../components/GlobalMenu";
import WyszukiwarkaClient from "../../components/WyszukiwarkaClient";
import Kontakt from "../../components/kontakt"; // ⬅️ import formularza

export const metadata = {
  title: "Wyszukiwarka — SŁOK",
  description: "Interaktywna mapa działek i filtry wyszukiwania",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#F3EFF5] pt-20 md:pt-24">
      {/* ↑ pt-20/md:pt-24 = odstęp pod fixed menu */}
      <GlobalMenu />
      <WyszukiwarkaClient />

      {/* ⬇️ Formularz kontaktowy na dole strony */}
      <div className="mt-20">
        <Kontakt />
      </div>
    </main>
  );
}
