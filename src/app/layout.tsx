// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Stopka from "@/components/Stopka";
import PageLoader from "@/components/PageLoader";
import Analytics from "@/components/Analytics";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/* ===========================================
   SEO META + OG + ROBOTS
   =========================================== */
const SITE_NAME = "Osada SŁOK";
const SITE_URL = "https://slok.com.pl";
const SITE_DESC =
  "Osada SŁOK – działki nad wodą w Bełchatowie, uzbrojone w prąd i wodę. Sprawdź lokalizację, dostępne działki i informacje dla inwestorów.";

export const viewport: Viewport = {
  themeColor: "#131313",
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Osada nad wodą`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "Osada SŁOK",
    "SŁOK",
    "działki nad jeziorem",
    "działki rekreacyjne Bełchatów",
    "działki budowlane Bełchatów",
    "uzbrojone działki prąd i woda",
    "inwestycja Słok",
    "działki na sprzedaż Słok",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Osada nad wodą`,
    description: SITE_DESC,
    images: [
      { url: `${SITE_URL}/logo-mobile.png`, width: 800, height: 800, alt: "Logo Osada SŁOK" },
    ],
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Osada nad wodą`,
    description: SITE_DESC,
    images: [`${SITE_URL}/logo-mobile.png`],
  },
  robots: { index: true, follow: true },
};

/* ===========================================
   ROOT LAYOUT
   =========================================== */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-dvh flex flex-col bg-[#131313] text-[#d9d9d9]">
        {/* GA4 — ustaw swój GA_ID w src/components/Analytics.tsx */}
        <Analytics />

        <main className="flex-1 bg-[#131313]">{children}</main>
        <Stopka />
        <PageLoader
          logoSrc="/logo-mobile.png"
          bg="#131313"
          minShowMs={2000}
          fadeMs={900}
          maxTotalMs={7000}
        />
      </body>
    </html>
  );
}
