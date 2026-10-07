'use client';

import { useEffect, useRef, useState } from 'react';

// Hardcoded fallbacks — used until the quoteOptions API responds.
const FALLBACK_SERVICES = ['Quantity Takeoff', 'Material Estimation', 'Residential Estimation', 'Commercial Estimation', 'Other'];
const FALLBACK_PROJECTS = ['Single-Family Home', 'Multi-Family / Townhomes', 'Renovation / Remodel', 'Office / Retail', 'Healthcare', 'Industrial / Warehouse', 'Other'];

const PERKS = [
  {
    title: '2-Hour Response',
    desc: 'We confirm scope & pricing within 2 business hours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
  },
  {
    title: '100% Confidential',
    desc: 'NDA available. Your plans stay private.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
    ),
  },
  {
    title: 'Senior Estimators',
    desc: '10+ years average experience.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
    ),
  },
  {
    title: 'Free Quote',
    desc: 'No obligation. Pay only when you accept.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    ),
  },
];

const MAX_FILE_MB = 25;

export default function QuoteForm() {
  // 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState([]); // selected drawing files (for display)
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const formRef = useRef(null);

  // Live dropdown options from the Quote Form Options API.
  useEffect(() => {
    let alive = true;
    fetch('/api/quoteOptions')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!alive || !json) return;
        const opts = Array.isArray(json.options) ? json.options : [];
        const live = opts.filter((o) => o.status !== 'Draft');
        const svc = live.filter((o) => o.group === 'service').map((o) => o.label).filter(Boolean);
        const prj = live.filter((o) => o.group === 'project').map((o) => o.label).filter(Boolean);
        if (svc.length) setServices(svc);
        if (prj.length) setProjects(prj);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const onFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form); // multipart — includes the uploaded drawings

    // Client-side guard on total upload size.
    const total = files.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_FILE_MB * 1024 * 1024) {
      setErrorMsg(`Drawings exceed ${MAX_FILE_MB} MB. Please compress or send a download link in the details.`);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/quote', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

      setStatus('success');
      form.reset();
      setFiles([]);
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="quote" className="py-20 sm:py-24">
      <div className="max-shell container-px grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 reveal">
          <span className="eyebrow">Request a Quote</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">Free, no-obligation quote in 2 hours</h2>
          <p className="mt-4 text-base sm:text-lg text-ink-600 leading-relaxed">Tell us about your project. We&apos;ll respond within 2 business hours with a clear timeline and price — complete estimate in 8–24 hours.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PERKS.map((p) => (
              <div key={p.title} className="card p-5">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-50 text-brand-600">{p.icon}</span>
                <h3 className="mt-4 text-sm font-bold">{p.title}</h3>
                <p className="mt-1 text-xs text-ink-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7 reveal">
          <div className="card p-6 sm:p-8 lg:p-10">
            {status === 'success' && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                <div><p className="text-sm font-bold text-emerald-900">Quote request received!</p><p className="text-xs text-emerald-700 mt-0.5">We&apos;ll respond within 2 hours during business hours.</p></div>
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                <div><p className="text-sm font-bold text-red-900">Couldn&apos;t send your request</p><p className="text-xs text-red-700 mt-0.5">{errorMsg}</p></div>
              </div>
            )}
            <form ref={formRef} className="grid gap-5" onSubmit={handleSubmit}>
              {/* Honeypot field for bot/spam protection */}
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" style={{ display: 'none' }} />
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="label">Full Name *</label><input name="fullName" required className="input" placeholder="John Smith" /></div>
                <div><label className="label">Company</label><input name="company" className="input" placeholder="Smith Construction" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="label">Email *</label><input name="email" required type="email" className="input" placeholder="you@company.com" /></div>
                <div><label className="label">Phone</label><input name="phone" className="input" placeholder="+1 (555) 123-4567" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="label">Service Type *</label>
                  <select name="service" required className="input">
                    {services.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div><label className="label">Project Type</label>
                  <select name="projectType" className="input" defaultValue="">
                    <option value="">Select project type</option>
                    {projects.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Upload Drawings</label>
                <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-900/15 bg-brand-50/40 px-4 py-6 text-center transition hover:border-brand-500 hover:bg-brand-50">
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-500 text-white transition group-hover:bg-brand-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </span>
                  <span className="text-sm font-semibold text-ink-800">Click to upload plans &amp; drawings</span>
                  <span className="text-xs text-ink-500">PDF or ZIP — up to {MAX_FILE_MB} MB total</span>
                  <input name="drawings" type="file" multiple accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed" onChange={onFilesChange} className="sr-only" />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-ink-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                        <span className="truncate">{f.name}</span>
                        <span className="text-ink-400">({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div><label className="label">Project Details</label><textarea name="details" className="input resize-none" rows="5" placeholder="Briefly describe your project, scope and any special requirements."></textarea></div>
              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'submitting' ? 'Submitting…' : 'Submit Quote Request'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <p className="text-xs text-ink-500">By submitting, you agree to our privacy policy. We typically respond within 2 business hours.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
