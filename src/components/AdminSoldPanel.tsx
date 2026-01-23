'use client';
import { useEffect, useState } from 'react';

export default function AdminSoldPanel() {
  const [ids, setIds] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    const r = await fetch('/api/sold', { cache: 'no-store' });
    const j = await r.json();
    setIds(j.ids || []);
  }

  useEffect(() => { reload(); }, []);

  function parseMany(s: string) {
    return s.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean);
  }

  async function addMany() {
    const list = parseMany(input);
    if (!list.length) return;
    setBusy(true); setMsg(null);
    const r = await fetch('/api/sold', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ids: list }),
    });
    setBusy(false);
    if (r.ok) { setInput(''); await reload(); setMsg('Dodano.'); }
    else setMsg('Błąd dodawania (sprawdź login).');
  }

  async function remove(id: string) {
    setBusy(true); setMsg(null);
    const r = await fetch('/api/sold', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (r.ok) { await reload(); setMsg('Usunięto.'); }
    else setMsg('Błąd usuwania.');
  }

  async function clearAll() {
    if (!confirm('Wyczyścić wszystkie sprzedane?')) return;
    setBusy(true); setMsg(null);
    const r = await fetch('/api/sold', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    setBusy(false);
    if (r.ok) { await reload(); setMsg('Wyczyszczono.'); }
    else setMsg('Błąd czyszczenia.');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.reload();
  }

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm">Dodaj ID (wiele po przecinku/spacji)</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="np. 2138-103, 2138-79 2138-92"
            className="w-full bg-transparent border border-[#F3EFF5]/30 px-3 py-2 outline-none"
          />
        </div>
        <button
          onClick={addMany}
          disabled={busy}
          className="border border-[#F3EFF5]/40 px-3 py-2 hover:bg-[#F3EFF5]/10 disabled:opacity-50"
        >
          Dodaj
        </button>
        <button
          onClick={clearAll}
          disabled={busy}
          className="border border-red-400/60 text-red-300 px-3 py-2 hover:bg-red-500/10 disabled:opacity-50"
        >
          Wyczyść wszystko
        </button>
        <button
          onClick={logout}
          className="ml-auto border border-[#F3EFF5]/30 px-3 py-2 hover:bg-[#F3EFF5]/10"
        >
          Wyloguj
        </button>
      </div>

      <div className="border border-[#F3EFF5]/20">
        <div className="px-3 py-2 text-sm opacity-80">Łącznie: {ids.length}</div>
        <ul className="max-h-[50svh] overflow-auto divide-y divide-[#F3EFF5]/10">
          {ids.map(id => (
            <li key={id} className="flex items-center justify-between px-3 py-2">
              <span className="font-mono">{id}</span>
              <button
                onClick={() => remove(id)}
                className="text-sm border border-[#F3EFF5]/30 px-2 py-1 hover:bg-[#F3EFF5]/10"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>

      {msg && <div className="text-sm opacity-80">{msg}</div>}
    </div>
  );
}
