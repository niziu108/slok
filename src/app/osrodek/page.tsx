// src/app/osrodek/page.tsx
import type { Metadata } from 'next';
import OsrodekClient from './OsrodekClient';

export const metadata: Metadata = {
  title: 'Ośrodek wypoczynkowy nad zalewem Słok',
  description:
    'Teren ośrodka wypoczynkowego w Osadzie SŁOK, bezpośrednio przy zbiorniku Słok, 9 km od Bełchatowa. Zobacz zakres terenu i możliwości zagospodarowania.',
  alternates: { canonical: 'https://slok.com.pl/osrodek' },
  openGraph: {
    type: 'website',
    url: 'https://slok.com.pl/osrodek',
    title: 'Ośrodek wypoczynkowy nad zalewem Słok | Osada SŁOK',
    description:
      'Teren ośrodka wypoczynkowego w Osadzie SŁOK, bezpośrednio przy zbiorniku Słok, 9 km od Bełchatowa.',
  },
};

export default function OsrodekPage() {
  return (
    <main className="bg-[#131313]">
      <OsrodekClient />
    </main>
  );
}
