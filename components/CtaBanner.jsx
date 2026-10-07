import Link from 'next/link';
import ChatButton from '@/components/ChatButton';

export default function CtaBanner() {
  return (
    <section className="py-20 sm:py-24">
      <div className="max-shell container-px">
        <div className="reveal relative overflow-hidden rounded-3xl bg-hero-gradient text-white p-10 sm:p-14 lg:p-20">
          <div aria-hidden className="absolute inset-0 grid-bg"></div>
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">Free Quote — No Obligation</span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Ready to win your next bid?</h2>
              <p className="mt-3 text-white/85 text-base sm:text-lg max-w-xl">Send us your plans today. Get a free, no-obligation quote in under 2 hours and a complete estimate in 8–24 hours.</p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link href="/contact" className="btn-primary w-full" style={{ background: '#fff', color: '#14284A' }}>Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <ChatButton className="btn-outline-light w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                Chat with us
              </ChatButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
