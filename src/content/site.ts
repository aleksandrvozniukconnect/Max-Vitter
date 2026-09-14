export const marketIds = ['UA', 'US', 'ME'] as const
export type MarketId = (typeof marketIds)[number]

export const markets = {
  UA: {
    id: 'UA' as const,
    code: 'UA',
    label: 'Ukraine',
    desk: 'Kyiv production desk',
    email: 'ua@designchoice.work',
    phone: '+380 44 000 00 00',
    note: 'Engineering and the plant sit together. The drawing does not travel far from the people who will cut it.',
    overlay:
      'Ukraine overlay — production, engineering, and the floor. One sequence from first file to handover.',
  },
  US: {
    id: 'US' as const,
    code: 'US',
    label: 'United States',
    desk: 'US project desk',
    email: 'us@designchoice.work',
    phone: '+1 646 000 0000',
    note: 'English-language coordination for North American sites. Production remains in Ukraine.',
    overlay:
      'United States overlay — calendar, language, and logistics from a US-facing desk. The plant stays in Ukraine.',
  },
  ME: {
    id: 'ME' as const,
    code: 'ME',
    label: 'Montenegro',
    desk: 'Adriatic coordination',
    email: 'me@designchoice.work',
    phone: '+382 20 000 000',
    overlay:
      'Montenegro overlay — the same production sequence, with site coordination for Adriatic work.',
    note: 'Install windows and last-mile coordination for Montenegro and nearby Adriatic sites.',
  },
}

export const nav = [
  { href: '#how', label: 'How we work' },
  { href: '#journey', label: 'Journey' },
  { href: '#start', label: 'Send your project' },
] as const

export const hero = {
  eyebrow: 'One partner. Every stage of the way.',
  title: 'One partner. Every stage. One accountable result.',
  lede: 'Design Choice is a Ukrainian millwork and custom joinery partner for designers, architects, developers, and general contractors. Hand us a complex project — this is what happens next.',
}

export const howWeWorkSteps = [
  {
    key: 'consult',
    title: 'Step 1 — Consult',
    body: 'Every project starts with the package, not a sales script. Send the drawings, the constraints, the calendar, and the questions you cannot leave open. We read the brief as a production team: what is buildable, what is missing, and which samples must be real before anyone talks about a date.',
  },
  {
    key: 'design',
    title: 'Step 2 — Design',
    body: 'Engineering turns the concept into a set that can be cut. Joinery, materials, tolerances, hardware, and edge conditions are resolved in drawings you can approve. You see the buildable version — not a mood, and not a promise the floor cannot keep.',
  },
  {
    key: 'confirm',
    title: 'Step 3 — Confirm',
    body: 'Contract, specification, finishes, and timeline lock in writing. Production does not start on a verbal maybe. If something in the set will not hold for the window or the budget, we say so here — before a machine moves.',
  },
  {
    key: 'manufacture',
    title: 'Step 4 — Manufacture',
    body: 'Procurement and manufacturing follow the approved set. The plant executes; it does not interpret. Assemblies are built to the drawing that was signed, in the sequence the job actually needs.',
  },
  {
    key: 'deliver',
    title: 'Step 5 — Deliver',
    body: 'Packing is part of the product. Logistics are aimed at the install window, including phased drops. You know what is on a crate, which floor it belongs to, and when it is allowed to move.',
  },
  {
    key: 'support',
    title: 'Step 6 — Support',
    body: 'Install is coordinated, handover is documented, and warranty terms are explicit. After the job, we review what held and what did not — so the next project inherits a tighter standard, not a repeated guess.',
  },
] as const

export const howWeWork = {
  rail: 'How we work with you',
  introTitle: 'How We Work',
  introLede:
    'Most millwork projects lose the drawing between the studio and the floor. We built a short, readable sequence so that does not happen: six steps you can follow, then a deeper journey with three gates nothing ships without.',
}

export const mosaic = {
  eyebrow: 'Visual direction',
  title: 'Material. Geometry. Sequence.',
  subtitle: 'From first line to final detail.',
  capabilities: [
    'Architectural millwork',
    'Custom joinery',
    'Built-in systems',
    'Spec engineering',
    'Control assemblies',
    'Independent QC',
    'Crating & logistics',
    'Install coordination',
  ],
  projects: [
    {
      title: 'Hospitality suites',
      challenge: 'One architect set, repeated across rooms, with a fixed install window.',
      result: 'One approved assembly. Install ran to the window. The handover pack was the set that was built.',
    },
    {
      title: 'Residential tower kitchens',
      challenge: 'Developer drawings arrived as layouts and finish notes, not a buildable set.',
      result: 'Engineering closed the set before production. Units were packed by floor.',
    },
  ],
}

export type JourneyChapter = {
  kind: 'chapter'
  n: number
  title: string
  body: string
}

export type JourneyGate = {
  kind: 'gate'
  stamp: string
  note: string
}

export type JourneyItem = JourneyChapter | JourneyGate

export const journey: JourneyItem[] = [
  {
    kind: 'chapter',
    n: 1,
    title: 'Understand',
    body: 'Intake, analysis, estimate, materials and samples. We take the package apart until the job is legible: scope, constructability, lead times, and the samples that must exist before a number means anything.',
  },
  {
    kind: 'chapter',
    n: 2,
    title: 'Define',
    body: 'Contract, engineering, approvals. The set becomes the source of truth. What is not on the drawing is not on the floor.',
  },
  {
    kind: 'gate',
    stamp: 'Approved for Production',
    note: 'Nothing is cut until the set is signed. This gate is a decision, not a courtesy.',
  },
  {
    kind: 'chapter',
    n: 3,
    title: 'Make',
    body: 'Procurement and manufacturing. Materials are bought to the approved spec. Assemblies run in the order the site will need them.',
  },
  {
    kind: 'chapter',
    n: 4,
    title: 'Verify',
    body: 'Control assembly and independent QC. A first assembly proves the joinery. QC reads the work against the approved set — not against memory.',
  },
  {
    kind: 'gate',
    stamp: 'QC Approved',
    note: 'Independent of the team that built it. If it does not match the set, it does not move.',
  },
  {
    kind: 'chapter',
    n: 5,
    title: 'Deliver',
    body: 'Packing and logistics. Crates are labeled to the install plan. The calendar of the site outranks the convenience of the plant.',
  },
  {
    kind: 'gate',
    stamp: 'Approved for Shipment',
    note: 'Released only when packing, documents, and the QC stamp agree. Nothing leaves on a hope.',
  },
  {
    kind: 'chapter',
    n: 6,
    title: 'Complete',
    body: 'Install, handover, warranty. Coordination on site, a documented handover, and terms that are readable when something later needs a match.',
  },
  {
    kind: 'chapter',
    n: 7,
    title: 'Improve',
    body: 'Post-project analysis becomes a new standard. What failed the sequence is written down so the next job does not have to discover it again.',
  },
]

export const closing = {
  title: 'Your concept. Our responsibility for delivery.',
  cta: 'Send your project',
}

export const sendForm = {
  eyebrow: 'Start',
  title: 'Send your project',
  lede: 'Name, company, country, type, timing, and a comment. Attach PDF, DWG, XLS, or a cloud link. This page collects the package — it does not upload to a live backend yet.',
  projectTypes: [
    'Hospitality',
    'Residential',
    'Workplace',
    'Civic / cultural',
    'Retail',
    'Other',
  ],
  timings: [
    'Already on a calendar',
    'This quarter',
    'This year',
    'Exploring',
  ],
  acceptHint: 'PDF, DWG, XLS — or a cloud link',
}

export const company = {
  blurb:
    'Design Choice is a Ukrainian B2B production partner for custom millwork and joinery. We are not a retail catalog. We are the plant you can hand a complex project — with a sequence you can follow from first file to handover.',
  partners: [
    'Architecture studios',
    'Interior designers',
    'Developers',
    'General contractors',
    'Material mills',
    'Hardware houses',
  ],
}

export const photos = {
  hero: '/images/hero-plant.jpg',
  detailA: '/images/hero-detail-a.jpg',
  detailB: '/images/hero-detail-b.jpg',
  process: '/images/process-floor.jpg',
  mosaicMaterial: '/images/mosaic-material.jpg',
  mosaicGeometry: '/images/mosaic-geometry.jpg',
  mosaicDrawing: '/images/mosaic-drawing.jpg',
  mosaicInterior: '/images/mosaic-interior.jpg',
  projectA: '/images/project-a.jpg',
  projectB: '/images/project-b.jpg',
  cta: '/images/cta-floor.jpg',
  company: '/images/company.jpg',
}

export function chaptersOf(items: readonly JourneyItem[]): JourneyChapter[] {
  return items.filter((item): item is JourneyChapter => item.kind === 'chapter')
}

export function gatesOf(items: readonly JourneyItem[]): JourneyGate[] {
  return items.filter((item): item is JourneyGate => item.kind === 'gate')
}
