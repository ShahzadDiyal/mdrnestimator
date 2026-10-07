// STATIC_EXPORT=1 switches on a static HTML export (used by scripts/static-export.mjs).
// Normal `npm run dev` / `npm run build` are unaffected.
const isExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isExport ? { output: 'export', trailingSlash: true } : {}),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Static export can't run the image optimizer.
    ...(isExport ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
