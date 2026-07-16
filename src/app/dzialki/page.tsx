import type { Metadata } from 'next';
import Link from 'next/link';

import GlobalMenu from '@/components/GlobalMenu';
import { getAllParcels } from '@/lib/parcels';
import { formatPLN, formatM2, STATUS_LABEL, type ParcelStatus } from '@/lib/parcelFormat';

const SITE = 'https://slok.com.pl';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Działki na sprzedaż nad zalewem Słok',
  description:
    'Lista działek budowlanych, usługowych i rekreacyjnych w Osadzie SŁOK nad zbiornikiem Słok, 9 km od Bełchatowa. Powierzchnie, ceny i szczegóły każdej działki.',
  alternates: { canonical: `${SITE}/dzialki` },
  openGraph: {
    type: 'website',
    url: `${SITE}/dzialki`,
    title: 'Działki na sprzedaż nad zalewem Słok — Osada SŁOK',
    description:
      'Lista działek budowlanych, usługowych i rekreacyjnych nad zbiornikiem Słok, 9 km od Bełchatowa.',
  },
};

// Dostępne najpierw, potem II etap, na końcu sprzedane.
const RANK: Record<ParcelStatus, number> = { dostepna: 0, etap2: 1, osrodek: 2, sprzedana: 3 };

export default async function DzialkiPage() {
  const parcels = await getAllParcels();
  const sorted = [...parcels].sort((a, b) => {
    if (RANK[a.status] !== RANK[b.status]) return RANK[a.status] - RANK[b.status];
    return a.powierzchnia - b.powierzchnia;
  });

  const dostepne = parcels.filter((p) => p.status === 'dostepna').length;

  return (
    <main className="min-h-screen bg-[#131313] text-[#d9d9d9]">
      <GlobalMenu />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:pt-28">
        <nav aria-label="Ścieżka nawigacji" className="mb-6 text-sm text-[#d9d9d9]/60">
          <Link href="/" className="hover:text-[#F3EFF5]">Osada SŁOK</Link>
          <span className="mx-2">/</span>
          <span className="text-[#F3EFF5]">Działki</span>
        </nav>

        <h1 className="font-evalinor text-[clamp(2rem,6vw,4rem)] uppercase leading-[0.95] tracking-tight text-[#F3EFF5]">
          Działki nad zalewem Słok
        </h1>
        <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-[#d9d9d9]/80">
          {dostepne > 0
            ? `${dostepne} działek dostępnych z ${parcels.length} w Osadzie SŁOK. `
            : ''}
          Działki budowlane, usługowe i rekreacyjne nad zbiornikiem Słok, 9 km od Bełchatowa. Prąd i
          woda, obowiązujący miejscowy plan zagospodarowania (MPZP).
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-[#d9d9d9]/10 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => {
            const dostepna = p.status === 'dostepna';
            return (
              <li key={p.id} className="bg-[#131313]">
                <Link
                  href={`/dzialki/${p.id}`}
                  className="flex h-full flex-col gap-2 p-5 transition hover:bg-[#1b1b1b]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-evalinor text-xl text-[#F3EFF5]">
                      nr {p.numery.join(' + ')}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                        dostepna
                          ? 'bg-[#F3EFF5] text-[#131313]'
                          : 'border border-[#d9d9d9]/30 text-[#d9d9d9]/60'
                      }`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </div>

                  <div className="text-sm text-[#d9d9d9]/70">{p.przeznaczenie}</div>

                  <div className="mt-auto flex items-baseline justify-between gap-2 pt-2">
                    <span className="text-[#F3EFF5]">{formatM2(p.powierzchnia)}</span>
                    {p.cena && (
                      <span className="text-sm font-semibold text-[#F3EFF5]">
                        {formatPLN(p.cena)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
