import type { MetadataRoute } from "next";
import { getAllParcels } from "@/lib/parcels";

const BASE = "https://slok.com.pl";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statyczne: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/dzialki`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/wyszukiwarka`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/osrodek`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];

  // Strony działek. Sprzedane i teren ośrodka pomijamy: to nie jest aktywna
  // oferta do indeksowania (ośrodek ma własną stronę /osrodek).
  let dzialki: MetadataRoute.Sitemap = [];
  try {
    const parcels = await getAllParcels();
    dzialki = parcels
      .filter((p) => p.status === "dostepna" || p.status === "etap2")
      .map((p) => ({
        url: `${BASE}/dzialki/${p.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: p.status === "dostepna" ? 0.8 : 0.5,
      }));
  } catch {
    // Gdy dane są chwilowo niedostępne, zwracamy przynajmniej strony statyczne.
  }

  return [...statyczne, ...dzialki];
}
