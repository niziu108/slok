'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { track } from '@/components/Analytics';

const EMAIL = 'sprzedaz@slok.com.pl';

// Własny endpoint zamiast Formspree: dane osobowe nie wychodzą już
// z przeglądarki do zewnętrznego serwisu w USA.
const KONTAKT_ENDPOINT = '/api/kontakt';

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

export type DzialkaKontekst = {
  id: string;
  numer: string;     // np. "2138/103 + 2138/192"
  powierzchnia: string; // np. "1347 m²"
  cena?: string;     // np. "235 000 zł" albo undefined
  url: string;       // pełny link do oferty
};

export default function Kontakt({ dzialka }: { dzialka?: DzialkaKontekst } = {}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState<string>('');

  // Gdy przychodzimy ze strony działki, wiadomość jest wstępnie wypełniona,
  // a numer i link lecą w ukrytych polach, żeby biuro od razu wiedziało,
  // której działki dotyczy zapytanie.
  const domyslnaWiadomosc = dzialka
    ? `Dzień dobry, proszę o kontakt w sprawie działki nr ${dzialka.numer} (${dzialka.powierzchnia}).`
    : '';

  // Anti-spam
  const startedAt = useMemo(() => Date.now(), []);
  const [website, setWebsite] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setMsg('');

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, any>;

    if (website && website.trim().length > 0) {
      setStatus('ok');
      setMsg('Wiadomość wysłana. Skontaktujemy się z Tobą.');
      form.reset();
      setWebsite('');
      return;
    }

    const elapsed = Date.now() - startedAt;
    if (elapsed < 1200) {
      setStatus('ok');
      setMsg('Wiadomość wysłana. Skontaktujemy się z Tobą.');
      form.reset();
      setWebsite('');
      return;
    }

    const body = {
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      email: payload.email ?? '',
      phone: payload.phone ?? '',
      message: payload.message ?? '',
      zgoda: payload.consent ? 'TAK' : 'NIE',
      // Kontekst działki (puste, gdy formularz jest ogólny)
      dzialka: payload.dzialkaNumer ?? '',
      dzialkaLink: payload.dzialkaLink ?? '',
      startedAt,
    };

    try {
      const res = await fetch(KONTAKT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({} as any));

      if (res.ok) {
        setStatus('ok');
        setMsg('Wiadomość wysłana. Skontaktujemy się z Tobą.');

        // Konwersja: to jest lead, nie samo wejście na stronę.
        track('generate_lead', {
          method: 'formularz',
          dzialka: dzialka?.numer ?? '(zapytanie ogólne)',
          strona: typeof window !== 'undefined' ? window.location.pathname : '',
        });

        form.reset();
        setWebsite('');
      } else {
        const nice = data?.error || 'Błąd wysyłki. Spróbuj ponownie.';
        setStatus('err');
        setMsg(nice);
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
          <motion.h2
            variants={headlineRise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="font-evalinor uppercase leading-[0.95] tracking-tight text-[clamp(32px,7vw,80px)]"
          >
            KONTAKT
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEWA */}
          <div>
            <div className="space-y-6">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-[#d9d9d9]/70 mb-2">
                  Biuro sprzedaży
                </div>

                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => track('click_to_email', { adres: EMAIL, dzialka: dzialka?.numer ?? '' })}
                  className="block text-lg hover:text-[#F3EFF5] transition"
                >
                  {EMAIL}
                </a>

                <a
                  href="tel:519770923"
                  onClick={() =>
                    track('click_to_call', {
                      numer: '519770923',
                      osoba: 'Paula Matuszewska',
                      dzialka: dzialka?.numer ?? '',
                    })
                  }
                  className="block text-lg mt-3 hover:text-[#F3EFF5] transition"
                >
                  Paula Matuszewska - 519&nbsp;770&nbsp;923
                </a>

                <a
                  href="tel:605821596"
                  onClick={() =>
                    track('click_to_call', {
                      numer: '605821596',
                      osoba: 'Marcin Rzepecki',
                      dzialka: dzialka?.numer ?? '',
                    })
                  }
                  className="block text-lg hover:text-[#F3EFF5] transition"
                >
                  Marcin Rzepecki - 605&nbsp;821&nbsp;596
                </a>
              
                {/* ✅ DOPISEK: SPRZEDAŻ NA FAKTURĘ VAT (desktop lewo / mobile środek) */}
                <div className="mt-4 text-left text-lg font-semibold sm:text-lg sm:font-semibold">
                  <div className="mx-auto w-fit lg:mx-0 lg:w-auto text-center lg:text-left">
                    Sprzedaż (faktura 23% VAT).
                  </div>
                </div>
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
              {/* Honeypot */}
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

              {/* Kontekst działki: widoczny dla klienta (wie, o co pyta) oraz
                  w ukrytych polach dla biura (wie, której działki dotyczy lead). */}
              {dzialka && (
                <div className="sm:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#d9d9d9]/25 pb-4 text-sm">
                  <span className="uppercase tracking-[0.12em] text-[#d9d9d9]/60">Zapytanie o działkę</span>
                  <span className="font-semibold text-[#F3EFF5]">nr {dzialka.numer}</span>
                  <span className="text-[#d9d9d9]/70">{dzialka.powierzchnia}</span>
                  {dzialka.cena && <span className="text-[#d9d9d9]/70">{dzialka.cena}</span>}
                  <input type="hidden" name="dzialkaNumer" value={dzialka.numer} />
                  <input type="hidden" name="dzialkaLink" value={dzialka.url} />
                </div>
              )}

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
                <input name="phone" className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none" />
              </div>

              <div className="sm:col-span-2 flex flex-col">
                <label className="mb-1 text-xs uppercase tracking-[0.12em]">Wiadomość</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  defaultValue={domyslnaWiadomosc}
                  key={dzialka?.id ?? 'ogolny'}
                  placeholder="Napisz do nas parę słów..."
                  className="bg-transparent border-b border-[#d9d9d9]/40 px-0 py-2 outline-none resize-none"
                />
              </div>

              {/* Zgoda RODO */}
              <div className="sm:col-span-2 flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-[#F3EFF5] cursor-pointer"
                />
                <label htmlFor="consent" className="text-[13px] leading-snug text-[#d9d9d9]/80 cursor-pointer">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na
                  zapytanie i przedstawienia oferty.{' '}
                  <span className="text-[#d9d9d9]/60">(wymagane)</span>
                </label>
              </div>

              <p className="sm:col-span-2 text-[12px] leading-snug text-[#d9d9d9]/55">
                Administratorem danych jest Słok Sp. z o.o., Słok, 97-400 Bełchatów. Dane przetwarzamy
                wyłącznie w celu obsługi zapytania. Podanie danych jest dobrowolne, ale niezbędne, aby
                odpowiedzieć. Masz prawo dostępu do danych, ich sprostowania, usunięcia oraz wycofania zgody
                w dowolnym momencie, pisząc na {EMAIL}. Szczegóły w{' '}
                <Link href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-[#F3EFF5]">
                  Polityce prywatności
                </Link>
                .
              </p>

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