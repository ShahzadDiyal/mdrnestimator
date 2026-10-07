import sharp from 'sharp';

const SRC = 'C:/Users/ahmed/Downloads/ChatGPT Image Sep 14, 2026, 11_49_50 AM.png';

const meta = await sharp(SRC).metadata();
console.log(`source: ${meta.width}x${meta.height}`);

const out = await sharp(SRC)
  .resize(1400, 1400, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/hero.jpg');

console.log(`hero.jpg: ${out.width}x${out.height}, ${Math.round(out.size / 1024)} KB`);
