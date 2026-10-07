import sharp from 'sharp';

const SRC = 'C:/Users/ahmed/Downloads/ChatGPT Image Jun 21, 2026, 11_06_18 PM.png';

const out = await sharp(SRC)
  .resize(256, 256, { fit: 'cover', position: 'top' })
  .png()
  .toFile('public/agent.png');

console.log(`Avatar saved: ${out.width}x${out.height}`);
