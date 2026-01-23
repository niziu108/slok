'use client';
import { useState } from 'react';

export default function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (r.ok) location.reload();
    else setErr('Błędne hasło.');
  }

  return (
    <form onSubmit={onSubmit} className="bg-[#1b1b1b] border border-[#F3EFF5]/20 p-4 grid gap-3">
      <label className="text-sm">Hasło administratora</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-transparent border border-[#F3EFF5]/30 px-3 py-2 outline-none"
        placeholder="••••••••"
      />
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <button
        type="submit"
        disabled={loading}
        className="justify-self-start border border-[#F3EFF5]/40 px-3 py-2 hover:bg-[#F3EFF5]/10 disabled:opacity-50"
      >
        {loading ? 'Logowanie…' : 'Zaloguj'}
      </button>
    </form>
  );
}
