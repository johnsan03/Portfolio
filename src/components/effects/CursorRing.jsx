import { useEffect, useRef } from 'react';

/**
 * Trailing cursor ring that swells over interactive elements.
 *
 * Only mounts for real pointers — touch devices keep their native behaviour
 * and never see the ring (also enforced in CSS).
 */
const CursorRing = () => {
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return undefined;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let rafId = 0;
    let shown = false;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!shown) {
        shown = true;
        ring.classList.add('is-visible');
      }
    };

    // Follow with a slight lag so the ring reads as a physical object.
    const frame = () => {
      const ease = reduced ? 1 : 0.18;
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';
    const onOver = (e) => {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) {
        ring.classList.add('is-big');
      }
    };
    const onOut = (e) => {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) {
        ring.classList.remove('is-big');
      }
    };
    const onLeave = () => {
      shown = false;
      ring.classList.remove('is-visible');
    };

    // Delegated, so elements added later (modals, game boards) are covered.
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <div className="fx-cursor" ref={ringRef} aria-hidden="true" />;
};

export default CursorRing;
