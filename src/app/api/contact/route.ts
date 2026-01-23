export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.RESEND_TO || 'sprzedaz@slok.com.pl';
    const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ ok: false, error: 'Bad body' }, { status: 400 });

    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
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
      from,
      to,
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact API crash:', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}