// Demo seed data for the admin panel. Plain JSON-able objects only.
// Persisted to localStorage under 'me-admin-store-v1' once edited.

export const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

export const seed = {
  leads: [],

  services: [
    { id: 'svc-quantity-takeoff', slug: 'quantity-takeoff', title: 'Quantity Takeoff', status: 'Published',
      short: 'Detailed CSI-coded takeoffs from drawings — concrete, steel, masonry, MEP and more.',
      includes: 'Plan & spec review; Color-coded markups; Excel + PDF deliverables',
      deliverables: 'CSI-coded Excel workbook; Marked-up PDF plan set; Summary sheet by division' },
    { id: 'svc-material-estimation', slug: 'material-estimation', title: 'Material Estimation', status: 'Published',
      short: 'Accurate material lists with current regional pricing and waste factors.',
      includes: 'Itemized BOM; Regional supplier pricing; Waste & labor factors',
      deliverables: 'Procurement-ready BOM in Excel; Priced summary by category' },
    { id: 'svc-residential-estimation', slug: 'residential-estimation', title: 'Residential Estimation', status: 'Published',
      short: 'Single-family, multi-family and remodel estimates that win bids.',
      includes: 'Custom homes; Townhomes & duplex; Renovation scopes',
      deliverables: 'Line-item residential estimate; Allowance comparison sheet' },
    { id: 'svc-commercial-estimation', slug: 'commercial-estimation', title: 'Commercial Estimation', status: 'Published',
      short: 'Ground-up and TI estimates for office, retail, healthcare and more.',
      includes: 'Hard-bid support; Value engineering options; Phased estimates',
      deliverables: 'CSI-coded commercial estimate; Bid-day support summary' },
    { id: 'svc-bid-preparation', slug: 'bid-preparation', title: 'Bid Preparation', status: 'Published',
      short: 'Bid-day ready packages with alternates, clarifications and scope gaps flagged.',
      includes: 'Scope review; Alternates pricing; Bid form completion',
      deliverables: 'Completed bid package; Clarifications log; Sub-leveling sheet' },
    { id: 'svc-trade-specific-estimates', slug: 'trade-specific-estimates', title: 'Trade-Specific Estimates', status: 'Published',
      short: 'Deep-dive estimates for a single trade, priced to your local market.',
      includes: 'Single-trade focus; Local labor rates; Material takeoffs',
      deliverables: 'Trade-specific Excel estimate; Market-rate summary' },
  ],

  trades: [
    'concrete-estimating|Concrete Estimating', 'electrical-estimating|Electrical Estimating',
    'electrical-estimating-outsourcing|Electrical Estimating Outsourcing', 'telecom-estimating-services|Telecom Estimating Services',
    'interior-exterior-finishes|Interior & Exterior Finishes', 'drywall-takeoff-services|Drywall Takeoff Services',
    'flooring-estimating-services|Flooring Estimating Services', 'painting-estimating-services|Painting Estimating Services',
    'masonry-estimating|Masonry Estimating', 'mep-estimating|MEP Estimating',
    'mechanical-estimating|Mechanical Estimating', 'hvac-estimating|HVAC Estimating',
    'duct-takeoff-services|Duct Takeoff Services', 'plumbing-estimating|Plumbing Estimating',
    'piping-estimating|Piping Estimating', 'gutter-estimating|Gutter Estimating',
    'metals-estimating|Metals Estimating', 'rebar-estimating|Rebar Estimating',
    'structural-steel-estimating-services|Structural Steel Estimating Services', 'openings-estimating|Openings Estimating',
    'thermal-moisture-protection-estimating|Thermal / Moisture Protection Estimating',
    'insulation-estimating-services|Insulation Estimating Services', 'roofing-estimating|Roofing Estimating',
    'fireproofing-estimating-services|Fireproofing Estimating Services', 'sitework-estimating|Sitework Estimating',
    'landscaping-estimating-services|Landscaping Estimating Services', 'lumber-takeoff|Lumber Takeoff',
    'wood-plastic-composites-estimating|Wood & Plastic Composites Estimating', 'millwork-estimating|Millwork Estimating',
  ].map((s, i) => {
    const [slug, title] = s.split('|');
    return {
      id: `trd-${i}`, slug, title, status: 'Published',
      tagline: `Accurate ${title.toLowerCase()} quantities and pricing for your next bid.`,
      parent: ['electrical-estimating-outsourcing', 'telecom-estimating-services'].includes(slug) ? 'Electrical Estimating'
        : ['drywall-takeoff-services', 'flooring-estimating-services', 'painting-estimating-services'].includes(slug) ? 'Interior & Exterior Finishes'
        : ['mechanical-estimating', 'hvac-estimating', 'duct-takeoff-services', 'plumbing-estimating', 'piping-estimating', 'gutter-estimating'].includes(slug) ? 'MEP Estimating'
        : ['rebar-estimating', 'structural-steel-estimating-services'].includes(slug) ? 'Metals Estimating'
        : ['insulation-estimating-services', 'roofing-estimating', 'fireproofing-estimating-services'].includes(slug) ? 'Thermal / Moisture Protection Estimating'
        : ['landscaping-estimating-services'].includes(slug) ? 'Sitework Estimating'
        : ['wood-plastic-composites-estimating', 'millwork-estimating'].includes(slug) ? 'Lumber Takeoff'
        : '—',
    };
  }),

  projects: [
    { id: 'prj-1', title: 'Maple Heights Residences', category: 'Residential — Multi-family', price: '$3.4M', location: 'Austin, TX', status: 'Published', img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'prj-2', title: 'Northgate Medical Plaza', category: 'Commercial — Healthcare', price: '$12.8M', location: 'Denver, CO', status: 'Published', img: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80' },
    { id: 'prj-3', title: 'Riverside Logistics Hub', category: 'Industrial — Warehouse', price: '$22.5M', location: 'Dallas, TX', status: 'Published', img: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=80' },
    { id: 'prj-4', title: 'Lakeside Custom Home', category: 'Residential — Custom', price: '$1.9M', location: 'Seattle, WA', status: 'Published', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { id: 'prj-5', title: 'Cedar Park Retail Center', category: 'Commercial — Retail', price: '$6.2M', location: 'Chicago, IL', status: 'Draft', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  ],

  testimonials: [
    { id: 'tst-1', name: 'Michael Reynolds', role: 'Owner, Reynolds Construction • Austin, TX', rating: 5, status: 'Published',
      quote: 'Modern Estimator turned my bid prep from a 3-day grind into a 24-hour deliverable. Our win-rate jumped 18% in the first quarter.' },
    { id: 'tst-2', name: 'Steve Parker', role: 'Pre-Construction Manager • Denver, CO', rating: 5, status: 'Published',
      quote: "Accurate, fast and bid-ready. Their CSI breakdowns make sub-leveling effortless. They've become an extension of our pre-con team." },
    { id: 'tst-3', name: 'David Chen', role: 'GC, Chen Builders • Seattle, WA', rating: 5, status: 'Published',
      quote: "We used to outsource estimates to three firms. Now it's just Modern Estimator. Numbers I can defend, deadlines they always hit." },
    { id: 'tst-4', name: 'Laura Simmons', role: 'Estimator, Simmons & Co. • Phoenix, AZ', rating: 4, status: 'Draft',
      quote: 'Solid takeoff work on our multifamily bids. Turnaround was exactly as promised.' },
  ],

  faqs: [
    { id: 'faq-1', q: 'How long does an estimate take?', a: 'Standard turnaround is 8–24 hours from receipt of complete plans. Larger commercial projects may take 3–5 business days. Rush options are available for urgent bids.', status: 'Published' },
    { id: 'faq-2', q: 'What information do you need from me?', a: 'Architectural and structural drawings (PDF or DWG), specifications when available, scope notes and your bid deadline. We handle the rest.', status: 'Published' },
    { id: 'faq-3', q: "What's included in the deliverable?", a: 'A CSI-coded Excel workbook with quantities, unit costs, labor and materials, plus a PDF summary, marked-up plans and an executive summary. Bid-ready, every time.', status: 'Published' },
    { id: 'faq-4', q: 'Do you cover all 50 states?', a: 'Yes. We maintain regional cost databases for all 50 states and adjust labor and material pricing to local markets.', status: 'Published' },
    { id: 'faq-5', q: 'How do you price your services?', a: 'Pricing depends on project size, scope and timeline. Most residential takeoffs start at $250 and commercial projects start at $500. Send us your plans for a free quote.', status: 'Published' },
    { id: 'faq-6', q: 'Are revisions included?', a: 'Yes — minor revisions and clarifications are included for 30 days after delivery. Major scope changes are quoted separately.', status: 'Published' },
  ],

  stats: [
    { id: 'st-1', label: 'Projects estimated', value: '4,800', suffix: '+', status: 'Published' },
    { id: 'st-2', label: 'Estimate accuracy', value: '98.5', suffix: '%', status: 'Published' },
    { id: 'st-3', label: 'Avg. turnaround', value: '24', suffix: ' hrs', status: 'Published' },
    { id: 'st-4', label: 'States served', value: '50', suffix: '', status: 'Published' },
  ],

  posts: [
    { id: 'post-1', title: 'How to Read a Quantity Takeoff Like a Pro', slug: 'how-to-read-quantity-takeoff', category: 'Guides', status: 'Published', date: '2026-09-18', excerpt: 'CSI divisions, waste factors and markups — a practical walkthrough for GCs reviewing their first takeoff.' },
    { id: 'post-2', title: '5 Bid-Day Mistakes That Cost Contractors the Job', slug: 'bid-day-mistakes', category: 'Bidding', status: 'Published', date: '2026-09-02', excerpt: 'From missing alternates to stale pricing — the errors we see most often and how to avoid them.' },
    { id: 'post-3', title: 'Residential vs Commercial Estimating: What Changes?', slug: 'residential-vs-commercial-estimating', category: 'Guides', status: 'Draft', date: '2026-09-28', excerpt: 'Scope depth, pricing sources and deliverables — how the two workflows differ in practice.' },
  ],

  transcripts: [
    { id: 'chat-881', visitor: 'priya@nairbuilders.com', started: '2026-09-30T16:32:00', messages: 14, leadCaptured: true, cost: '$0.04', summary: 'Asked about lumber takeoff pricing for 12-unit townhomes; requested callback.' },
    { id: 'chat-880', visitor: 'Anonymous', started: '2026-09-30T14:05:00', messages: 6, leadCaptured: false, cost: '$0.02', summary: 'Asked about turnaround times; left without contact details.' },
    { id: 'chat-879', visitor: 'hannah@leecustom.com', started: '2026-10-01T06:51:00', messages: 11, leadCaptured: true, cost: '$0.03', summary: 'Custom home BOM pricing; directed to quote form, submitted lead-1037.' },
    { id: 'chat-878', visitor: 'Anonymous', started: '2026-09-29T21:44:00', messages: 4, leadCaptured: false, cost: '$0.01', summary: 'Asked if services cover Texas; answered yes, no follow-up.' },
  ],

  templates: [
    { id: 'tpl-1', name: 'New lead alert (team)', subject: 'New quote request — {{service}}', status: 'Active', body: 'Hi team,\n\nA new quote request just came in:\n\nName: {{name}}\nCompany: {{company}}\nService: {{service}}\nProject: {{projectType}} — {{location}}\nDeadline: {{deadline}}\n\nView it in the admin panel to assign an estimator.' },
    { id: 'tpl-2', name: 'Auto-reply (client)', subject: 'We received your request — {{service}}', status: 'Active', body: 'Hi {{name}},\n\nThanks for reaching out to Modern Estimator. We have your {{service}} request and an estimator will review your drawings within 2 business hours.\n\nYour reference: {{leadId}}\n\n— The Modern Estimator team' },
    { id: 'tpl-3', name: 'Quote delivered', subject: 'Your estimate is ready — {{projectType}}', status: 'Active', body: 'Hi {{name}},\n\nYour estimate for {{projectType}} is ready. Quoted amount: {{quotedAmount}}.\n\nReply to this email with any questions — revisions are included for 30 days.' },
    { id: 'tpl-4', name: 'Follow-up (7 days)', subject: 'Still need that estimate?', status: 'Paused', body: 'Hi {{name}},\n\nJust checking in on your {{service}} request from {{date}}. Your bid deadline is approaching — shall we get started?' },
  ],

  users: [
    { id: 'usr-1', name: 'Mike Carter', email: 'mike@modernestimator.com', role: 'Admin', status: 'Active', lastActive: '2026-10-01T09:12:00' },
    { id: 'usr-2', name: 'Sarah Jennings', email: 'sarah@modernestimator.com', role: 'Estimator', status: 'Active', lastActive: '2026-10-01T08:47:00' },
    { id: 'usr-3', name: 'David Osei', email: 'david@modernestimator.com', role: 'Estimator', status: 'Active', lastActive: '2026-09-30T17:20:00' },
    { id: 'usr-4', name: 'Amara Khan', email: 'amara@modernestimator.com', role: 'Estimator', status: 'Invited', lastActive: '—' },
  ],

  facts: [
    { id: 'fact-1', key: 'Turnaround', value: 'Standard 8–24 hours from receipt of complete plans; 3–5 business days for large commercial.' },
    { id: 'fact-2', key: 'Coverage', value: 'All 50 US states with regional cost databases.' },
    { id: 'fact-3', key: 'Starting prices', value: 'Residential takeoffs from $250; commercial from $500.' },
    { id: 'fact-4', key: 'Revisions policy', value: 'Minor revisions included for 30 days after delivery.' },
    { id: 'fact-5', key: 'Deliverables', value: 'CSI-coded Excel workbook, PDF summary, marked-up plans, executive summary.' },
    { id: 'fact-6', key: 'Contact', value: 'Phone +1 (555) 123-4567 · Email hello@modernestimator.com · Mon–Fri 8am–6pm CT.' },
  ],

  contact: {
    phone: '+1 (555) 123-4567', email: 'hello@modernestimator.com',
    address: '1200 Commerce St, Suite 400, Austin, TX 78701',
    hours: 'Mon–Fri, 8:00am – 6:00pm CT',
  },

  seo: [
    { id: 'seo-1', page: 'Homepage (/)', title: 'Modern Estimator — USA Construction Estimation Services', description: 'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.' },
    { id: 'seo-2', page: '/services', title: 'Our Services — Modern Estimator', description: 'Quantity takeoffs, material estimation, bid preparation and trade-specific estimates for US contractors.' },
    { id: 'seo-3', page: '/trades', title: 'Estimating by Trade — Modern Estimator', description: 'Trade-specific construction estimating: concrete, electrical, MEP, finishes, metals and 29 trade pages.' },
    { id: 'seo-4', page: '/portfolio', title: 'Portfolio — Modern Estimator', description: 'Recent estimation projects across residential, commercial and industrial construction in the US.' },
    { id: 'seo-5', page: '/about', title: 'About — Modern Estimator', description: 'Senior estimators delivering bank-grade accuracy for US contractors since day one.' },
    { id: 'seo-6', page: '/contact', title: 'Contact — Modern Estimator', description: 'Get a free quote: send your plans and receive an estimate in 8–24 hours.' },
  ],

  emailSettings: {
    provider: 'Resend', fromName: 'Modern Estimator', fromEmail: 'quotes@modernestimator.com',
    notifyTeam: true, autoReply: true, whatsappAlerts: false, slackAlerts: true,
    newsletter: false,
  },

  chatbot: {
    model: 'claude-haiku-4-5', monthlyBudget: 50, spentThisMonth: 18.42,
    rateLimit: '30 messages / visitor / day', leadCapture: true, enabled: true,
  },

  siteSettings: {
    siteName: 'Modern Estimator', domain: 'modernestimator.com',
    phone: '+1 (555) 123-4567', email: 'hello@modernestimator.com',
    address: '1200 Commerce St, Suite 400, Austin, TX 78701',
    require2fa: false, sessionTimeout: '8 hours', fileRetention: '24 months',
  },
};
