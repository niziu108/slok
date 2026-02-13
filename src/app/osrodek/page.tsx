// src/app/osrodek/page.tsx
import OsrodekClient from './OsrodekClient';

export const dynamic = 'force-dynamic';

export default function OsrodekPage() {
  return (
    <main className="bg-[#131313]">
      <OsrodekClient />
    </main>
  );
}
