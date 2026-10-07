import sharp from 'sharp';

const FILES = [
  ['C:/Users/ahmed/Downloads/8a11dd44943575a58d7339fdaa386381.jpg', 'public/review-1.png'],
  ['C:/Users/ahmed/Downloads/9bbda1b71859496b5e5020249c28a13f.jpg', 'public/review-2.png'],
  ['C:/Users/ahmed/Downloads/eaac0f4c2afdd3393029c44fbabb12f8.jpg', 'public/review-3.png'],
];

for (const [src, dest] of FILES) {
  const out = await sharp(src)
    .resize(256, 256, { fit: 'cover', position: 'top' })
    .png()
    .toFile(dest);
  console.log(`${dest}: ${out.width}x${out.height}`);
}
