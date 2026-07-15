// next.config.ts  (ROOT)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // Pliki z /public NIE mają wersjonowanych nazw, więc "immutable" na rok było
      // pułapką i wywołało dwa realne problemy:
      //  1. podmiana obrazka pod tą samą nazwą nigdy nie docierała do użytkownika,
      //     bo CDN i przeglądarka trzymały starą wersję,
      //  2. odpowiedź 404 też dostawała ten nagłówek, więc jedno zapytanie o plik,
      //     zanim ten istniał, zapamiętywało "nie ma go" na rok.
      // Dzień cache plus tydzień stale-while-revalidate daje praktycznie to samo
      // co do szybkości (i tak stoi przed tym Cloudflare), a pomyłka goi się w dobę.
      // js i css zostawiamy Next.js, który hashuje nazwy i sam ustawia immutable.
      source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|mp4|mp3|pdf)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
