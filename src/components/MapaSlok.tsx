'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = { onReady?: () => void };

const MAP_SRC = '/slok-interaktywny.svg';

/* ──────────────────────────────────────────────────────────────
   TU DODAWAJ/EDYTUJ PRZEZNACZENIA DLA KONKRETNYCH DZIAŁEK
   ────────────────────────────────────────────────────────────── */
const PURPOSE: Record<string, string> = {
  '2138-103': 'Zabudowa mieszkaniowa jednorodzinna',
  '2138-92': 'Zabudowa budowlano usługowa',
  '2138-79': 'Zabudowa usługowa',
  '2138-140': 'Zabudowa usługowa',
  '2138-141': 'Zabudowa usługowa',
  '2138-133': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-134': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-139': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-138': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-137': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-136': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-135': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-132': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-131': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-130': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-129': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-128': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-127': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-126': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-125': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-123': 'Zabudowa usługowo rekreacyjna',
  '2138-116': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-115': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-114': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-117': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-111': 'Zabudowa usługowa',
  '2138-110': 'Zabudowa usługowa',
  '2138-108': 'Zabudowa usługowa',
  '2138-106': 'Zabudowa mieszkaniowa wielorodzinna',
  '2138-44': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-43': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-42': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-41': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-40': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-39': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-38': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-37': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-36': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-35': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-34': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-33': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-32': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-31': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-30': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-29': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-6': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-5': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-4': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-3': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-2': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-1': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-8': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-9': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-10': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-11': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-45': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-46': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-47': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-48': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-49': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-50': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-51': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-52': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
  '2138-53': 'Zabudowa mieszkaniowa jednorodzinna i usługowa',
};

// Mobile: zoom mapy
const MOBILE_ZOOM = 1.30;
// Mobile: zoom karty
const CARD_MOBILE_ZOOM = 1.0;

const isParcelId = (id?: string | null) => !!id && /^\d/.test(id);
const getPurpose = (id: string) =>
  PURPOSE[id] ?? 'Zabudowa mieszkaniowa jednorodzinna';

const sameSet = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
};

// DEV: rzadziej, PROD: normalnie
const REFRESH_MS = process.env.NODE_ENV === 'development' ? 180_000 : 60_000;

// global guard (żeby nie odpalało kilku pollerów w DEV)
declare global {
  // eslint-disable-next-line no-var
  var __SLOK_POLL_RUNNING__: boolean | undefined;
}

export default function MapaSlok({ onReady }: Props) {
  const desktopOverlayRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const [svgReady, setSvgReady] = useState(false);

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [svgAR, setSvgAR] = useState<number>(16 / 9);

  const [soldIds, setSoldIds] = useState<Set<string>>(new Set());
  const [stage2Ids, setStage2Ids] = useState<Set<string>>(new Set());
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const bp = () =>
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    bp();
    window.addEventListener('resize', bp);
    return () => window.removeEventListener('resize', bp);
  }, []);

  // SVG tylko raz
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(MAP_SRC, { cache: 'force-cache' });
        if (!r.ok) throw new Error('missing svg');
        const txt = await r.text();
        if (cancelled) return;

        const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
        const s = doc.querySelector('svg') as SVGSVGElement | null;
        if (s?.viewBox?.baseVal?.width && s?.viewBox?.baseVal?.height) {
          setSvgAR(s.viewBox.baseVal.width / s.viewBox.baseVal.height);
        }

        if (desktopOverlayRef.current) {
          desktopOverlayRef.current.innerHTML = txt;
          const svg =
            desktopOverlayRef.current.querySelector('svg') as SVGSVGElement | null;
          if (svg) {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            attachOverlay(svg, true);
          }
        }

        if (mobileOverlayRef.current) {
          mobileOverlayRef.current.innerHTML = txt;
          const svg =
            mobileOverlayRef.current.querySelector('svg') as SVGSVGElement | null;
          if (svg) {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            attachOverlay(svg, false);
          }
        }

        setSvgReady(true);
      } catch {
        setSvgReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ceny (co REFRESH_MS)
  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loop = async () => {
      try {
        const r = await fetch('/api/pricing', { cache: 'no-store' });
        const j = await r.json();
        if (!stop) setPriceMap(j?.pricing || {});
      } catch {}

      if (!stop) timer = setTimeout(loop, REFRESH_MS);
    };

    loop();

    return () => {
      stop = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  // SOLD+STAGE2 — bez spamowania (global guard + timeout loop)
  useEffect(() => {
    if (globalThis.__SLOK_POLL_RUNNING__) return;
    globalThis.__SLOK_POLL_RUNNING__ = true;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loop = async () => {
      try {
        const [soldR, stage2R] = await Promise.all([
          fetch('/api/sold', { cache: 'no-store' }),
          fetch('/api/stage2', { cache: 'no-store' }),
        ]);

        const soldJ = await soldR.json();
        const stage2J = await stage2R.json();

        const nextSold = new Set<string>((soldJ?.ids || []).map((x: string) => String(x)));
        const nextStage2 = new Set<string>((stage2J?.ids || []).map((x: string) => String(x)));

        if (!cancelled) {
          setSoldIds((prev) => (sameSet(prev, nextSold) ? prev : nextSold));
          setStage2Ids((prev) => (sameSet(prev, nextStage2) ? prev : nextStage2));

          [desktopOverlayRef.current, mobileOverlayRef.current].forEach((root) => {
            const svg = root?.querySelector('svg') as SVGSVGElement | null;
            if (svg) {
              paintStage2(svg, nextStage2);
              paintSold(svg, nextSold);
            }
          });
        }
      } catch {}

      if (!cancelled) timer = setTimeout(loop, REFRESH_MS);
    };

    loop();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      globalThis.__SLOK_POLL_RUNNING__ = false;
    };
  }, []);

  useEffect(() => {
    if (bgReady && svgReady) onReady?.();
  }, [bgReady, svgReady, onReady]);

  const showLabel = !isMobile && isParcelId(hoverId);

  function attachOverlay(svg: SVGSVGElement, hoverLabel: boolean) {
    if ((svg as any).__slokBound) return;
    (svg as any).__slokBound = true;

    const style = document.createElement('style');
    style.textContent = `
      image { display: none !important; }
      [id]  { pointer-events: all; cursor: pointer; fill: rgba(255,255,255,0); }
      ._active { outline: none; filter: drop-shadow(0 0 10px rgba(0,0,0,.45)); }
    `;
    svg.appendChild(style);

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest('[id]') as SVGGraphicsElement | null;
      const id = el?.id?.trim() || null;

      if (!isParcelId(id)) {
        setActiveId(null);
        return;
      }

      const node = id ? svg.getElementById(id) : null;
      if (node && (node.classList.contains('_sold') || node.classList.contains('_stage2'))) {
        setActiveId(null);
        return;
      }

      svg.querySelectorAll('._active').forEach((n) => n.classList.remove('_active'));
      node?.classList.add('_active');
      setActiveId(id!);
    };

    const onMove = (e: MouseEvent) => {
      if (!hoverLabel) return;
      const el = (e.target as Element)?.closest('[id]') as SVGGraphicsElement | null;
      const id = el?.id?.trim() || null;
      setHoverId(isParcelId(id) ? id : null);
    };

    svg.addEventListener('click', onClick);
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', () => setHoverId(null));
  }

  function paintSold(svg: SVGSVGElement, ids: Set<string>) {
    if (!svg.querySelector('style[data-sold-style]')) {
      const st = document.createElement('style');
      st.setAttribute('data-sold-style', '1');
      st.textContent = `
        ._sold {
          fill: rgba(19,19,19,0.6) !important;
          stroke: #F3EFF5 !important;
          stroke-width: 1.2;
          filter: drop-shadow(0 0 6px rgba(0,0,0,.25));
        }
      `;
      svg.appendChild(st);
    }

    svg.querySelectorAll('._sold').forEach((n) => n.classList.remove('_sold'));
    ids.forEach((id) => {
      const el = svg.getElementById(id);
      if (el) el.classList.add('_sold');
    });
  }

  function paintStage2(svg: SVGSVGElement, ids: Set<string>) {
    if (!svg.querySelector('style[data-stage2-style]')) {
      const st = document.createElement('style');
      st.setAttribute('data-stage2-style', '1');
      st.textContent = `
        ._stage2 {
          fill: rgba(90,160,255,0.55) !important;
          stroke: rgba(243,239,245,0.95) !important;
          stroke-width: 1.2;
          filter: drop-shadow(0 0 6px rgba(0,0,0,.18));
          cursor: not-allowed !important;
        }
      `;
      svg.appendChild(st);
    }

    svg.querySelectorAll('._stage2').forEach((n) => n.classList.remove('_stage2'));
    ids.forEach((id) => {
      const el = svg.getElementById(id);
      if (el) el.classList.add('_stage2');
    });
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* DESKTOP */}
      <div className="relative w-full overflow-hidden border border-[#F3EFF5]/20 rounded-none hidden md:block">
        <img
          src={MAP_SRC}
          alt="Mapa SŁOK"
          className="block w-full h-auto select-none"
          onLoad={() => setBgReady(true)}
          draggable={false}
        />

        <div
          ref={desktopOverlayRef}
          className="pointer-events-none absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:pointer-events-auto"
        />

        <img
          src="/mapakompas.webp"
          alt="Kompas"
          className="absolute top-4 left-1/2 -translate-x-1/2 w-25 h-25 md:block hidden select-none pointer-events-none"
          draggable={false}
        />

        {showLabel && hoverId && (
          <div className="pointer-events-none absolute bottom-3 right-3 bg-[#131313]/92 px-4 py-2 border border-[#F3EFF5]/30 shadow-lg">
            <span className="font-evalinor text-[17px] tracking-[0.02em] text-[#F3EFF5]">
              {hoverId} — {getPurpose(hoverId)}
            </span>
          </div>
        )}

        <AnimatePresence>
          {activeId && (
            <motion.div
              key="card-desktop"
              initial={{ translateY: '100%' }}
              animate={{ translateY: 0 }}
              exit={{ translateY: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="absolute inset-0 z-[60]"
            >
              <div
                className="absolute inset-0 bg-[#131313]/98 border border-[#F3EFF5]/25 grid place-items-center"
                onClick={() => setActiveId(null)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(null);
                  }}
                  aria-label="Zamknij"
                  className="absolute top-2 right-3 text-[#F3EFF5] text-2xl z-10"
                >
                  ×
                </button>

                {(() => {
                  const price = activeId ? priceMap[activeId] : undefined;
                  return price ? (
                    <div className="absolute left-3 bottom-3 z-10 bg-[#0f0f0f]/90 border border-[#F3EFF5]/30 px-4 py-2">
                      <span className="font-geist text-[22px] font-medium text-[#F3EFF5]">
                        {price}
                      </span>
                    </div>
                  ) : null;
                })()}

                <img
                  src={`/${activeId}.webp`}
                  alt={activeId ?? ''}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE */}
      <div className="md:hidden -mx-4 overflow-hidden">
        <div
          ref={mobileWrapRef}
          className="relative w-[100svw] mx-auto overflow-hidden"
          style={{ height: `calc(100svw * ${svgAR} * ${MOBILE_ZOOM})` }}
        >
          <div
            ref={stageRef}
            className="absolute left-1/2 top-1/2"
            style={{
              width: `calc(100svw * ${svgAR})`,
              height: '100svw',
              transform: `translate(-50%, -50%) rotate(90deg) scale(${MOBILE_ZOOM})`,
              transformOrigin: '50% 50%',
            }}
          >
            <img
              src={MAP_SRC}
              alt="Mapa SŁOK"
              className="absolute inset-0 w-full h-full object-cover select-none"
              onLoad={() => setBgReady(true)}
              draggable={false}
            />
            <div
              ref={mobileOverlayRef}
              className="[&>svg]:absolute [&>svg]:inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:pointer-events-auto select-none"
            />
          </div>
        </div>
      </div>

      {/* MOBILE CARD */}
      <AnimatePresence>
        {activeId && isMobile && (
          <motion.div
            key="card-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-[120] bg-black/80 flex flex-col items-center justify-center"
            style={{ minHeight: '100svh' }}
            onClick={() => setActiveId(null)}
          >
            <div
              className="relative w-[100svw] max-w-none aspect-[16/9] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const price = activeId ? priceMap[activeId] : undefined;
                return price ? (
                  // ✅ MOBILE: mniejsze, bez obwódki, nie rozpycha szerokości
                  <div
                    className="absolute left-2 bottom-2 z-10 bg-[#0f0f0f]/88 px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm"
                    style={{ maxWidth: 'calc(100% - 16px)' }}
                  >
                    <span
                      className="font-geist font-medium text-[#F3EFF5] leading-tight break-words"
                      style={{ fontSize: 'clamp(12px, 3.6vw, 15px)' }}
                    >
                      {price}
                    </span>
                  </div>
                ) : null;
              })()}

              <img
                src={`/${activeId}.webp`}
                alt={activeId ?? ''}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{ transform: `scale(${CARD_MOBILE_ZOOM})`, transformOrigin: '50% 50%' }}
                draggable={false}
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveId(null);
              }}
              aria-label="Zamknij"
              className="mt-4 text-[#F3EFF5] text-2xl"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}