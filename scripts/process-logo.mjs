import sharp from 'sharp';

const SRC = 'public/logo-raw.png';

// 1. Make near-white pixels transparent, 2. trim the transparent border.
const base = sharp(SRC).ensureAlpha();
const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r > 240 && g > 240 && b > 240) {
    data[i + 3] = 0; // fully transparent
  }
}

const out = await sharp(data, { raw: { width, height, channels } })
  .png()
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
  .toFile('public/logo.png');

console.log(`Source: ${width}x${height} -> trimmed logo: ${out.width}x${out.height}`);
