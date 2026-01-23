// src/styles/evalinor.ts
import localFont from "next/font/local";

export const evalinor = localFont({
  src: [
    { path: "../../public/fonts/Evalinor/Evalinor-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Evalinor/Evalinor-Medium.woff2",  weight: "500", style: "normal" },
    { path: "../../public/fonts/Evalinor/Evalinor-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-evalinor",
  display: "swap",
  preload: true,
});
