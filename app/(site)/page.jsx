import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import TradesPreview from '@/components/TradesPreview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Faq from '@/components/Faq';
import CtaBanner from '@/components/CtaBanner';

export default function Home() {
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
