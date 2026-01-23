// next.config.ts  (ROOT)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      // długie cache dla statycznych
      source: "/:all*(svg|jpg|jpeg|png|webp|gif|ico|css|js|woff2)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
