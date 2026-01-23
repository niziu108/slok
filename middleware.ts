// middleware.ts  (ROOT, nie w src/)
import { NextResponse, NextRequest } from "next/server";

const CANONICAL_HOST = "slok.pl";

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next(); // w dev NIE przekierowujemy
  }
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const wantsWWW = host.startsWith("www.");
  const wrongHost = host !== CANONICAL_HOST && !host.endsWith(".vercel.app");

  if (wantsWWW || wrongHost || url.protocol !== "https:") {
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
