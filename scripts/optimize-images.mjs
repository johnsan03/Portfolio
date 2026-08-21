/**
 * Downscales the oversized hero avatars.
 *
 * The originals are 2048x2048 PNGs (~5.8MB each) for an image rendered at
 * 300px. 600px covers a 2x display; WebP is the primary, PNG the fallback.
 */
import sharp from 'sharp';
import fs from 'node:fs';

const SIZE = 600;
const jobs = [
  { src: 'src/assets/Light.png', base: 'src/assets/profile-light' },
  { src: 'src/assets/Dark.png', base: 'src/assets/profile-dark' },
];

for (const { src, base } of jobs) {
  const before = fs.statSync(src).size;
  await sharp(src).resize(SIZE, SIZE, { fit: 'cover' }).webp({ quality: 82 }).toFile(`${base}.webp`);
  await sharp(src).resize(SIZE, SIZE, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toFile(`${base}.png`);
  const w = fs.statSync(`${base}.webp`).size;
  const p = fs.statSync(`${base}.png`).size;
  console.log(
    `${src.padEnd(22)} ${(before / 1048576).toFixed(2)}MB -> webp ${(w / 1024).toFixed(1)}KB / png ${(p / 1024).toFixed(1)}KB  (${(100 - (w / before) * 100).toFixed(1)}% smaller)`,
  );
}
