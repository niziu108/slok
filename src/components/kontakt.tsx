// src/app/kontakt/page.tsx (lub src/components/Kontakt.tsx)
'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const EMAIL = 'sprzedaz@slok.com.pl';

/* 🔻 Litery */
const letter: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/* 🔻 Nagłówek */
const headlineRise: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Stagger({
  text,
  className,
  as: Tag = 'div',
}: {
  text: string;
  className?: string;
  as?: any;
}) {
  const chars = Array.from(text);
  return (
    <Tag className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </Tag>
  );
}

export default function Kontakt() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState<string>('');

  // Anti-spam: czas startu (boty często wysyłają „od razu”)
  const startedAt = useMemo(() => Date.now(), []);
  // Anti-spam: honeypot (ukryte pole)
  const [website, setWebsite] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMsg('');

    const form = e.currentTarget;

    // payload z FormData + pola antyspamowe
    const payload = Object.fromEntries(new FormData(form).entries());
    const body = {
      ...payload,
      startedAt,
      website, // honeypot
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      // ✅ ważne: sprawdzamy i HTTP, i data.ok
      if (res.ok && data?.ok) {
        setStatus('ok');
        setMsg('Wiadomość wysłana. Skontaktujemy się z Tobą.');
        form.reset();
        setWebsite('');
      } else {
        setStatus('err');
        setMsg(data?.error || 'Błąd wysyłki. Spróbuj ponownie.');
      }
    } catch {
      setStatus('err');
      setMsg('Błąd sieci. Spróbuj ponownie.');
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#131313] text-[#d9d9d9]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* NAGŁÓWEK */}
        <div className="text-center mb-12">
          <motion.h1
            variants={headlineRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="font-evalinor uppercase leading-[0.95] tracking-tight text-[clamp(32px,7vw,80px)]"
          >
            KONTAKT
          </motion.h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEWA */}
          <div>
            <div className="space-y-6">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d9d9d9]/70 mb-2">
                  Biuro sprzedaży
                </div>

                <a href={`mailto:${EMAIL}`} className="block text-lg hover:text-[#F3EFF5] transition">
                  {EMAIL}
                </a>

                <a
                  href="tel:519770923"
                  className="block text-lg mt-3 hover:text-[#F3EFF5] transition"
                >
                  Paula Matuszewska – 519&nbsp;770&nbsp;923
                </a>

                <a href="tel:530417924" className="block text-lg hover:text-[#F3EFF5] transition">
                  Monika Kiełbik – 530&nbsp;417&nbsp;924
                </a>
              </div>
            </div>

            <p className="mt-8 max-w-md text-[clamp(15px,1.5vw,18px)]">
              Wypełnij formularz lub skontaktuj się z biurem sprzedaży, aby otrzymać indywidualną
              ofertę.
            </p>
          </div>

          {/* PRAWA */}
          <div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Honeypot (ukryte) */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">Imię</label>
                <input
                  name="firstName"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">Nazwisko</label>
                <input
                  name="lastName"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">E-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">Numer telefonu</label>
                <input
                  name="phone"
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">Wiadomość</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Napisz do nas parę słów..."
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none resize-none"
                />
              </div>

              {(status === 'ok' || status === 'err') && (
                <div className="sm:col-span-2 text-sm">
                  <span className={status === 'ok' ? 'text-[#F3EFF5]' : 'text-red-300'}>{msg}</span>
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="border-b border-[#d9d9d9]/60 hover:border-[#d9d9d9] transition disabled:opacity-50"
                >
                  {status === 'sending' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
              </div>

              {/* mały hint przy błędzie */}
              {status === 'err' && (
                <div className="sm:col-span-2 text-xs text-[#d9d9d9]/60">
                  Jeśli problem się powtarza, napisz bezpośrednio na {EMAIL}.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}