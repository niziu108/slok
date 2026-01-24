// src/app/api/contact/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO = 'sprzedaz@slok.com.pl';
// ✅ Bez weryfikacji domeny – jedziemy na resend.dev
const FROM = 'Formularz Osada SŁOK <onboarding@resend.dev>';

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return badRequest('Bad body');

    // --- anti-spam (z Twojego frontu) ---
    const website = String(body.website || '').trim(); // honeypot
    const startedAt = Number(body.startedAt || 0); // timestamp z frontu
    if (website) return NextResponse.json({ ok: true }); // udajemy sukces dla botów

    // boty często wysyłają od razu (np. < 1.2s)
    if (startedAt && Date.now() - startedAt < 1200) {
      return NextResponse.json({ ok: true });
    }

    // --- pola formularza ---
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();

    if (!firstName || !lastName || !email || !message) {
      return badRequest('Missing fields');
    }

    // proste limity, żeby nikt nie wysłał ściany danych
    if (firstName.length > 80 || lastName.length > 120 || email.length > 160 || phone.length > 40) {
      return badRequest('Invalid fields');
    }
    if (message.length > 4000) {
      return badRequest('Message too long');
    }

    const resend = new Resend(apiKey);

    const subject = `SŁOK — formularz: ${firstName} ${lastName}`;
    const text =
      `Imię: ${firstName}\n` +
      `Nazwisko: ${lastName}\n` +
      `E-mail: ${email}\n` +
      `Telefon: ${phone || '-'}\n\n` +
      `Wiadomość:\n${message}\n`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email, // ✅ odpowiadasz “reply” i leci do klienta
      subject,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { ok: false, error: error.message || 'Email provider error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact API crash:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}