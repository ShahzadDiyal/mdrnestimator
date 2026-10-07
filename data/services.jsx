// Central service catalog — used by the nav menu, home page, /services and /services/[slug].

export const SERVICES = [
  {
    slug: 'quantity-takeoff',
    title: 'Quantity Takeoff',
    short: 'Detailed CSI-coded takeoffs from drawings — concrete, steel, masonry, MEP and more.',
    tagline: 'Precise, CSI-coded material quantities pulled straight from your drawings.',
    points: ['Plan & spec review', 'Color-coded markups', 'Excel + PDF deliverables'],
    overview: [
      'Our quantity takeoff service measures every material in your plans down to the line item, organized by CSI division so the numbers are easy to price and easy to defend.',
      'Senior estimators review the full drawing set and specifications, mark up the plans by trade, and deliver clean, auditable quantities you can drop straight into your bid.',
    ],
    includes: [
      'Full plan & specification review',
      'Color-coded on-screen markups by trade',
      'Concrete, masonry, steel, wood, finishes & MEP',
      'Waste and lap factors applied',
      'RFI log for missing or unclear scope',
    ],
    deliverables: ['CSI-coded Excel workbook', 'Marked-up PDF plan set', 'Summary sheet by division'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>
    ),
  },
  {
    slug: 'material-estimation',
    title: 'Material Estimation',
    short: 'Accurate material lists with current regional pricing and waste factors.',
    tagline: 'Procurement-ready material lists priced to your local market.',
    points: ['Live supplier rates', 'Waste & labor factors', 'Procurement-ready BOM'],
    overview: [
      'We turn your drawings into a complete bill of materials with current regional pricing, so you know exactly what to buy and what it will cost.',
      'Each item includes waste and labor factors, giving you a realistic number for both purchasing and bidding.',
    ],
    includes: [
      'Itemized bill of materials (BOM)',
      'Current regional supplier pricing',
      'Waste, lap and coverage factors',
      'Labor hours by item where required',
      'Alternates and substitution options',
    ],
    deliverables: ['Procurement-ready BOM in Excel', 'Priced summary by category', 'Supplier-ready order sheets'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    ),
  },
  {
    slug: 'residential-estimation',
    title: 'Residential Estimation',
    short: 'Single-family, multi-family and remodel estimates that win bids.',
    tagline: 'Bid-ready estimates for custom homes, multi-family and remodels.',
    points: ['Custom homes', 'Townhomes & duplex', 'Renovation scopes'],
    overview: [
      'From custom single-family homes to multi-family communities and renovations, we build detailed residential estimates that hold up to owner and lender scrutiny.',
      'You get a clear, line-item breakdown that makes it easy to price options, compare allowances and protect your margin.',
    ],
    includes: [
      'Single-family, multi-family & townhomes',
      'Renovations, additions & remodels',
      'Allowance and option pricing',
      'Site work and foundations',
      'Finishes and cabinetry',
    ],
    deliverables: ['Line-item residential estimate', 'Excel + PDF summary', 'Marked-up plans'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
  },
  {
    slug: 'commercial-estimation',
    title: 'Commercial Estimation',
    short: 'Office, retail, healthcare and industrial estimates with full bid packages.',
    tagline: 'Full bid packages for office, retail, healthcare and industrial projects.',
    points: ['GMP & hard-bid', 'Tenant improvement', 'Structural & shell'],
    overview: [
      'We support general contractors and subs on commercial work of every size — from tenant improvements to ground-up shell and core — with complete, well-organized estimates.',
      'Whether you need a hard bid or a GMP package, our estimators deliver numbers you can stand behind in front of an owner.',
    ],
    includes: [
      'Ground-up shell & core',
      'Tenant improvements',
      'GMP and hard-bid packages',
      'Structural, envelope and MEP',
      'Value-engineering options',
    ],
    deliverables: ['Full commercial bid package', 'CSI-coded Excel estimate', 'Executive summary & assumptions'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
    ),
  },
  {
    slug: 'bid-preparation',
    title: 'Bid Preparation',
    short: 'Bid-ready documents formatted to your template, with executive summaries.',
    tagline: 'Polished, submission-ready bid packages built to win.',
    points: ['Sub bid leveling', 'Proposal cover letters', 'Win-rate optimized'],
    overview: [
      'We assemble your numbers into a clean, professional bid package formatted to your template and ready to submit on deadline.',
      'From sub-bid leveling to proposal cover letters, we make sure your bid is complete, consistent and competitive.',
    ],
    includes: [
      'Sub-bid leveling and comparison',
      'Proposal formatting to your template',
      'Executive summary and cover letter',
      'Inclusions / exclusions and assumptions',
      'Final review before submission',
    ],
    deliverables: ['Submission-ready bid package', 'Leveled sub-bid comparison', 'Cover letter & executive summary'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
    ),
  },
  {
    slug: 'trade-specific-estimates',
    title: 'Trade-Specific Estimates',
    short: 'Specialized takeoffs for trades — concrete, drywall, painting, roofing, MEP.',
    tagline: 'Specialized takeoffs and estimates for individual trades.',
    points: ['Concrete & masonry', 'Drywall & finishes', 'MEP & roofing'],
    overview: [
      'Subcontractors get focused, trade-specific takeoffs and estimates built around exactly the scope they self-perform.',
      'We speak your trade — concrete, masonry, drywall, painting, roofing, MEP and more — and deliver numbers tuned to how you actually buy and build.',
    ],
    includes: [
      'Concrete & masonry',
      'Drywall, framing & finishes',
      'Painting & coatings',
      'Roofing & waterproofing',
      'Mechanical, electrical & plumbing',
    ],
    deliverables: ['Trade-specific takeoff & estimate', 'Excel workbook by scope', 'Marked-up plans for your trade'],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
    ),
  },
];

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
