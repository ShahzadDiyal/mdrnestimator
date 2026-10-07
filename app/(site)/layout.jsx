// Marketing-site chrome (navbar, footer, chatbot). Unchanged —
// the move into the (site) route group keeps every public URL identical
// while letting /admin render without the marketing chrome.
import { Suspense } from 'react';
import JsonLd from '@/components/JsonLd';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import ScrollEffects from '@/components/ScrollEffects';

export default function SiteLayout({ children }) {
  return (
    <>
      {/* Streamed separately so it never delays the page's first paint. */}
      <Suspense>
        <JsonLd />
      </Suspense>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatBot />
      <ScrollEffects />
    </>
  );
}
