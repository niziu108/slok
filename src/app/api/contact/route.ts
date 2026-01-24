import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string; // honeypot (jeśli masz)
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // Honeypot
    if (body.company && body.company.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const message = (body.message || "").trim();

    // Walidacja minimum
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Brak wymaganych pól." },
        { status: 400 }
      );
    }
    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Nieprawidłowy email." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.MAIL_TO || "sprzedaz@slok.com.pl";

    if (!host || !user || !pass) {
      return NextResponse.json(
        { ok: false, error: "Brak konfiguracji SMTP w ENV." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL/TLS
      auth: { user, pass },
    });

    const subject = `OSADA SŁOK – Formularz kontaktowy: ${firstName} ${lastName}`;
    const text = [
      `Imię i nazwisko: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Telefon: ${phone || "-"}`,
      "",
      "Wiadomość:",
      message,
      "",
      `IP/UA: (Vercel)`, // opcjonalne
    ].join("\n");

    await transporter.sendMail({
      from: `Osada SŁOK <${user}>`,
      to,
      subject,
      text,
      replyTo: email, // ważne: odpisujesz bezpośrednio klientowi
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Błąd serwera." },
      { status: 500 }
    );
  }
}