import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://modernestimator.com'),
  title: 'Modern Estimator — USA Construction Estimation Services',
  description:
    'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.',
  keywords: [
    'construction estimation',
    'quantity takeoff',
    'material estimation',
    'bid preparation',
    'residential estimation',
    'commercial estimation',
    'US contractors',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://modernestimator.com',
    siteName: 'Modern Estimator',
    title: 'Modern Estimator — USA Construction Estimation Services',
    description:
      'Quantity takeoffs, material estimation and bid preparation for residential and commercial projects across the United States. Fast turnarounds. Bank-grade accuracy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Estimator — USA Construction Estimation Services',
    description:
      'Premium construction estimation services for US contractors. 8–24 hour turnaround. Accurate to ±2%.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-ink-900 font-sans">{children}</body>
    </html>
  );
}
