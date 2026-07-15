import type { MetadataRoute } from "next";

const BASE = "https://slok.com.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/wyszukiwarka`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/osrodek`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.1 },
  ];
}
