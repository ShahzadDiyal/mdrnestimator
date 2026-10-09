import Hero from '@/components/Hero';
import { notFound } from 'next/navigation';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import TradesPreview from '@/components/TradesPreview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import CtaBanner from '@/components/CtaBanner';
import { pageRobots, getVisibility } from '@/lib/site';

// Homepage indexability toggle (Website Content → Crawling & Indexing).
// Title/description/OG come from the root layout's Site SEO defaults.
export async function generateMetadata() {
  return { robots: await pageRobots('/') };
}

export default async function Home() {
  // Visibility toggle — hidden pages 404 (Website Content → Visibility).
  const __vis = await getVisibility();
  if (__vis?.pages?.['home'] === false) notFound();
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <TradesPreview />
      <WhyChooseUs />
      <Process />
      <Portfolio />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
