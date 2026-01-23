'use client';

import { useEffect, useState } from 'react';

const looksLikeParcelId = (s: string) => /^\d/.test(s); // ID zaczyna się cyfrą (np. 2138-103)

export default function AdminParcelPricingPanel() {
  const [id, setId] = useState('');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [allPrices, setAllPrices] = useState<Record<string, string>>({});

  // pobierz wszystkie zapisane ceny
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/pricing', { cache: 'no-store' });
        const j = await r.json();
        setAllPrices(j?.pricing || {});
      } catch {}
    })();
  }, []);

  async function save() {
    setMsg(null);
    const key = id.trim();
    const value = price.trim();
    if (!key || !value) {
      setMsg('Podaj ID i cenę.');
      return;
    }
    try {
      const r = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Błąd');
      setAllPrices(j.pricing || {});
      setMsg('Zapisano.');
    } catch (e: any) {
      setMsg(e.message || 'Błąd zapisu');
    }
  }

  // pokazujemy tylko pozycje, które wyglądają na ID działek
  const parcelEntries = Object.entries(allPrices)
    .filter(([k]) => looksLikeParcelId(k))
    .sort(([a], [b]) => a.localeCompare(b, 'pl'));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="np. 2138-103"
          className="bg-transparent border border-[#F3EFF5]/30 px-4 py-3 outline-none"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="np. 235 000 zł"
          className="bg-transparent border border-[#F3EFF5]/30 px-4 py-3 outline-none"
        />
        <button
          onClick={save}
          className="bg-[#F3EFF5] text-[#131313] px-5 py-3 font-medium"
        >
          Zapisz
        </button>
      </div>

      {msg && <div className="text-sm text-[#F3EFF5]/70">{msg}</div>}

      {/* Lista zapisanych cen TYLKO dla ID działek – bez starej tabelki kategorii */}
      {parcelEntries.length > 0 && (
        <div className="overflow-hidden border border-[#F3EFF5]/22">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#0f0f0f]">
                <th className="px-4 py-3 text-[13px] tracking-wide text-[#F3EFF5]/80 font-normal border-b border-[#F3EFF5]/12">
                  ID
                </th>
                <th className="px-4 py-3 text-[13px] tracking-wide text-[#F3EFF5]/80 font-normal border-b border-[#F3EFF5]/12">
                  Cena (tekst)
                </th>
              </tr>
            </thead>
            <tbody>
              {parcelEntries.map(([k, v]) => (
                <tr key={k} className="hover:bg-[#F3EFF5]/5 transition-colors">
                  <td className="px-4 py-3 border-b border-[#F3EFF5]/10">{k}</td>
                  <td className="px-4 py-3 border-b border-[#F3EFF5]/10">
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
