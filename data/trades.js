// Trade catalog — powers the "Our Trades" menu, /trades and /trades/[slug].
// 10 parent trades, 19 sub-trades = 29 pages. All routes are flat: /trades/<slug>.

export const TRADES = [
  {
    slug: 'concrete-estimating',
    title: 'Concrete Estimating',
    tagline: 'Accurate concrete quantities and pricing for foundations, slabs, walls and structures.',
    overview: [
      'Our concrete estimators measure every cubic yard of your project — footings, foundations, slabs-on-grade, elevated decks, retaining walls, columns and beams — and price it with current regional material and labor rates.',
      'We break out rebar, formwork, embeds, finishing and pumping separately so you can see exactly where the cost sits and negotiate with confidence.',
    ],
    includes: [
      'Footings, foundations & grade beams',
      'Slabs-on-grade & elevated decks',
      'Walls, columns, piers & beams',
      'Formwork, rebar & embeds',
      'Finishing, curing & pumping',
    ],
    deliverables: ['CSI Division 03 Excel workbook', 'Marked-up plans by pour', 'Concrete summary by mix & strength'],
    children: [],
  },
  {
    slug: 'electrical-estimating',
    title: 'Electrical Estimating',
    tagline: 'Complete electrical takeoffs — from service entrance to the last device.',
    overview: [
      'We produce detailed electrical estimates covering power distribution, lighting, devices, conduit and wire, panels, gear and controls, priced to your local labor and material market.',
      'Every branch circuit, home run and feeder is counted from the drawings and one-line, giving you a defensible number for hard bids and design-build work alike.',
    ],
    includes: [
      'Service entrance, switchgear & panels',
      'Feeders, branch circuits & conduit',
      'Lighting fixtures & controls',
      'Devices, receptacles & switches',
      'Fire alarm & low-voltage rough-in',
    ],
    deliverables: ['CSI Division 26 Excel estimate', 'Marked-up plans by circuit', 'Labor hours & material summary'],
    children: [
      {
        slug: 'electrical-estimating-outsourcing',
        title: 'Electrical Estimating Outsourcing',
        tagline: 'A dedicated electrical estimating team, without the overhead of hiring one.',
        overview: [
          'Electrical contractors outsource their estimating to us to bid more work without adding payroll. We become your on-demand pre-construction department, ready when the bid invites arrive.',
          'You get consistent, professionally formatted estimates for every project, whether you send us one bid a month or five a week.',
        ],
        includes: [
          'On-demand estimating capacity',
          'Consistent formats across every bid',
          'Fast turnaround on bid invites',
          'Scalable during busy seasons',
          'Confidential — NDA on every project',
        ],
        deliverables: ['Bid-ready electrical estimate', 'Marked-up plans & takeoff sheets', 'Proposal-ready summary'],
      },
      {
        slug: 'telecom-estimating-services',
        title: 'Telecom Estimating Services',
        tagline: 'Structured cabling, fiber and telecom infrastructure quantified and priced.',
        overview: [
          'We estimate telecommunications and structured cabling scopes — copper and fiber backbone, horizontal cabling, racks, pathways and terminations — for commercial and institutional projects.',
          'Drops, patch panels, cable tray and outlet counts are pulled directly from the drawings and priced with current material rates.',
        ],
        includes: [
          'Copper & fiber backbone cabling',
          'Horizontal cabling & data drops',
          'Racks, cabinets & patch panels',
          'Cable tray, conduit & pathways',
          'Terminations, testing & labeling',
        ],
        deliverables: ['CSI Division 27 estimate', 'Drop count schedule', 'Material & labor summary'],
      },
    ],
  },
  {
    slug: 'interior-exterior-finishes',
    title: 'Interior & Exterior Finishes',
    tagline: 'Drywall, flooring, paint and finish scopes measured to the square foot.',
    overview: [
      'Finishes are where scope creep hides. We measure every wall, ceiling and floor area — by room, by finish type and by substrate — so your finish estimates are complete and easy to verify.',
      'From metal framing and drywall through flooring, paint and specialty coatings, we deliver quantities your crews can build from.',
    ],
    includes: [
      'Drywall, framing & insulation',
      'Flooring — tile, carpet, LVT, wood',
      'Painting & wall coverings',
      'Ceilings & acoustical systems',
      'Exterior finishes & cladding',
    ],
    deliverables: ['CSI Division 09 estimate', 'Room-by-room finish schedule', 'Marked-up plans by finish'],
    children: [
      {
        slug: 'drywall-takeoff-services',
        title: 'Drywall Takeoff Services',
        tagline: 'Board, framing, tape and finish quantified for every wall and ceiling.',
        overview: [
          'Our drywall takeoffs count every sheet, stud, track and pound of compound. We separate wall types, fire ratings and finish levels so pricing reflects the actual scope.',
          'Ceilings, soffits, bulkheads and shaft walls are all captured, along with the framing and insulation that go with them.',
        ],
        includes: [
          'Gypsum board by type & rating',
          'Metal studs, track & framing',
          'Insulation & sound batts',
          'Taping, finishing & levels',
          'Ceilings, soffits & shaft walls',
        ],
        deliverables: ['Drywall takeoff workbook', 'Wall-type schedule', 'Marked-up plans by wall type'],
      },
      {
        slug: 'flooring-estimating-services',
        title: 'Flooring Estimating Services',
        tagline: 'Accurate flooring areas, waste factors and transitions for every room.',
        overview: [
          'We measure flooring by room and material — tile, carpet, LVT, hardwood, epoxy and polished concrete — with realistic waste factors for cuts, patterns and layout.',
          'Base, transitions, prep and moisture mitigation are itemized so nothing gets missed at install.',
        ],
        includes: [
          'Tile, stone & grout',
          'Carpet, carpet tile & pad',
          'LVT, sheet vinyl & rubber',
          'Hardwood & laminate',
          'Base, transitions & floor prep',
        ],
        deliverables: ['Flooring takeoff by room', 'Material schedule with waste', 'Marked-up plans by material'],
      },
      {
        slug: 'painting-estimating-services',
        title: 'Painting Estimating Services',
        tagline: 'Every surface, coat and prep step counted for interior and exterior painting.',
        overview: [
          'Our painting estimates measure wall, ceiling, trim and exterior surface areas by substrate and coating system, with prep, primer and finish coats itemized.',
          'Doors, frames, railings and specialty coatings are counted individually so the estimate reflects real production rates.',
        ],
        includes: [
          'Interior walls & ceilings',
          'Doors, frames & trim',
          'Exterior siding, stucco & masonry',
          'Prep, primer & finish coats',
          'Specialty & high-performance coatings',
        ],
        deliverables: ['Painting takeoff by surface', 'Coating system schedule', 'Labor & material summary'],
      },
    ],
  },
  {
    slug: 'masonry-estimating',
    title: 'Masonry Estimating',
    tagline: 'Block, brick, stone and mortar quantified for structural and veneer work.',
    overview: [
      'We estimate masonry scopes from CMU structural walls to brick and stone veneer, counting units, mortar, grout, reinforcing and accessories directly from the elevations and sections.',
      'Lintels, flashing, weeps, ties and control joints are all captured so your masonry number is complete.',
    ],
    includes: [
      'CMU walls, grout & reinforcing',
      'Brick & stone veneer',
      'Mortar, ties & accessories',
      'Lintels, sills & flashing',
      'Scaffolding & cleaning',
    ],
    deliverables: ['CSI Division 04 estimate', 'Unit counts by wall & elevation', 'Marked-up elevations'],
    children: [],
  },
  {
    slug: 'mep-estimating',
    title: 'MEP Estimating',
    tagline: 'Mechanical, electrical and plumbing scopes estimated by trade specialists.',
    overview: [
      'MEP is the most detail-heavy part of any estimate. Our trade-specialist estimators take off HVAC, plumbing, piping and electrical scopes separately and roll them up into one coordinated package.',
      'Equipment, distribution, terminals, fixtures and controls are counted and priced with current supplier rates and realistic labor units.',
    ],
    includes: [
      'HVAC equipment, ductwork & controls',
      'Plumbing fixtures, piping & drainage',
      'Process & specialty piping',
      'Electrical distribution & lighting',
      'Coordination across all three trades',
    ],
    deliverables: ['Combined MEP estimate package', 'Trade-by-trade breakdown', 'Equipment schedules'],
    children: [
      {
        slug: 'mechanical-estimating',
        title: 'Mechanical Estimating',
        tagline: 'Equipment, piping and controls for complete mechanical systems.',
        overview: [
          'We estimate mechanical scopes covering boilers, chillers, pumps, air handlers, hydronic piping and building controls for commercial and institutional projects.',
          'Equipment is scheduled from the drawings and priced with vendor quotes where available, with installation labor built from realistic production rates.',
        ],
        includes: [
          'Boilers, chillers & pumps',
          'Air handling & rooftop units',
          'Hydronic & refrigerant piping',
          'Insulation & supports',
          'Building automation & controls',
        ],
        deliverables: ['CSI Division 23 estimate', 'Equipment schedule', 'Labor & material summary'],
      },
      {
        slug: 'hvac-estimating',
        title: 'HVAC Estimating',
        tagline: 'Heating, ventilation and air conditioning systems quantified end to end.',
        overview: [
          'Our HVAC estimates cover equipment, ductwork, diffusers, exhaust, ventilation and controls, sized from the mechanical drawings and schedules.',
          'Whether split systems, VRF or central plant, we deliver a complete number with equipment, distribution and startup separated.',
        ],
        includes: [
          'Split, packaged & VRF systems',
          'Ductwork, fittings & insulation',
          'Diffusers, grilles & registers',
          'Exhaust & ventilation fans',
          'Thermostats, controls & startup',
        ],
        deliverables: ['HVAC estimate workbook', 'Equipment & diffuser schedule', 'Marked-up mechanical plans'],
      },
      {
        slug: 'duct-takeoff-services',
        title: 'Duct Takeoff Services',
        tagline: 'Sheet metal ductwork measured by the pound, foot and fitting.',
        overview: [
          'We take off rectangular, round and oval ductwork by size and gauge, counting every fitting, transition, damper and access door from the mechanical plans.',
          'Duct weight, insulation and hangers are calculated so fabrication shops and installers get exactly what they need to price.',
        ],
        includes: [
          'Rectangular, round & oval duct',
          'Fittings, transitions & elbows',
          'Dampers, access doors & louvers',
          'Duct insulation & lining',
          'Hangers, supports & sealing',
        ],
        deliverables: ['Duct takeoff by size & gauge', 'Sheet metal weight summary', 'Fitting count schedule'],
      },
      {
        slug: 'plumbing-estimating',
        title: 'Plumbing Estimating',
        tagline: 'Fixtures, piping and drainage counted for complete plumbing systems.',
        overview: [
          'Our plumbing estimates cover fixtures, water distribution, sanitary and storm drainage, vents, water heaters and specialties from the plumbing plans and risers.',
          'Pipe is measured by material and size, with fittings, hangers, insulation and testing built in.',
        ],
        includes: [
          'Fixtures & fixture carriers',
          'Domestic water piping',
          'Sanitary, vent & storm drainage',
          'Water heaters & specialties',
          'Insulation, hangers & testing',
        ],
        deliverables: ['CSI Division 22 estimate', 'Fixture schedule', 'Pipe summary by size & material'],
      },
      {
        slug: 'piping-estimating',
        title: 'Piping Estimating',
        tagline: 'Process, hydronic and specialty piping measured to the foot.',
        overview: [
          'We estimate industrial, process and hydronic piping systems — pipe, valves, fittings, supports and insulation — from P&IDs and mechanical drawings.',
          'Welded, threaded and grooved systems are priced separately with the right labor units for each joining method.',
        ],
        includes: [
          'Carbon, stainless & copper pipe',
          'Valves, fittings & flanges',
          'Welded, threaded & grooved joints',
          'Supports, hangers & anchors',
          'Insulation, testing & labeling',
        ],
        deliverables: ['Piping estimate by system', 'Valve & fitting schedule', 'Weld & joint count'],
      },
      {
        slug: 'gutter-estimating',
        title: 'Gutter Estimating',
        tagline: 'Gutters, downspouts and drainage accessories quantified accurately.',
        overview: [
          'We measure gutters, downspouts, leaders, splash blocks and related sheet metal from the roof and elevation drawings, by size, profile and material.',
          'Hangers, end caps, outlets, miters and sealant are counted so nothing is left off the order.',
        ],
        includes: [
          'Gutters by profile & material',
          'Downspouts & leaders',
          'Hangers, straps & brackets',
          'Miters, end caps & outlets',
          'Splash blocks & drainage tie-ins',
        ],
        deliverables: ['Gutter takeoff by elevation', 'Material order list', 'Marked-up roof plans'],
      },
    ],
  },
  {
    slug: 'metals-estimating',
    title: 'Metals Estimating',
    tagline: 'Structural steel, rebar, decking and miscellaneous metals priced by weight.',
    overview: [
      'Our metals estimators take off structural steel, reinforcing, metal deck, stairs, railings and miscellaneous metals from the structural drawings, calculating tonnage and connections.',
      'Fabrication, delivery and erection are priced separately so you can compare shop quotes and self-perform decisions accurately.',
    ],
    includes: [
      'Structural steel beams, columns & bracing',
      'Reinforcing steel & mesh',
      'Metal deck & shear studs',
      'Stairs, railings & ladders',
      'Miscellaneous & ornamental metals',
    ],
    deliverables: ['CSI Division 05 estimate', 'Steel tonnage by member', 'Marked-up structural plans'],
    children: [
      {
        slug: 'rebar-estimating',
        title: 'Rebar Estimating',
        tagline: 'Reinforcing steel weight, bar counts and accessories from the structural set.',
        overview: [
          'We take off reinforcing steel by bar size, length and count from footings, walls, slabs, columns and beams, calculating total weight with laps and hooks included.',
          'Mesh, chairs, ties and dowels are captured so your rebar estimate matches what the detailer will produce.',
        ],
        includes: [
          'Bar counts by size & element',
          'Laps, hooks & bends',
          'Welded wire mesh',
          'Chairs, ties & accessories',
          'Dowels & embedded items',
        ],
        deliverables: ['Rebar weight summary', 'Bar list by element', 'Marked-up structural plans'],
      },
      {
        slug: 'structural-steel-estimating-services',
        title: 'Structural Steel Estimating Services',
        tagline: 'Tonnage, connections and erection for structural steel packages.',
        overview: [
          'Our structural steel estimates count every beam, column, brace, girt and connection from the structural drawings, calculating fabricated weight and erection hours.',
          'Base plates, anchor bolts, bolted and welded connections are all quantified so fabricators and erectors can price with confidence.',
        ],
        includes: [
          'Beams, columns & bracing',
          'Connections, bolts & welds',
          'Base plates & anchor bolts',
          'Girts, purlins & joists',
          'Fabrication & erection labor',
        ],
        deliverables: ['Structural steel tonnage report', 'Member & connection schedule', 'Erection sequence summary'],
      },
    ],
  },
  {
    slug: 'openings-estimating',
    title: 'Openings Estimating',
    tagline: 'Doors, frames, hardware, windows and glazing counted from the schedules.',
    overview: [
      'We estimate every opening in the project — hollow metal, wood and specialty doors, frames, hardware sets, windows, storefront and curtain wall — cross-checked against the door and window schedules.',
      'Hardware is broken out by set so suppliers can quote accurately, and glazing is measured by lite and system.',
    ],
    includes: [
      'Hollow metal, wood & specialty doors',
      'Frames & hardware sets',
      'Windows & skylights',
      'Storefront & curtain wall',
      'Overhead & specialty doors',
    ],
    deliverables: ['CSI Division 08 estimate', 'Door, frame & hardware schedule', 'Glazing takeoff by system'],
    children: [],
  },
  {
    slug: 'thermal-moisture-protection-estimating',
    title: 'Thermal / Moisture Protection Estimating',
    tagline: 'Roofing, insulation, waterproofing and fireproofing scopes measured completely.',
    overview: [
      'Division 07 protects the building envelope, and it is easy to under-scope. We measure roofing systems, insulation, air and vapor barriers, waterproofing, sealants and fireproofing from the details and sections.',
      'Flashings, terminations, penetrations and accessories are itemized so your envelope estimate holds up on site.',
    ],
    includes: [
      'Roofing membranes, shingles & metal',
      'Board, batt & spray insulation',
      'Waterproofing & damp-proofing',
      'Air barriers & vapor retarders',
      'Fireproofing, sealants & flashings',
    ],
    deliverables: ['CSI Division 07 estimate', 'Envelope takeoff by system', 'Marked-up details & sections'],
    children: [
      {
        slug: 'insulation-estimating-services',
        title: 'Insulation Estimating Services',
        tagline: 'Batt, board, blown and spray insulation quantified by R-value and location.',
        overview: [
          'We take off thermal and acoustic insulation across walls, roofs, floors and mechanical systems, by type, thickness and R-value.',
          'Vapor retarders, facing, fasteners and accessories are included so the estimate reflects a complete installed system.',
        ],
        includes: [
          'Batt & blanket insulation',
          'Rigid board & continuous insulation',
          'Spray foam & blown-in',
          'Mechanical & pipe insulation',
          'Vapor retarders & accessories',
        ],
        deliverables: ['Insulation takeoff by assembly', 'R-value schedule', 'Material order summary'],
      },
      {
        slug: 'roofing-estimating',
        title: 'Roofing Estimating',
        tagline: 'Low-slope and steep-slope roofing systems measured to the square.',
        overview: [
          'Our roofing estimates cover TPO, EPDM, PVC, modified bitumen, shingles, tile and metal systems, with insulation, cover board, flashings and accessories itemized.',
          'Penetrations, curbs, drains, edge metal and walkway pads are counted so the number reflects a complete, warrantable roof.',
        ],
        includes: [
          'Single-ply, built-up & modified systems',
          'Shingle, tile & metal roofing',
          'Roof insulation & cover board',
          'Flashings, edge metal & copings',
          'Drains, curbs & penetrations',
        ],
        deliverables: ['Roofing takeoff by system', 'Roof plan markups', 'Accessory & flashing schedule'],
      },
      {
        slug: 'fireproofing-estimating-services',
        title: 'Fireproofing Estimating Services',
        tagline: 'Spray-applied and intumescent fireproofing measured by member and rating.',
        overview: [
          'We estimate spray-applied fireproofing and intumescent coatings on structural steel and decking, calculated by member size, required rating and thickness.',
          'Patching, overspray protection and firestopping at penetrations are included to give you a complete passive fire protection number.',
        ],
        includes: [
          'Spray-applied fireproofing (SFRM)',
          'Intumescent coatings',
          'Thickness by rating & member',
          'Metal deck & beam fireproofing',
          'Firestopping & patching',
        ],
        deliverables: ['Fireproofing takeoff by member', 'Rating & thickness schedule', 'Marked-up structural plans'],
      },
    ],
  },
  {
    slug: 'sitework-estimating',
    title: 'Sitework Estimating',
    tagline: 'Earthwork, utilities, paving and site improvements quantified from civil drawings.',
    overview: [
      'Our sitework estimates cover demolition, clearing, cut and fill, site utilities, paving, curbs, walks and site improvements, taken off from the civil and landscape drawings.',
      'Earthwork volumes are calculated from grading plans, and utilities are measured by size, depth and material with trenching and backfill included.',
    ],
    includes: [
      'Demolition, clearing & grubbing',
      'Cut, fill & grading',
      'Storm, sanitary & water utilities',
      'Paving, curbs & walks',
      'Site improvements & fencing',
    ],
    deliverables: ['CSI Divisions 31–33 estimate', 'Earthwork volume summary', 'Marked-up civil plans'],
    children: [
      {
        slug: 'landscaping-estimating-services',
        title: 'Landscaping Estimating Services',
        tagline: 'Plantings, irrigation, hardscape and site furnishings counted from the landscape plans.',
        overview: [
          'We estimate landscaping scopes including trees, shrubs, groundcover, sod and seed, along with irrigation, planting soil, mulch, edging and hardscape elements.',
          'Every plant is counted from the schedule, and irrigation is measured by zone, pipe size and head count.',
        ],
        includes: [
          'Trees, shrubs & groundcover',
          'Sod, seed & planting soil',
          'Irrigation systems & controls',
          'Mulch, edging & drainage',
          'Hardscape & site furnishings',
        ],
        deliverables: ['Plant schedule with counts', 'Irrigation takeoff by zone', 'Marked-up landscape plans'],
      },
    ],
  },
  {
    slug: 'lumber-takeoff',
    title: 'Lumber Takeoff',
    tagline: 'Framing lumber, sheathing, engineered wood and trim counted stick by stick.',
    overview: [
      'Our lumber takeoffs count every stud, plate, header, joist, rafter and sheet of sheathing from the framing plans, with waste factors and lengths optimized for the lumber yard.',
      'Engineered lumber, hangers, fasteners and trim are itemized so your framing package is ready to order and price.',
    ],
    includes: [
      'Wall framing — studs, plates & headers',
      'Floor & roof framing — joists, rafters & trusses',
      'Sheathing & subfloor',
      'Engineered lumber, beams & hangers',
      'Fasteners, trim & finish carpentry',
    ],
    deliverables: ['CSI Division 06 lumber list', 'Framing takeoff by floor', 'Supplier-ready order sheet'],
    children: [
      {
        slug: 'wood-plastic-composites-estimating',
        title: 'Wood & Plastic Composites Estimating',
        tagline: 'Composite decking, railing, trim and cladding measured for accurate ordering.',
        overview: [
          'We estimate wood-plastic composite and PVC products — decking, railing systems, trim, cladding and fascia — by linear foot, square foot and component count.',
          'Fastening systems, hidden clips, framing and accessories are included so the order matches the install.',
        ],
        includes: [
          'Composite & PVC decking',
          'Railing systems & posts',
          'Composite trim & fascia',
          'Cladding & siding products',
          'Fasteners, clips & accessories',
        ],
        deliverables: ['Composite material takeoff', 'Board & component counts', 'Supplier order list'],
      },
      {
        slug: 'millwork-estimating',
        title: 'Millwork Estimating',
        tagline: 'Casework, countertops, paneling and architectural woodwork itemized precisely.',
        overview: [
          'Our millwork estimates cover cabinets, countertops, wall paneling, running trim, reception desks and custom architectural woodwork, taken off from the interior elevations and details.',
          'Materials, finishes, hardware and installation are separated so you can compare shop quotes and identify value-engineering options.',
        ],
        includes: [
          'Cabinets & casework',
          'Countertops & solid surface',
          'Wall paneling & wainscot',
          'Running trim & moldings',
          'Custom desks & feature pieces',
        ],
        deliverables: ['Millwork estimate by elevation', 'Casework & countertop schedule', 'Hardware & finish summary'],
      },
    ],
  },
];

// ---------- helpers ----------

/** Flat list of every trade (parents + children), each with a `parent` reference for children. */
export function getAllTrades() {
  const list = [];
  for (const t of TRADES) {
    list.push({ ...t, parent: null });
    for (const c of t.children) list.push({ ...c, parent: t, children: [] });
  }
  return list;
}

export function getTrade(slug) {
  return getAllTrades().find((t) => t.slug === slug) || null;
}
