// src/app/polityka-prywatnosci/page.tsx
import { Bungee } from "next/font/google";

const bungee = Bungee({ subsets: ["latin-ext"], weight: "400" });

export const metadata = {
  title: "Polityka prywatności — SŁOK",
  description: "Polityka prywatności serwisu SŁOK.",
};

export default function PolitykaPrywatnosci() {
  return (
    <main className="min-h-screen bg-[#fbfaf5] text-[#344e41] m-0 p-0">
      <div className="mx-auto max-w-4xl px-5">
        {/* POWRÓT */}
        <div className={`flex items-center mb-6 pt-4 ${bungee.className}`}>
          <a
            href="/#hero"
            className="flex items-center text-[#344e41] text-xl group"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">
              ←
            </span>
            POWRÓT DO STRONY GŁÓWNEJ
          </a>
        </div>

        {/* NAGŁÓWEK */}
        <h1 className="text-3xl font-semibold mb-3 leading-tight">
          Polityka prywatności
        </h1>
        <p className="mb-6 text-sm opacity-80">
          Obowiązuje od: <strong>01.08.2025</strong>
        </p>

        {/* TREŚĆ */}
        <section className="space-y-5 pb-10">
          <p>
            Niniejsza Polityka prywatności określa zasady przetwarzania danych
            osobowych zbieranych w związku z korzystaniem z serwisu internetowego
            „SŁOK”.
          </p>

          <h2 className="text-xl font-semibold">1. Administrator danych</h2>
          <p>
            Administratorem danych osobowych jest Słok Sp. z o.o., z siedzibą w
            Słok, 97-400 Bełchatów, NIP: 0000000000.
          </p>

          <h2 className="text-xl font-semibold">2. Zakres i cel przetwarzania</h2>
          <ul className="list-disc ml-5">
            <li>udzielania odpowiedzi na zapytania przesłane przez formularz,</li>
            <li>przygotowania ofert handlowych,</li>
            <li>wypełnienia obowiązków prawnych administratora.</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Podstawa prawna</h2>
          <p>
            Podstawą prawną przetwarzania danych jest art. 6 ust. 1 lit. a, b lub
            c RODO.
          </p>

          <h2 className="text-xl font-semibold">4. Prawa osób</h2>
          <p>
            Każda osoba ma prawo dostępu do swoich danych, ich sprostowania,
            usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz
            wniesienia sprzeciwu.
          </p>

          <h2 className="text-xl font-semibold">5. Okres przechowywania</h2>
          <p>
            Dane przechowywane są przez okres niezbędny do realizacji celów, w
            których zostały zebrane, lub do czasu cofnięcia zgody.
          </p>

          <h2 className="text-xl font-semibold">6. Pliki cookies</h2>
          <p>
            Serwis korzysta z plików cookies w celu zapewnienia prawidłowego
            działania strony oraz w celach statystycznych.
          </p>

          <h2 className="text-xl font-semibold">7. Kontakt</h2>
          <p>
            W sprawach dotyczących ochrony danych osobowych prosimy o kontakt pod
            adresem e-mail: kontakt@slok.pl.
          </p>
        </section>
      </div>
    </main>
  );
}
