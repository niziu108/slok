import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#131313",
          color: "#F3EFF5",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          letterSpacing: "-0.5px",
        }}
      >
        SŁOK — Osada nad wodą
      </div>
    ),
    size
  );
}
