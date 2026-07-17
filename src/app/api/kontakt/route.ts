export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/** Zapasowy kanał. Zostaje TYLKO na wypadek, gdyby w środowisku zabrakło
 *  konfiguracji Resend: lepiej wysłać leada przez Formspree niż zgubić go
 *  całkowicie. Do usunięcia, gdy Resend potwierdzi się na produkcji. */
const FORMSPREE_FALLBACK = 'https://formspree.io/f/xgoarrpe';

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM && process.env.RESEND_TO);
}

/** Diagnostyka konfiguracji. Nie ujawnia wartości sekretów, tylko to,
 *  czy w ogóle są ustawione. */
export async function GET() {
  return NextResponse.json({
    resend: resendConfigured(),
    ma_klucz: Boolean(process.env.RESEND_API_KEY),
    ma_from: Boolean(process.env.RESEND_FROM),
    ma_to: Boolean(process.env.RESEND_TO),
    kanal: resendConfigured() ? 'resend' : 'formspree (zapasowy)',
  });
}

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const firstName = String(body.firstName ?? '').trim();
  const lastName = String(body.lastName ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();
  const zgoda = String(body.zgoda ?? '');
  const dzialka = String(body.dzialka ?? '').trim();
  const dzialkaLink = String(body.dzialkaLink ?? '').trim();
  const website = String(body.website ?? '').trim();
  const startedAt = Number(body.startedAt ?? 0);

  // Anty-spam. Botowi zwracamy sukces, żeby nie próbował dalej.
  if (website) return NextResponse.json({ ok: true });
  if (startedAt && Date.now() - startedAt < 1200) return NextResponse.json({ ok: true });

  if (!email || !message) {
    return NextResponse.json({ error: 'Podaj e-mail i wiadomość.' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Nieprawidłowy adres e-mail.' }, { status: 400 });
  }
  // Zgoda jest wymagana także po stronie serwera, nie tylko w formularzu.
  if (zgoda !== 'TAK') {
    return NextResponse.json({ error: 'Wymagana jest zgoda na przetwarzanie danych.' }, { status: 400 });
  }

  const temat = dzialka
    ? `Zapytanie o działkę ${dzialka} — slok.com.pl`
    : 'Nowa wiadomość ze strony slok.com.pl';

  const wiersze: Array<[string, string]> = [
    ['Imię i nazwisko', `${firstName} ${lastName}`.trim() || '—'],
    ['E-mail', email],
    ['Telefon', phone || '—'],
    ...(dzialka ? ([['Działka', dzialka]] as Array<[string, string]>) : []),
    ...(dzialkaLink ? ([['Link do oferty', dzialkaLink]] as Array<[string, string]>) : []),
    ['Zgoda RODO', zgoda],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#131313">
      <h2 style="margin:0 0 16px">${esc(temat)}</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${wiersze
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`
          )
          .join('')}
      </table>
      <div style="padding:12px 16px;background:#f4f4f2;border-radius:6px;white-space:pre-wrap">${esc(message)}</div>
    </div>`;

  // Kanał główny: Resend (dane nie opuszczają naszej infrastruktury).
  if (resendConfigured()) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY!);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: process.env.RESEND_TO!.split(',').map((s) => s.trim()).filter(Boolean),
        subject: temat,
        html,
        replyTo: email, // odpowiedź z panelu poczty leci prosto do klienta
      });
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true, kanal: 'resend' });
    } catch (e) {
      // Nie gubimy leada: schodzimy na kanał zapasowy.
      console.error('[kontakt] Resend nie zadziałał, próbuję Formspree:', e);
    }
  }

  try {
    const res = await fetch(FORMSPREE_FALLBACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, phone, message, zgoda, dzialka, dzialkaLink }),
    });
    if (!res.ok) throw new Error(`Formspree ${res.status}`);
    return NextResponse.json({ ok: true, kanal: 'formspree' });
  } catch (e) {
    console.error('[kontakt] Nie udało się wysłać żadnym kanałem:', e);
    return NextResponse.json(
      { error: 'Nie udało się wysłać wiadomości. Napisz na sprzedaz@slok.com.pl.' },
      { status: 502 }
    );
  }
}
