import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Stats from '@/components/Stats';
import WhyChooseUs from '@/components/WhyChooseUs';
import CtaBanner from '@/components/CtaBanner';
import { getAboutPage, getSeoPage, toArray, toParagraphs, socialMeta, pageRobots } from '@/lib/site';

// Fresh data at most a minute old — admin edits go live quickly,
// pages stay fast and fully server-rendered for SEO.
export const revalidate = 60;

export async function generateMetadata() {
  const seo = await getSeoPage('/about');
  const title = seo?.title || 'About Us — Modern Estimator';
  const description =
    seo?.description ||
    'Modern Estimator is a US construction estimating company delivering accurate, CSI-coded quantity takeoffs and bid-ready estimates with a 8–24 hour turnaround.';
  return {
    title,
    description,
    robots: await pageRobots('/about'),
    alternates: { canonical: '/about' },
    ...socialMeta({ title, description, path: '/about' }),
  };
}

const FALLBACK = {
  headerEyebrow: 'About Us',
  headerTitle: 'Your estimating partner, from plans to bid',
  headerSubtitle:
    'Modern Estimator helps contractors and builders across the United States bid faster, win more work and protect their margins with accurate, defensible numbers.',
  whoEyebrow: 'Who We Are',
  whoHeading: 'Built by estimators, for contractors',
  paragraphs: [
    'Modern Estimator was founded by senior cost estimators who spent years inside general contracting and trade firms — and saw how often good contractors lost good work to slow, inconsistent bidding.',
    'Today we act as an extension of your pre-construction team. We take in your drawings and specifications, perform detailed CSI-coded takeoffs, price every line with current regional cost data, and hand back a clean, bid-ready estimate in 8–24 hours.',
    'From single-family homes to multi-million-dollar commercial builds, our mission is simple: give you numbers you can defend, on a deadline you can count on.',
  ],
  highlights: [
    'Senior estimators with 12+ years of experience',
    'Coverage across all 50 states and every CSI division',
    'Estimates accurate to within ±2%',
    'Standard 8–24 hour turnaround, rush options available',
    'NDA on every project — your plans stay private',
    'Dedicated estimator and direct line on every job',
  ],
  mission:
    'To make accurate, professional estimating accessible to every contractor — so winning the next bid comes down to the work, not the paperwork.',
  vision:
    'To be the most trusted estimating partner in the US construction industry — known for accuracy, speed and numbers contractors can stand behind.',
};

export default async function AboutPage() {
  const live = await getAboutPage();
  const a = {
    headerEyebrow: live?.headerEyebrow || FALLBACK.headerEyebrow,
    headerTitle: live?.headerTitle || FALLBACK.headerTitle,
    headerSubtitle: live?.headerSubtitle || FALLBACK.headerSubtitle,
    whoEyebrow: live?.whoEyebrow || FALLBACK.whoEyebrow,
    whoHeading: live?.whoHeading || FALLBACK.whoHeading,
    paragraphs: live ? toParagraphs(live.paragraphs) : FALLBACK.paragraphs,
    highlights: live ? toArray(live.highlights) : FALLBACK.highlights,
    mission: live?.mission || FALLBACK.mission,
    vision: live?.vision || FALLBACK.vision,
  };
  if (!a.paragraphs.length) a.paragraphs = FALLBACK.paragraphs;
  if (!a.highlights.length) a.highlights = FALLBACK.highlights;

  return (
    <>
      <PageHeader
        eyebrow={a.headerEyebrow}
        title={a.headerTitle}
        subtitle={a.headerSubtitle}
        crumbs={[{ label: 'About Us' }]}
      />

      <Stats />

      {/* Who we are */}
      <section className="py-20 sm:py-24">
        <div className="max-shell container-px grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 reveal">
            <span className="eyebrow">{a.whoEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{a.whoHeading}</h2>
            <div className="mt-5 space-y-4 text-base sm:text-lg text-ink-700 leading-relaxed">
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link href="/contact" className="btn-primary mt-8">Work with us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="lg:col-span-5 reveal">
            <div className="rounded-2xl border-2 border-brand-100 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold">Why contractors choose us</h3>
              <ul className="mt-5 space-y-3">
                {a.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span className="text-sm font-medium text-ink-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-4">
        <div className="max-shell container-px grid gap-6 md:grid-cols-2">
          <div className="reveal rounded-2xl border-2 border-brand-100 bg-white p-7">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-brand-700 text-white"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
            <h3 className="mt-5 text-xl font-bold">Our mission</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">{a.mission}</p>
          </div>
          <div className="reveal rounded-2xl border-2 border-brand-100 bg-white p-7">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-accent-500 text-white"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></span>
            <h3 className="mt-5 text-xl font-bold">Our vision</h3>
            <p className="mt-2 text-ink-600 leading-relaxed">{a.vision}</p>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <CtaBanner />
    </>
  );
}
