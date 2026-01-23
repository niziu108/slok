// src/app/kontakt/page.tsx  (lub src/components/Kontakt.tsx)
'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

const EMAIL = 'sprzedaz@slok.com.pl';
const PHONE_DISPLAY = 'WKRÓTCE'; // <- tutaj docelowo np. "+48 600 700 800"
const PHONE_TEL = 'WKRÓTCE';     // <- tutaj docelowo np. "+48600700800"

/* 🔻 Litery: dużo wolniej z lewej -> prawej */
const letter = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* 🔻 Nagłówek: wejście od dołu */
const headlineRise = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMsg('');

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('ok');
        setMsg('Wiadomość wysłana. Skontaktujemy się z Tobą.');
        form.reset();
      } else {
        setStatus('err');
        setMsg(data?.error || 'Błąd wysyłki. Spróbuj ponownie.');
      }
    } catch {
      setStatus('err');
      setMsg('Błąd sieci. Spróbuj ponownie.');
    }
  };

  const isPhoneReady = PHONE_TEL !== 'WKRÓTCE' && PHONE_DISPLAY !== 'WKRÓTCE';

  return (
    <main className="min-h-screen w-full bg-[#131313] text-[#d9d9d9]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* NAGŁÓWEK NAD CAŁĄ SEKCJĄ — wejście od dołu */}
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

        {/* DWIE KOLUMNY */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEWA: dane kontaktowe */}
          <div>
            <div className="space-y-3">
              <a href={`mailto:${EMAIL}`} aria-label={`Napisz na ${EMAIL}`}>
                <Stagger
                  as="div"
                  text={`MAIL: ${EMAIL}`}
                  className="
                    font-evalinor uppercase leading-[0.95] tracking-tight
                    text-[clamp(32px,7vw,80px)]
                    lg:text-[clamp(16px,4vw,32px)]
                  "
                />
              </a>

              {isPhoneReady ? (
                <a href={`tel:${PHONE_TEL}`} aria-label={`Zadzwoń ${PHONE_DISPLAY}`}>
                  <Stagger
                    as="div"
                    text={`TEL: ${PHONE_DISPLAY}`}
                    className="
                      font-evalinor uppercase leading-[0.95] tracking-tight
                      text-[clamp(32px,7vw,80px)]
                      lg:text-[clamp(16px,4vw,32px)]
                    "
                  />
                </a>
              ) : (
                <Stagger
                  as="div"
                  text={`TEL: ${PHONE_DISPLAY}`}
                  className="
                    font-evalinor uppercase leading-[0.95] tracking-tight
                    text-[clamp(32px,7vw,80px)]
                    lg:text-[clamp(16px,4vw,32px)]
                  "
                />
              )}
            </div>

            {/* OPIS NA DOLE LEWEJ STRONY */}
            <p className="mt-8 max-w-md text-[clamp(15px,1.5vw,18px)]">
              Wypełnij formularz lub skontaktuj się z biurem sprzedaży,
              aby otrzymać indywidualną ofertę.
            </p>
          </div>

          {/* PRAWA: formularz minimalistyczny */}
          <div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="mb-1 text-xs uppercase tracking-[0.12em]">
                  Imię
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none focus:border-[#d9d9d9]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName" className="mb-1 text-xs uppercase tracking-[0.12em]">
                  Nazwisko
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none focus:border-[#d9d9d9]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-xs uppercase tracking-[0.12em]">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none focus:border-[#d9d9d9]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="mb-1 text-xs uppercase tracking-[0.12em]">
                  Numer telefonu
                </label>
                <input
                  id="phone"
                  name="phone"
                  inputMode="tel"
                  pattern="[0-9 +()-]{6,}"
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none focus:border-[#d9d9d9]"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col">
                <label htmlFor="message" className="mb-1 text-xs uppercase tracking-[0.12em]">
                  Wiadomość
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Napisz do nas parę słów..."
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none focus:border-[#d9d9d9] resize-none"
                />
              </div>

              {/* STATUS */}
              {(status === 'ok' || status === 'err') && (
                <div className="sm:col-span-2 text-sm">
                  <span className={status === 'ok' ? 'text-[#F3EFF5]' : 'text-red-300'}>
                    {msg}
                  </span>
                </div>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 px-0 py-2 bg-transparent rounded-none
                             border-b border-[#d9d9d9]/60 hover:border-[#d9d9d9] focus:border-[#d9d9d9] transition
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}