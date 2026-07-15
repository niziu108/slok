'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatPLN, dostepneLabel, type HeroStats } from '@/lib/parcelFormat';

export default function Hero({ stats }: { stats?: HeroStats | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  // AUDIO (narracja o inwestycji)
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.currentTime || 0);
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    setDuration(a.duration || 0);
  };

  const seek = (sec: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(duration, Math.max(0, sec));
    setProgress(a.currentTime);
  };

  // dopasowanie wideo (cover bez zniekształceń)
  useEffect(() => {
    const wrap = wrapRef.current;
    const vid = vidRef.current;
    if (!wrap || !vid) return;

    const FIT = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const arWrap = w / h;
      const arVid = 16 / 9;

      if (arWrap < arVid) {
        vid.style.height = `${h}px`;
        vid.style.width = `${h * arVid}px`;
      } else {
        vid.style.width = `${w}px`;
        vid.style.height = `${w / arVid}px`;
      }

      vid.style.position = 'absolute';
      vid.style.top = '50%';
      vid.style.left = '50%';
      vid.style.transform = 'translate(-50%, -50%)';
    };

    const ro = new ResizeObserver(FIT);
    ro.observe(wrap);
    (window as any).visualViewport?.addEventListener('resize', FIT);
    FIT();

    return () => {
      ro.disconnect();
      (window as any).visualViewport?.removeEventListener('resize', FIT);
    };
  }, []);

  const mmss = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, '0')}`;
  };

  return (
    <section
      id="hero"
      ref={wrapRef}
      className="relative w-screen overflow-hidden bg-[#131313] min-h-[100svh] min-h-[100dvh]"
    >
      {/* WIDEO – tło */}
      <video
        ref={vidRef}
        src="/video/film.mp4"
        poster="/hero-poster.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        aria-hidden="true"
      />

      {/* Przyciemnienie pod tekst: mocniej u góry i u dołu, żeby treść była czytelna
          na każdej klatce filmu, nie tylko na ciemnych ujęciach. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(19,19,19,0.72) 0%, rgba(19,19,19,0.45) 42%, rgba(19,19,19,0.55) 72%, rgba(19,19,19,0.92) 100%)',
        }}
      />

      {/* AUDIO (narracja) */}
      <audio
        ref={audioRef}
        src="/slok.mp3"
        preload="none"
        onTimeUpdate={onTime}
        onLoadedMetadata={onLoaded}
        onEnded={() => setPlaying(false)}
      />

      {/* ---------- TREŚĆ ---------- */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pt-20 pb-28 text-center">
        <h1 className="font-evalinor uppercase text-[#F3EFF5] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
          <span className="block leading-[0.92] tracking-tight text-[clamp(2.1rem,6.4vw,5.4rem)]">
            Działki nad zalewem Słok
          </span>
          <span className="mt-3 block leading-tight tracking-[0.06em] text-[clamp(0.95rem,2vw,1.6rem)] text-[#F3EFF5]/85">
            9 km od Bełchatowa
          </span>
        </h1>

        {/* Stan oferty: liczony na serwerze, więc jest w HTML dla Google.
            Gdy brak danych, nie renderujemy nic zamiast zmyślać liczbę. */}
        {stats && (
          <p className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(0.95rem,1.5vw,1.2rem)] text-[#F3EFF5] drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]">
            <span className="font-semibold">{dostepneLabel(stats.dostepne)}</span>
            {stats.cenaOd !== null && (
              <>
                <span aria-hidden className="text-[#F3EFF5]/40">
                  ·
                </span>
                <span>
                  ceny od <span className="font-semibold">{formatPLN(stats.cenaOd)}</span>
                </span>
              </>
            )}
          </p>
        )}

        {/* CTA — jedno. Dwa przyciski konkurowały ze sobą i rozmywały decyzję. */}
        <div className="mt-9">
          <Link
            href="/wyszukiwarka"
            className="inline-flex items-center justify-center rounded-full bg-[#F3EFF5] px-10 py-4 text-sm uppercase tracking-[0.14em] text-[#131313] transition hover:bg-white active:scale-[0.99]"
          >
            Zobacz działki
          </Link>
        </div>
      </div>

      {/* ---------- NARRACJA (na dole, nie zabiera uwagi CTA) ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-5">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-5">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Zatrzymaj nagranie o inwestycji' : 'Odtwórz nagranie o inwestycji'}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#F3EFF5]/70 bg-[#131313]/60 text-[#F3EFF5] backdrop-blur-sm transition hover:bg-[#131313]/90"
          >
            {!playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7-11-7z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            )}
          </button>

          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#F3EFF5]/75">
              Posłuchaj o Osadzie Słok
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0.01)}
              step={0.1}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="mt-1 w-full accent-[#F3EFF5] cursor-pointer"
              aria-label="Przewijanie nagrania"
            />
          </div>

          {duration > 0 && (
            <span className="shrink-0 text-[11px] tabular-nums text-[#F3EFF5]/70">
              {mmss(progress)} / {mmss(duration)}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
