import type { MetadataRoute } from "next";
const BASE = "https://slok.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/inwestycja",
    "/lokalizacja",
    "/dzialki",
    "/dla-inwestora",
    "/galeria",
    "/kontakt",
  ];
  const now = new Date();

  return staticRoutes.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
