'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { dostepneLabel, type HeroStats } from '@/lib/parcelFormat';

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

  // Film ma chodzić w kółko, bez przerwy.
  //
  // Dwie rzeczy stoją temu na drodze. Po pierwsze, sam atrybut autoPlay bywa
  // ignorowany na iOS i w Chrome na Androidzie, więc play() trzeba wywołać z kodu.
  // Po drugie, przeglądarka pauzuje wideo za każdym razem, gdy karta idzie w tło,
  // gdy użytkownik przełączy aplikację albo przy oszczędzaniu energii, i sama go
  // potem nie wznawia.
  //
  // Żadna kontrolka na stronie nie zatrzymuje tego filmu, więc KAŻDA pauza jest
  // niepożądana i zawsze próbujemy wznowić. Wznawiamy tylko przy widocznej karcie,
  // bo w tle przeglądarka i tak odrzuci play(). Gdy autoplay jest zablokowany
  // systemowo (tryb niskiego zużycia energii na iPhonie), zostaje plakat.
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    // iOS odtworzy bez gestu użytkownika tylko materiał wyciszony.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    const resume = () => {
      if (!v.paused) return;
      if (document.visibilityState !== 'visible') return;
      const p = v.play();
      if (p && typeof p.then === 'function') p.catch(() => { /* czekamy na gest */ });
    };

    resume();

    // Nasłuch zostaje na stałe: film musi wrócić po każdym powrocie do karty,
    // nie tylko za pierwszym razem.
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('touchstart', resume, { passive: true });
    document.addEventListener('click', resume);
    window.addEventListener('scroll', resume, { passive: true });
    v.addEventListener('pause', resume);
    v.addEventListener('stalled', resume);

    // Siatka bezpieczeństwa na wypadek pauzy, która nie wyemitowała zdarzenia.
    const tick = setInterval(resume, 3000);

    return () => {
      document.removeEventListener('visibilitychange', resume);
      document.removeEventListener('touchstart', resume);
      document.removeEventListener('click', resume);
      window.removeEventListener('scroll', resume);
      v.removeEventListener('pause', resume);
      v.removeEventListener('stalled', resume);
      clearInterval(tick);
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
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center px-5 pb-6 pt-20 text-center md:pt-24">
        {/* GÓRA: nagłówek i liczba trzymają się razem, jako jeden blok.
            leading zbite i mała przerwa, żeby liczba była tuż pod tytułem. */}
        <div className="flex flex-col items-center gap-1">
          <h1
            className="font-evalinor uppercase leading-[0.82] tracking-tight text-[#F3EFF5] text-[clamp(2.1rem,6.6vw,5.4rem)]"
            style={{ textShadow: '0 2px 22px rgba(0,0,0,0.65), 0 1px 4px rgba(0,0,0,0.5)' }}
          >
            Działki nad zalewem Słok
          </h1>

          {/* Stan oferty: liczony na serwerze, więc jest w HTML dla Google.
              Gdy brak danych, nie renderujemy nic zamiast zmyślać liczbę. */}
          {stats && (
            <p
              className="text-[clamp(0.95rem,1.5vw,1.2rem)] tracking-[0.02em] text-[#F3EFF5]"
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.55)' }}
            >
              {dostepneLabel(stats.dostepne)}
            </p>
          )}
        </div>

        {/* ŚRODEK: celowo puste. Tu widać film. */}
        <div className="flex-1" />

        {/* DÓŁ: przycisk i narracja też jako jeden blok, z tym samym rytmem */}
        <div className="flex w-full flex-col items-center gap-5">
          <Link
            href="/wyszukiwarka"
            className="inline-flex items-center justify-center rounded-full bg-[#F3EFF5] px-10 py-4 text-sm uppercase tracking-[0.14em] text-[#131313] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition hover:bg-white active:scale-[0.99]"
          >
            Zobacz działki
          </Link>

          {/* Narracja: podpis wyśrodkowany w osobnej linii nad odtwarzaczem,
              więc nie jest już przesunięty względem przycisku wyżej. */}
          <div className="flex w-full max-w-xl flex-col items-center gap-2">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#F3EFF5]/75">
              Posłuchaj o Osadzie Słok
            </div>

            <div className="flex w-full items-center gap-3">
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

              <input
                type="range"
                min={0}
                max={Math.max(duration, 0.01)}
                step={0.1}
                value={progress}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="flex-1 accent-[#F3EFF5] cursor-pointer"
                aria-label="Przewijanie nagrania"
              />

              {duration > 0 && (
                <span className="shrink-0 text-[11px] tabular-nums text-[#F3EFF5]/70">
                  {mmss(progress)} / {mmss(duration)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
