import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import GlobalMenu from '@/components/GlobalMenu';
import Kontakt from '@/components/kontakt';
import { getParcel, allParcelIds } from '@/lib/parcels';
import { formatPLN, formatM2, STATUS_LABEL } from '@/lib/parcelFormat';

const SITE = 'https://slok.com.pl';

// Cena i status działki mogą się zmienić w panelu, więc strony odświeżają się
// co minutę (tyle samo co licznik w hero i mapa).
export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return allParcelIds().map((id) => ({ id }));
}

function numerLabel(numery: string[]): string {
  return numery.join(' + ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getParcel(id);
  if (!p) return { title: 'Działka nie znaleziona' };

  const nr = numerLabel(p.numery);
  const area = formatM2(p.powierzchnia);
  const cena = p.cena ? `, cena ${formatPLN(p.cena)}` : '';
  const url = `${SITE}/dzialki/${id}`;

  // Bez sufiksu „Osada SŁOK": layout dokłada go szablonem „%s | Osada SŁOK”.
  const title = `Działka nr ${nr}, ${area}`;
  const description =
    `${p.przeznaczenie}, ${area}${cena}. Działka nad zalewem Słok, 9 km od Bełchatowa. ` +
    `Prąd i woda, obowiązujący MPZP. Zobacz szczegóły i zapytaj o ofertę.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Sprzedane działki zostają w serwisie (pokazują skalę i historię),
    // ale nie chcemy ich indeksować jako aktywnej oferty.
    robots: p.status === 'sprzedana' ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: `${SITE}${p.obraz}`, alt: `Działka nr ${nr}` }],
    },
  };
}

function Fakt({ etykieta, wartosc }: { etykieta: string; wartosc: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#d9d9d9]/15 py-3">
      <span className="text-xs uppercase tracking-[0.14em] text-[#d9d9d9]/50">{etykieta}</span>
      <span className="text-lg text-[#F3EFF5]">{wartosc}</span>
    </div>
  );
}

export default async function DzialkaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getParcel(id);
  if (!p) notFound();

  const nr = numerLabel(p.numery);
  const url = `${SITE}/dzialki/${id}`;
  const dostepna = p.status === 'dostepna';

  // Schema Product + Offer: konkretne liczby, które mogą zacytować Google i modele AI.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Działka nr ${nr} — Osada SŁOK`,
    description: `${p.przeznaczenie}, ${formatM2(p.powierzchnia)}, nad zalewem Słok koło Bełchatowa.`,
    image: `${SITE}${p.obraz}`,
    url,
    category: p.przeznaczenie,
    ...(p.cena
      ? {
          offers: {
            '@type': 'Offer',
            price: p.cena,
            priceCurrency: 'PLN',
            availability:
              p.status === 'sprzedana'
                ? 'https://schema.org/SoldOut'
                : 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen bg-[#131313] text-[#d9d9d9]">
      <GlobalMenu />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        {/* Okruszki */}
        <nav aria-label="Ścieżka nawigacji" className="mb-8 text-sm text-[#d9d9d9]/60">
          <Link href="/" className="hover:text-[#F3EFF5]">Osada SŁOK</Link>
          <span className="mx-2">/</span>
          <Link href="/dzialki" className="hover:text-[#F3EFF5]">Działki</Link>
          <span className="mx-2">/</span>
          <span className="text-[#F3EFF5]">nr {nr}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Grafika działki */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40 ring-1 ring-[#d9d9d9]/15">
            <Image
              src={p.obraz}
              alt={`Działka nr ${nr}: ${p.przeznaczenie}, ${formatM2(p.powierzchnia)}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Dane */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.12em] ${
                  dostepna
                    ? 'bg-[#F3EFF5] text-[#131313]'
                    : 'border border-[#d9d9d9]/40 text-[#d9d9d9]/70'
                }`}
              >
                {STATUS_LABEL[p.status]}
              </span>
            </div>

            <h1 className="font-evalinor text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[0.95] tracking-tight text-[#F3EFF5]">
              Działka nr {nr}
            </h1>

            <div className="mt-2 text-2xl text-[#F3EFF5]">
              {formatM2(p.powierzchnia)}
              {p.cena && (
                <>
                  <span className="mx-3 text-[#d9d9d9]/30">·</span>
                  <span className="font-semibold">{formatPLN(p.cena)}</span>
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <Fakt etykieta="Przeznaczenie" wartosc={p.przeznaczenie} />
              <Fakt etykieta="Powierzchnia całkowita" wartosc={formatM2(p.powierzchnia)} />
              {p.powierzchniaLesna !== null && (
                <Fakt etykieta="w tym część leśna" wartosc={formatM2(p.powierzchniaLesna)} />
              )}
              {p.cena && <Fakt etykieta="Cena" wartosc={formatPLN(p.cena)} />}
              {p.zlM2 && <Fakt etykieta="Cena za m²" wartosc={`${p.zlM2} zł/m²`} />}
              {p.wymiary.length > 0 && (
                <Fakt etykieta="Wymiary boków" wartosc={p.wymiary.join(' · ')} />
              )}
            </div>

            <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-[#d9d9d9]/80">
              Działka w Osadzie SŁOK, nad zbiornikiem Słok, około 9 km od Bełchatowa. Teren objęty
              miejscowym planem zagospodarowania przestrzennego (MPZP), z przyłączami energetycznymi
              (umowy z PGE) i wodociągowymi (warunki z Urzędu Gminy Bełchatów).
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {dostepna && (
                <a
                  href="#zapytaj"
                  className="inline-flex items-center justify-center rounded-full bg-[#F3EFF5] px-8 py-3 text-sm uppercase tracking-[0.14em] text-[#131313] transition hover:bg-white"
                >
                  Zapytaj o tę działkę
                </a>
              )}
              <Link
                href="/wyszukiwarka"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9]/50 px-8 py-3 text-sm uppercase tracking-[0.14em] text-[#d9d9d9] transition hover:bg-[#d9d9d9] hover:text-[#131313]"
              >
                Zobacz na mapie
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Formularz z automatycznie uzupełnionym kontekstem działki */}
      {dostepna && (
        <section id="zapytaj">
          <Kontakt
            dzialka={{
              id: p.id,
              numer: nr,
              powierzchnia: formatM2(p.powierzchnia),
              cena: p.cena ? formatPLN(p.cena) : undefined,
              url,
            }}
          />
        </section>
      )}
    </main>
  );
}
