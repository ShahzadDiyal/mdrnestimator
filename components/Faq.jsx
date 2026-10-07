'use client';

import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from '@/lib/useSiteContent';

const FALLBACK_FAQS = [
  {
    id: 'fb-faq-1',
    q: 'How long does an estimate take?',
    a: 'Standard turnaround is 8–24 hours from receipt of complete plans. Larger commercial projects may take 3–5 business days. Rush options are available for urgent bids.',
  },
  {
    id: 'fb-faq-2',
    q: 'What information do you need from me?',
    a: 'Architectural and structural drawings (PDF or DWG), specifications when available, scope notes and your bid deadline. We handle the rest.',
  },
  {
    id: 'fb-faq-3',
    q: "What's included in the deliverable?",
    a: 'A CSI-coded Excel workbook with quantities, unit costs, labor and materials, plus a PDF summary, marked-up plans and an executive summary. Bid-ready, every time.',
  },
  {
    id: 'fb-faq-4',
    q: 'Do you cover all 50 states?',
    a: 'Yes. We maintain regional cost databases for all 50 states and adjust labor and material pricing to local markets.',
  },
  {
    id: 'fb-faq-5',
    q: 'How do you price your services?',
    a: 'Pricing depends on project size, scope and timeline. Most residential takeoffs start at $250 and commercial projects start at $500. Send us your plans for a free quote.',
  },
  {
    id: 'fb-faq-6',
    q: 'Are revisions included?',
    a: 'Yes — minor revisions and clarifications are included for 30 days after delivery. Major scope changes are quoted separately.',
  },
];

export default function Faq() {
  const content = useSiteContent();
  const [openIndex, setOpenIndex] = useState(0);

  // Admin can hide this section from Website Content → Visibility.
  if (content && content.loaded && content.sections?.faq === false) return null;

  const live = !!(content && content.loaded && content.faqs && content.faqs.length);
  const list = live ? content.faqs : FALLBACK_FAQS;
  const listKey = (live ? 'live-' : 'fb-') + list.length;

  const h = content?.headings?.faq || {};
  const eyebrow = h.eyebrow ?? 'FAQ';
  const heading = h.heading ?? 'Answers to common questions';
  const subtitle = h.subtitle ?? 'Everything you need to know before you send your first project.';

  // Reveal-on-scroll is tracked in React state here (rather than relying on the
  // global ScrollEffects observer, which adds an `in` class straight to the DOM).
  // Toggling a question changes this element's className prop, so React rewrites
  // the class string — an externally-added `in` would be wiped and the item would
  // snap back to opacity:0 and disappear.
  const [revealed, setRevealed] = useState(() => new Set());
  const itemRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = Number(e.target.dataset.faqIndex);
          setRevealed((prev) => {
            if (prev.has(idx)) return prev;
            const next = new Set(prev);
            next.add(idx);
            return next;
          });
          io.unobserve(e.target);
        });
      },
      { rootMargin: '-50px' }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [listKey]);

  return (
    <section className="py-20 sm:py-24 bg-brand-50/30">
      <div className="max-shell container-px">
        <div className="max-w-3xl mx-auto text-center reveal">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">{heading}</h2>
          {subtitle && <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">{subtitle}</p>}
        </div>
        <div className="mt-12 mx-auto max-w-3xl" id="faq">
          {list.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.id || item.q}
                ref={(el) => (itemRefs.current[i] = el)}
                data-faq-index={i}
                data-reveal-self=""
                className={
                  'faq-item border-b border-ink-900/10 py-5 reveal' +
                  (revealed.has(i) ? ' in' : '') +
                  (open ? ' open' : '')
                }
              >
                <button
                  className="faq-btn w-full flex items-start justify-between gap-6 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                >
                  <span className="text-base sm:text-lg font-semibold">{item.q}</span>
                  <span className="faq-icon grid place-items-center h-8 w-8 rounded-full bg-brand-50 text-brand-600 transition shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
                </button>
                <div className="faq-body"><p className="text-sm sm:text-base text-ink-700 leading-relaxed pr-12">{item.a}</p></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
