import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import GlobalMenu from '@/components/GlobalMenu';
import Kontakt from '@/components/kontakt';
import { getParcel, allParcelIds } from '@/lib/parcels';
import { formatPLN, formatM2, STATUS_LABEL } from '@/lib/parcelFormat';

const SITE = 'https://slok.com.pl';

// Cena i status działki mogą się zmienić w panelu, więc strony odświeżają się co minutę.
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

  // Kluczowe fakty siedzą w tytule, opisie i schemacie (czyli w tekście dla
  // Google i modeli AI), nawet jeśli na samej stronie pokazujemy głównie
  // formularz i grafikę działki.
  const title = `Działka nr ${nr}, ${area}`;
  const description =
    `${p.przeznaczenie}, ${area}${cena}. Działka nad zalewem Słok, 9 km od Bełchatowa. ` +
    `Prąd i woda, obowiązujący MPZP. Zapytaj o ofertę.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: p.status === 'sprzedana' ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'website',
      url,
      title: `${title} — Osada SŁOK`,
      description,
      images: [{ url: `${SITE}${p.obraz}`, alt: `Działka nr ${nr}` }],
    },
  };
}

export default async function DzialkaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getParcel(id);
  if (!p) notFound();

  const nr = numerLabel(p.numery);
  const url = `${SITE}/dzialki/${id}`;
  // Formularz pokazujemy dla działek, o które można realnie zapytać.
  const pokazFormularz = p.status === 'dostepna' || p.status === 'etap2';

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

      {/* Nagłówek: krótko i konkretnie. Reszta danych jest na grafice niżej. */}
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-8 text-center md:pt-28">
        <nav aria-label="Ścieżka nawigacji" className="mb-6 text-sm text-[#d9d9d9]/60">
          <Link href="/" className="hover:text-[#F3EFF5]">Osada SŁOK</Link>
          <span className="mx-2">/</span>
          <Link href="/dzialki" className="hover:text-[#F3EFF5]">Działki</Link>
          <span className="mx-2">/</span>
          <span className="text-[#F3EFF5]">nr {nr}</span>
        </nav>

        <div className="mb-3 flex justify-center">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.12em] ${
              p.status === 'dostepna'
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

        <p className="mt-3 text-xl text-[#F3EFF5]">
          {formatM2(p.powierzchnia)}
          {p.cena && (
            <>
              <span className="mx-3 text-[#d9d9d9]/30">·</span>
              <span className="font-semibold">{formatPLN(p.cena)}</span>
            </>
          )}
        </p>

        <p className="mx-auto mt-4 max-w-prose text-[15px] leading-relaxed text-[#d9d9d9]/75">
          {p.przeznaczenie}, nad zbiornikiem Słok około 9 km od Bełchatowa. Teren objęty miejscowym
          planem zagospodarowania (MPZP), z przyłączami energetycznymi (PGE) i wodociągowymi.
        </p>
      </div>

      {/* FORMULARZ — główna akcja strony */}
      {pokazFormularz ? (
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
      ) : (
        <div className="mx-auto max-w-3xl px-4 pb-8 text-center">
          <p className="text-[#d9d9d9]/80">
            {p.status === 'sprzedana'
              ? 'Ta działka została sprzedana.'
              : 'Ta działka jest częścią ośrodka wypoczynkowego.'}
          </p>
          <Link
            href={p.status === 'osrodek' ? '/osrodek' : '/dzialki'}
            className="mt-4 inline-flex rounded-full border border-[#d9d9d9]/50 px-6 py-3 text-sm uppercase tracking-[0.14em] text-[#d9d9d9] transition hover:bg-[#d9d9d9] hover:text-[#131313]"
          >
            {p.status === 'osrodek' ? 'Zobacz ośrodek' : 'Zobacz dostępne działki'}
          </Link>
        </div>
      )}

      {/* ZDJĘCIE DZIAŁKI — pod formularzem. Ma na sobie wszystkie dane:
          powierzchnię, podział, wymiary i orientację. */}
      <div className="mx-auto max-w-4xl px-4 pb-20">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40 ring-1 ring-[#d9d9d9]/15">
          <Image
            src={p.obraz}
            alt={`Działka nr ${nr}: ${p.przeznaczenie}, ${formatM2(p.powierzchnia)}, wymiary i podział na część budowlaną i leśną`}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain"
          />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/wyszukiwarka"
            className="inline-flex rounded-full border border-[#d9d9d9]/40 px-6 py-3 text-sm uppercase tracking-[0.14em] text-[#d9d9d9]/80 transition hover:bg-[#d9d9d9] hover:text-[#131313]"
          >
            Zobacz działkę na mapie
          </Link>
        </div>
      </div>
    </main>
  );
}
