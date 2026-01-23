'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);

  // AUDIO
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // start 20%
  const [progress, setProgress] = useState(0); // sekundy
  const [duration, setDuration] = useState(0); // sekundy

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

  // zmiana głośności (pionowy slider)
  const changeVolume = (v: number) => {
    if (!audioRef.current) return;
    const val = Math.min(1, Math.max(0, v));
    audioRef.current.volume = val;
    setVolume(val);
  };

  // uaktualnianie postępu
  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.currentTime || 0);
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.2; // start 20%
    setVolume(0.2);
    setDuration(a.duration || 0);
  };

  // przewijanie z dolnego paska
  const seek = (sec: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(duration, Math.max(0, sec));
    setProgress(a.currentTime);
  };

  // dopasowanie wideo
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

  return (
    <section
      id="hero"
      ref={wrapRef}
      className="relative w-screen overflow-hidden bg-[#131313] min-h-[100svh] min-h-[100dvh]"
    >
      {/* WIDEO – Cloudinary */}
      <video
        ref={vidRef}
        src="https://res.cloudinary.com/dr4vmuq7v/video/upload/q_auto:good/film_lgxytw.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="https://res.cloudinary.com/dr4vmuq7v/video/upload/so_0/film_lgxytw.jpg"
        className="pointer-events-none"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* lekki filtr */}
      <div className="absolute inset-0 bg-black/10" />

      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="/slok.mp3"
        preload="none"
        onTimeUpdate={onTime}
        onLoadedMetadata={onLoaded}
        onEnded={() => setPlaying(false)}
      />

      {/* Kontrolki */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-10 flex flex-col items-center justify-end">
        <div className="absolute -z-[1] inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="pointer-events-auto flex items-center gap-6 px-5">
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Zatrzymaj' : 'Odtwórz'}
            className="grid h-14 w-14 place-items-center rounded-full border border-[#F3EFF5] bg-[#131313]/70 backdrop-blur-sm text-[#F3EFF5] transition hover:bg-[#131313]/90"
          >
            {!playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7-11-7z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            )}
          </button>

          <div className="hidden md:flex h-20 items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="h-20 w-4 accent-[#F3EFF5] cursor-pointer [writing-mode:vertical-rl] rotate-180"
              aria-label="Głośność"
            />
          </div>

          <p className="font-evalinor tracking-wide text-[16px] md:text-[18px] text-[#F3EFF5] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            Posłuchaj o <span className="uppercase">OSADZIE SŁOK</span>
          </p>
        </div>

        <div className="pointer-events-auto mt-4 w-[70vw] max-w-[800px]">
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.01)}
            step={0.1}
            value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full accent-[#F3EFF5] cursor-pointer"
            aria-label="Przewijanie"
          />
        </div>
      </div>
    </section>
  );
}