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

  // Autoodtwarzanie na telefonie.
  // Sam atrybut autoPlay nie wystarcza: iOS i Chrome na Androidzie regularnie
  // go ignorują i trzeba wywołać play() z kodu. Dodatkowo play() bywa odrzucone,
  // gdy strona nie jest jeszcze widoczna, więc ponawiamy przy pierwszym dotknięciu
  // i po powrocie do karty. Gdy mimo wszystko się nie uda (np. tryb niskiego
  // zużycia energii na iPhonie blokuje autoplay systemowo), zostaje plakat.
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    // iOS odtworzy bez gestu użytkownika tylko materiał wyciszony.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    let done = false;
    const tryPlay = () => {
      if (done) return;
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { done = true; }).catch(() => { /* czekamy na gest */ });
      }
    };

    tryPlay();

    const onVisible = () => { if (document.visibilityState === 'visible') tryPlay(); };
    const onGesture = () => tryPlay();

    document.addEventListener('visibilitychange', onVisible);
    document.addEventListener('touchstart', onGesture, { passive: true });
    document.addEventListener('click', onGesture);
    window.addEventListener('scroll', onGesture, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      document.removeEventListener('touchstart', onGesture);
      document.removeEventListener('click', onGesture);
      window.removeEventListener('scroll', onGesture);
    };
  }, []);

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
        src="/video/film-hd.mp4"
        poster="/hero-poster-hd.webp"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        aria-hidden="true"
      />

      {/* Film jest bohaterem tego ekranu, więc NIE przyciemniamy go w całości.
          Cień kładziemy tylko tam, gdzie faktycznie leży tekst: wąski pas u góry
          i u dołu. Środek kadru zostaje czysty. Czytelność liter niesie przede
          wszystkim text-shadow na samym tekście, nie zasłona na obrazie. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(19,19,19,0.50) 0%, rgba(19,19,19,0.14) 22%, rgba(19,19,19,0) 38%, rgba(19,19,19,0) 58%, rgba(19,19,19,0.20) 78%, rgba(19,19,19,0.62) 100%)',
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

      {/* ---------- TREŚĆ ----------
          Układ: tekst przy górnej krawędzi, przycisk przy dolnej, środek pusty.
          Dzięki temu środek kadru filmu nie jest niczym zasłonięty. */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-5 pb-3 pt-[calc(3.5rem+1.25rem)] text-center md:pt-24">
        {/* GÓRA */}
        <h1
          className="font-evalinor uppercase leading-[0.92] tracking-tight text-[#F3EFF5] text-[clamp(2.1rem,6.6vw,5.4rem)]"
          style={{ textShadow: '0 2px 22px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.5)' }}
        >
          Działki nad zalewem Słok
        </h1>

        {/* Stan oferty: liczony na serwerze, więc jest w HTML dla Google.
            Gdy brak danych, nie renderujemy nic zamiast zmyślać liczbę. */}
        {stats && (
          <p
            className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[clamp(0.95rem,1.5vw,1.2rem)] text-[#F3EFF5]"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.55)' }}
          >
            <span className="font-semibold">{dostepneLabel(stats.dostepne)}</span>
            {stats.cenaOd !== null && (
              <>
                <span aria-hidden className="text-[#F3EFF5]/50">
                  ·
                </span>
                <span>
                  ceny od <span className="font-semibold">{formatPLN(stats.cenaOd)}</span>
                </span>
              </>
            )}
          </p>
        )}

        {/* ŚRODEK: celowo puste. Tu widać film. */}
        <div className="flex-1" />

        {/* DÓŁ: przycisk bezpośrednio nad narracją */}
        <Link
          href="/wyszukiwarka"
          className="inline-flex items-center justify-center rounded-full bg-[#F3EFF5] px-10 py-4 text-sm uppercase tracking-[0.14em] text-[#131313] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition hover:bg-white active:scale-[0.99]"
        >
          Zobacz działki
        </Link>

        {/* NARRACJA — tuż pod przyciskiem */}
        <div className="mt-4 flex w-full max-w-xl items-center gap-3">
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
