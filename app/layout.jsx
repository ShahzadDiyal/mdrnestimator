import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { getSiteSeo } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

// Site-wide SEO defaults (Website Content → Site SEO), with the current
// static values as fallback so metadata never degrades.
export async function generateMetadata() {
  const s = await getSiteSeo();
  const title = s?.ogTitle || 'Modern Estimator — USA Construction Estimation Services';
  const description =
    s?.ogDescription ||
    'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.';
  return {
    metadataBase: new URL(s?.siteUrl || 'https://modernestimator.com'),
    title,
    description,
    keywords: (s?.keywords || 'construction estimation, quantity takeoff, material estimation, bid preparation, residential estimation, commercial estimation, US contractors')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),
    alternates: { canonical: '/' },
    openGraph: {
      type: s?.ogType || 'website',
      locale: s?.ogLocale || 'en_US',
      url: s?.siteUrl || 'https://modernestimator.com',
      siteName: s?.ogSiteName || 'Modern Estimator',
      title,
      description: s?.ogDescription || description,
      ...(s?.ogImage ? { images: [s.ogImage] } : {}),
    },
    twitter: {
      card: s?.twitterCard || 'summary_large_image',
      title: s?.twitterTitle || title,
      description: s?.twitterDescription || description,
    },
    robots: { index: s?.robotsIndex !== false, follow: s?.robotsFollow !== false },
    // Search Console / Bing verification — managed in Site SEO.
    verification: {
      ...(s?.googleVerification ? { google: s.googleVerification } : {}),
      ...(s?.bingVerification ? { other: { 'msvalidate.01': s.bingVerification } } : {}),
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  // GA4 measurement ID — managed in Site SEO. Script loads only when set.
  const s = await getSiteSeo();
  const gaId = (s?.gaMeasurementId || '').trim();
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-ink-900 font-sans">
        {children}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
