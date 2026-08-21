/**
 * Theme-aware paint settings for the canvas effects.
 *
 * The effects were ported from a dark-only page and painted with
 * `globalCompositeOperation = 'lighter'` (additive) using near-white strokes.
 * Additive blending is a no-op on a near-white background, so in light mode
 * those strokes were mathematically invisible. Light mode therefore paints
 * normally with dark, saturated ink instead.
 */

const num = (raw, fallback) => {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? fallback : n;
};

export function readPaint() {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const v = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  const dark = root.getAttribute('data-theme') === 'dark';

  return {
    dark,
    // Additive only makes sense over a dark ground.
    composite: dark ? 'lighter' : 'source-over',
    boltGlow: v('--fx-bolt-glow', '56, 189, 248'),
    boltCore: v('--fx-bolt-core', '226, 245, 255'),
    boltGlowAlpha: num(v('--fx-bolt-glow-a', ''), 0.16),
    boltCoreAlpha: num(v('--fx-bolt-core-a', ''), 0.85),
    boltCoreWidth: num(v('--fx-bolt-core-w', ''), 1.8),
    boltGlowWidth: num(v('--fx-bolt-glow-w', ''), 6),
    moteA: v('--fx-mote-a', '56, 189, 248'),
    moteB: v('--fx-mote-b', '45, 212, 191'),
    moteAlpha: num(v('--fx-mote-alpha', ''), 1),
    moteSize: num(v('--fx-mote-size', ''), 1),
  };
}

/** Calls `cb` whenever the theme flips. Returns an unsubscribe function. */
export function onThemeChange(cb) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => mo.disconnect();
}
