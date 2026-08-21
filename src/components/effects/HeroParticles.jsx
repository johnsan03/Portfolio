import { useEffect } from 'react';
import { readPaint, onThemeChange } from '../../utils/fxPaint';

/**
 * Rising chakra-style motes over the hero.
 *
 * The canvas is created and attached to the existing #home section rather than
 * rendered inside <Hero />, so the hero's own markup stays untouched.
 */
const HeroParticles = () => {
  useEffect(() => {
    const host = document.getElementById('home');
    if (!host) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const canvas = document.createElement('canvas');
    canvas.className = 'fx-motes';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let parts = [];
    let rafId = 0;
    let running = false;

    // Motes are tinted from the live theme tokens, so the toggle restyles them.
    let paint = readPaint();
    let palette = [paint.moteA, paint.moteB];
    const readPalette = () => {
      paint = readPaint();
      palette = [paint.moteA, paint.moteB];
      parts.forEach((p) => {
        p.col = Math.random() < 0.6 ? palette[0] : palette[1];
      });
    };

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      parts = [];
      const n = Math.floor(w / 30);
      for (let i = 0; i < n; i += 1) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.8,
          vy: -(0.15 + Math.random() * 0.45),
          vx: (Math.random() - 0.5) * 0.2,
          a: 0.1 + Math.random() * 0.3,
          tw: Math.random() * Math.PI * 2,
          col: Math.random() < 0.6 ? palette[0] : palette[1],
        });
      }
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    readPalette();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const frame = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // ResizeObserver doesn't deliver in a hidden tab, so a bad mount-time
      // measurement would stick forever. Re-check cheaply each frame.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w && h && canvas.width !== Math.round(w * dpr)) resize();
      ctx.clearRect(0, 0, w, h);
      // Additive blending vanishes on a pale background; light mode paints
      // normally with the darker accent instead.
      ctx.globalCompositeOperation = paint.composite;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.04;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        const twk = 0.5 + 0.5 * Math.sin(p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * paint.moteSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col}, ${p.a * twk * paint.moteAlpha})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (running) rafId = requestAnimationFrame(frame);
      else rafId = 0;
    };

    // Idle once the hero is scrolled away.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !rafId) rafId = requestAnimationFrame(frame);
        else if (!running && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '10% 0px' },
    );
    io.observe(canvas);

    const stopThemeWatch = onThemeChange(readPalette);

    return () => {
      io.disconnect();
      resizeObserver.disconnect();
      stopThemeWatch();
      if (rafId) cancelAnimationFrame(rafId);
      canvas.remove();
    };
  }, []);

  return null;
};

export default HeroParticles;
