import { useEffect, useRef, useState } from 'react';

const DURATION = 1400;

/**
 * Boot overlay: monogram fades in, a progress rail fills, a flash fires, then
 * the panel slides away and unmounts. Shown once per tab session so returning
 * to the page mid-visit doesn't replay it.
 */
const Preloader = () => {
  const [mounted, setMounted] = useState(() => {
    try {
      return sessionStorage.getItem('fx-preloaded') !== '1';
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);

  const fillRef = useRef(null);
  const countRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    if (!mounted) return undefined;

    try {
      sessionStorage.setItem('fx-preloaded', '1');
    } catch {
      /* private mode — just replay it next time */
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduced ? 300 : DURATION;

    // Nothing behind the overlay should scroll while it is up.
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => setReady(true));

    let rafId = 0;
    let finished = false;
    const t0 = performance.now();
    const timers = [];

    const step = (now) => {
      if (finished) return;
      const p = Math.min(1, (now - t0) / total);
      const pct = Math.round(p * 100);
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (countRef.current) countRef.current.textContent = `INITIALIZING · ${pct}%`;
      if (p < 1) {
        rafId = requestAnimationFrame(step);
        return;
      }
      finished = true;
      const flash = flashRef.current;
      if (flash && !reduced) {
        flash.style.transition = 'opacity 60ms linear';
        flash.style.opacity = '0.9';
        timers.push(
          setTimeout(() => {
            flash.style.transition = 'opacity 350ms ease';
            flash.style.opacity = '0';
          }, 60),
        );
      }
      timers.push(setTimeout(() => setLeaving(true), reduced ? 0 : 220));
      timers.push(setTimeout(() => setMounted(false), reduced ? 120 : 980));
    };
    rafId = requestAnimationFrame(step);

    // Watchdog. requestAnimationFrame is suspended in a hidden/background tab,
    // so without this the overlay could sit there holding the scroll lock on a
    // page the visitor never sees running. Timers still fire when hidden.
    timers.push(
      setTimeout(() => {
        if (finished) return;
        finished = true;
        setLeaving(true);
        timers.push(setTimeout(() => setMounted(false), 800));
      }, total + 1500),
    );

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={`fx-pre${leaving ? ' is-leaving' : ''}${ready ? ' is-ready' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="fx-pre__mark">MJ</div>
      <div className="fx-pre__bar">
        <i ref={fillRef} />
      </div>
      <div className="fx-pre__count" ref={countRef}>
        INITIALIZING · 0%
      </div>
      <div className="fx-pre__flash" ref={flashRef} />
    </div>
  );
};

export default Preloader;
