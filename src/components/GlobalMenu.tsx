// src/components/GlobalMenu.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TargetId =
  | 'hero'
  | 'inwestycja'
  | 'lokalizacja'
  | 'dlainwestora'
  | 'galeria'
  | 'kontakt';

const LEFT_LINKS: { label: string; id: TargetId }[] = [
  { label: 'O INWESTYCJI', id: 'inwestycja' },
  { label: 'LOKALIZACJA', id: 'lokalizacja' },
  { label: 'DLA INWESTORA', id: 'dlainwestora' },
];

const RIGHT_LINKS: { label: string; id: TargetId }[] = [
  { label: 'GALERIA', id: 'galeria' },
  { label: 'KONTAKT', id: 'kontakt' },
];

function scrollToId(id: TargetId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Mobile button: hamburger ↔ krzyżyk (animowany) */
function MobileHamburgerToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
      onClick={onToggle}
      className="md:hidden flex items-center justify-center bg-transparent p-0"
      animate={{ rotate: open ? -90 : 0 }}
      transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-10 h-10 text-[#d9d9d9]">
        {/* BURGER */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.92 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <BurgerIcon className="w-7 h-7" />
        </motion.div>

        {/* X */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.92 }}
          transition={{ duration: 0.2, delay: open ? 0.06 : 0 }}
        >
          <CrossIcon className="w-7 h-7" />
        </motion.div>
      </div>
    </motion.button>
  );
}

export default function GlobalMenu() {
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(true);
  const lastY = useRef(0);
  const pathname = usePathname();
  const onHome = pathname === '/' || pathname === '';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y < 10) setShowBar(true);
      else setShowBar(y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleNav = (id: TargetId) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 10);
  };

  const linkCls =
    'font-evalinor text-[17px] leading-none tracking-[0.06em] hover:opacity-80 transition-opacity';

  return (
    <>
      {/* DESKTOP NAV (grid: 1fr auto 1fr → logo zawsze w centrum) */}
      <div
        className={`hidden md:block fixed top-0 left-0 right-0 z-[96]
          transition-transform duration-300 will-change-transform
          ${showBar ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="bg-[#131313]">
          <nav
            className="mx-auto max-w-7xl px-5 h-16 text-[#d9d9d9]"
            aria-label="Główna nawigacja"
          >
            <div className="h-full grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* LEFT */}
              <ul className="flex items-center gap-6 justify-self-start">
                {LEFT_LINKS.map((item) => (
                  <li key={item.id}>
                    {onHome ? (
                      <button onClick={() => handleNav(item.id)} className={linkCls}>
                        {item.label}
                      </button>
                    ) : (
                      <Link href={`/#${item.id}`} className={linkCls}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* CENTER LOGO */}
              <Link
                href="/#hero"
                aria-label="Powrót do sekcji hero"
                className="justify-self-center shrink-0"
              >
                <Image
                  src="/herologo.webp"
                  alt="OSADA SŁOK"
                  width={72}
                  height={24}
                  className="object-contain invert"
                  priority
                />
              </Link>

              {/* RIGHT */}
              <ul className="flex items-center gap-6 justify-self-end">
                {RIGHT_LINKS.map((item) => (
                  <li key={item.id}>
                    {onHome ? (
                      <button onClick={() => handleNav(item.id)} className={linkCls}>
                        {item.label}
                      </button>
                    ) : (
                      <Link href={`/#${item.id}`} className={linkCls}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link href="/wyszukiwarka" className={linkCls}>
                    WYSZUKIWARKA
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* MOBILE: cienki pasek tła */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#131313]/100 z-[99] border-b border-white/10 pointer-events-none" />

      {/* MOBILE: pasek z logo w środku + hamburger po prawej */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 z-[100]">
        <div className="relative h-full flex items-center">
          {/* Logo — zostaje jak jest (statycznie w tej pozycji) */}
          <Link
            href="/#hero"
            aria-label="Powrót do sekcji hero"
            className="absolute left-1/2 -translate-x-1/2"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/herologo.webp"
              alt="OSADA SŁOK"
              width={56}
              height={22}
              className="object-contain invert"
              priority
            />
          </Link>

          {/* Hamburger po prawej — robi to co wcześniej logo */}
          <div className="ml-auto pr-4">
            <MobileHamburgerToggle open={open} onToggle={() => setOpen((s) => !s)} />
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="mobile-overlay"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[90] bg-[#131313] text-[#d9d9d9]"
            aria-modal="true"
            role="dialog"
          >
            <button
              aria-hidden
              onClick={() => setOpen(false)}
              className="absolute inset-0 -z-10"
            />

            <nav className="relative h-full w-full px-6 pt-16 pb-24">
              <ul className="h-full flex flex-col items-center justify-center gap-6 text-center">
                {LEFT_LINKS.map((item) => (
                  <li key={item.id}>
                    {onHome ? (
                      <button
                        onClick={() => handleNav(item.id)}
                        className="font-evalinor w-full text-[#d9d9d9] text-3xl sm:text-4xl tracking-[0.04em] hover:opacity-85 transition-opacity"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        href={`/#${item.id}`}
                        onClick={() => setOpen(false)}
                        className="font-evalinor w-full text-[#d9d9d9] text-3xl sm:text-4xl tracking-[0.04em] hover:opacity-85 transition-opacity"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}

                {RIGHT_LINKS.map((item) => (
                  <li key={item.id}>
                    {onHome ? (
                      <button
                        onClick={() => handleNav(item.id)}
                        className="font-evalinor w-full text-[#d9d9d9] text-3xl sm:text-4xl tracking-[0.04em] hover:opacity-85 transition-opacity"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        href={`/#${item.id}`}
                        onClick={() => setOpen(false)}
                        className="font-evalinor w-full text-[#d9d9d9] text-3xl sm:text-4xl tracking-[0.04em] hover:opacity-85 transition-opacity"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}

                <li>
                  <Link
                    href="/wyszukiwarka"
                    onClick={() => setOpen(false)}
                    className="font-evalinor w-full text-[#d9d9d9] text-3xl sm:text-4xl tracking-[0.04em] hover:opacity-85 transition-opacity"
                  >
                    WYSZUKIWARKA
                  </Link>
                </li>
              </ul>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Link
                  href="/#hero"
                  aria-label="Powrót do sekcji hero"
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  <Image
                    src="/herologo.webp"
                    alt="OSADA SŁOK"
                    width={120}
                    height={36}
                    className="mx-auto object-contain invert"
                    priority
                  />
                </Link>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}