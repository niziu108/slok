import type { MetadataRoute } from "next";

const BASE = "https://slok.com.pl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panel", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
