"use client";
import { useEffect } from "react";

const IDS = ["hero","inwestycja","lokalizacja","dzialki","dla-inwestora","galeria","kontakt"];

export default function SectionHashOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter(e => e.isIntersecting)
          .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit?.target?.id && window.location.hash !== `#${hit.target.id}`) {
          history.replaceState(null, "", `#${hit.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.15, 0.4, 0.75] }
    );
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return null;
}
