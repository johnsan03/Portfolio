import { useEffect, useRef } from 'react';
import { readPaint, onThemeChange } from '../utils/fxPaint';

/**
 * Scroll-driven "crack" reveal for a single section.
 *
 * The earlier implementation inserted a 150vh pinned panel between every
 * section, which added ~13 screens of empty scrolling to the page. This
 * version attaches the effect to the real section instead: the wrapper adds no
 * height at all, and the jagged edge sweeps across as the section enters view.
 *
 * The reveal is scrubbed on the way in, then latches once complete so
 * scrolling back up never hides content that has already been read.
 */

const N = 20;

function buildBolt(x1, y1, x2, y2, disp, detail) {
  let pts = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
  for (let d = 0; d < detail; d += 1) {
    const np = [];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = pts[i];
      const b = pts[i + 1];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const nx = -(b.y - a.y);
      const ny = b.x - a.x;
      const len = Math.hypot(nx, ny) || 1;
      const off = (Math.random() - 0.5) * disp;
      np.push(a, { x: mx + (nx / len) * off, y: my + (ny / len) * off });
    }
    np.push(pts[pts.length - 1]);
    pts = np;
    disp *= 0.55;
  }
  return pts;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

const SectionReveal = ({ children, disabled = false }) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || disabled) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    // Jagged edge profile, stable for the life of this section.
    const offsets = Array.from({ length: N + 1 }, () => (Math.random() - 0.5) * 7);

    let canvas = null;
    let ctx = null;
    let bolts = [];
    let rafId = 0;
    let running = false;
    let done = false;
    let lastT = 0;
    let lastStrike = 0;
    const t0 = performance.now();
    let paint = readPaint();
    const stopThemeWatch = onThemeChange(() => {
      paint = readPaint();
    });

    const ensureCanvas = () => {
      if (canvas) return;
      canvas = document.createElement('canvas');
      canvas.className = 'fx-reveal__fx';
      canvas.setAttribute('aria-hidden', 'true');
      wrap.appendChild(canvas);
      ctx = canvas.getContext('2d');
    };

    const sizeCanvas = () => {
      if (!canvas) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const clipFor = (t, time) => {
      const cut = t * 118 - 9;
      const jit = t > 0 && t < 1 ? 1.6 : 0;
      const pts = [];
      for (let i = 0; i <= N; i += 1) {
        const y = (i / N) * 100;
        const x = cut + offsets[i] + Math.sin(time * 3 + i * 0.9) * jit;
        pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
      }
      // Keep the already-revealed (left) side visible.
      return `polygon(0% 0%, ${pts.join(', ')}, 0% 100%)`;
    };

    const readProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // Sweep across while the section travels from just below the fold up
      // through the middle of the viewport.
      const from = vh * 0.92;
      const to = vh * 0.3;
      return clamp01((from - rect.top) / (from - to));
    };

    const spawnBolt = (xPct, big) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const x = (xPct / 100) * w;
      const segs = buildBolt(x, -10, x + (Math.random() - 0.5) * 70, h + 10, big ? 46 : 26, 6);
      bolts.push({ segs, life: 1, big });
    };

    const strokePath = (pts) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    };

    const finish = () => {
      done = true;
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      // Release the clip entirely: a lingering clip-path on a large element
      // keeps it on its own layer and clips descendants for no reason.
      wrap.style.clipPath = '';
      wrap.classList.add('is-revealed');
      if (canvas) {
        canvas.remove();
        canvas = null;
        ctx = null;
      }
      bolts = [];
    };

    const frame = () => {
      if (done) return;
      const time = (performance.now() - t0) * 0.001;
      const t = readProgress();

      if (t >= 1) {
        finish();
        return;
      }

      wrap.style.clipPath = clipFor(t, time);

      const now = performance.now();
      const moving = Math.abs(t - lastT) > 0.003;
      if (moving && t > 0.02 && now - lastStrike > 90) {
        spawnBolt(t * 118 - 9, t > 0.5);
        lastStrike = now;
      }
      lastT = t;

      if (bolts.length) {
        ensureCanvas();
        if (canvas.width === 0) sizeCanvas();
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = paint.composite;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (let i = bolts.length - 1; i >= 0; i -= 1) {
          const b = bolts[i];
          ctx.strokeStyle = `rgba(${paint.boltGlow}, ${paint.boltGlowAlpha * b.life})`;
          ctx.lineWidth = b.big ? paint.boltGlowWidth * 1.5 : paint.boltGlowWidth;
          strokePath(b.segs);
          ctx.strokeStyle = `rgba(${paint.boltCore}, ${paint.boltCoreAlpha * b.life})`;
          ctx.lineWidth = paint.boltCoreWidth;
          strokePath(b.segs);
          b.life -= 0.09;
          if (b.life <= 0) bolts.splice(i, 1);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      if (running) rafId = requestAnimationFrame(frame);
      else rafId = 0;
    };

    // Only run while the section is anywhere near the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (done) return;
        running = entry.isIntersecting;
        if (running && !rafId) rafId = requestAnimationFrame(frame);
        else if (!running && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '25% 0px' },
    );
    io.observe(wrap);

    // A section fully past the fold on load (deep link / restored scroll)
    // should just be visible, never stuck mid-crack.
    if (readProgress() >= 1) finish();

    const onResize = () => sizeCanvas();
    window.addEventListener('resize', onResize);

    return () => {
      io.disconnect();
      stopThemeWatch();
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (canvas) canvas.remove();
      wrap.style.clipPath = '';
    };
  }, [disabled]);

  return (
    <div className="fx-reveal" ref={wrapRef}>
      {children}
    </div>
  );
};

export default SectionReveal;
