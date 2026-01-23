'use client';

import { useEffect, useMemo, useState } from 'react';

export default function AdminStage2Panel() {
  const [ids, setIds] = useState<string[]>([]);
  const [value, setValue] = useState('');

  const normalized = useMemo(
    () =>
      value
        .split(/[\s,]+/g)
        .map((s) => s.trim())
        .filter(Boolean),
    [value]
  );

  async function refresh() {
    const r = await fetch('/api/stage2', { cache: 'no-store' });
    const j = await r.json();
    setIds(Array.isArray(j?.ids) ? j.ids : []);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function add() {
    if (!normalized.length) return;
    await fetch('/api/stage2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: normalized }),
    });
    setValue('');
    refresh();
  }

  async function removeOne(id: string) {
    await fetch('/api/stage2', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  async function clearAll() {
    await fetch('/api/stage2', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    refresh();
  }

  return (
    <div className="space-y-4 border border-[#F3EFF5]/20 p-4">
      <p className="text-sm text-[#F3EFF5]/80">
        Działki ETAP 2 będą zaznaczone na <span className="font-semibold">niebiesko</span> i będą nieklikalne.
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-[#F3EFF5]/80">Dodaj ID (możesz wkleić wiele, oddzielone spacją lub przecinkiem):</label>
        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="np. 2138-12, 2138-13 2138-14"
            className="w-full bg-transparent border border-[#F3EFF5]/25 px-3 py-2 text-[#F3EFF5] outline-none"
          />
          <button onClick={add} className="border border-[#F3EFF5]/30 px-4 py-2 hover:bg-white/5">
            Dodaj
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[#F3EFF5]/80">Liczba: {ids.length}</div>
        <button onClick={clearAll} className="border border-[#F3EFF5]/30 px-3 py-2 hover:bg-white/5 text-sm">
          Wyczyść wszystko
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {ids.map((id) => (
          <div key={id} className="flex items-center justify-between gap-2 border border-[#F3EFF5]/20 px-3 py-2">
            <span className="text-sm">{id}</span>
            <button onClick={() => removeOne(id)} className="text-sm opacity-80 hover:opacity-100">
              usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}