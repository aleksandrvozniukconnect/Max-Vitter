export const marketIds = ['UA', 'US', 'ME'] as const
export type MarketId = (typeof marketIds)[number]

export type Market = {
  id: MarketId
  label: string
  city: string
  role: string
  person: string
  phone: string
  email: string
  hours: string
  heroLine: string
}

export const markets: Record<MarketId, Market> = {
  UA: {
    id: 'UA',
    label: 'Ukraine',
    city: 'Kyiv region',
    role: 'Plant, engineering, QC',
    person: 'Name, role',
    phone: '+380 44 000 00 00',
    email: 'ua@designchoice.work',
    hours: '09:00–18:00 EET',
    heroLine: 'Plant and engineering in Kyiv region. Projects in Ukraine, the United States and the Adriatic.',
  },
  US: {
    id: 'US',
    label: 'United States',
    city: 'Miami / New York',
    role: 'Project desk, install crews',
    person: 'Name, role',
    phone: '+1 646 000 0000',
    email: 'us@designchoice.work',
    hours: '09:00–18:00 ET',
    heroLine: 'A US project desk in your time zone. Production stays in Ukraine; the crate arrives labelled to your floor plan.',
  },
  ME: {
    id: 'ME',
    label: 'Montenegro',
    city: 'Tivat / Boka Bay',
    role: 'Site coordination, partner install',
    person: 'Name, role',
    phone: '+382 20 000 000',
    email: 'me@designchoice.work',
    hours: '09:00–18:00 CET',
    heroLine: 'Site coordination on the Boka Bay. The same sequence, with install windows planned around the Adriatic season.',
  },
}

export const nav = [
  { href: '#how', label: 'How we work' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#projects', label: 'Projects' },
  { href: '#start', label: 'Send your project' },
] as const

export const hero = {
  eyebrow: 'B2B millwork and custom joinery · Ukraine',
  title: 'One partner. Every stage. One accountable result.',
  lede: 'Design Choice is the plant that designers, architects, developers and general contractors hand their complex interiors to. Hand us a project — this is what happens next.',
  primary: { href: '#how', label: 'How we work' },
  secondary: { href: '#start', label: 'Send your project' },
}

export const audiences = {
  eyebrow: 'Who we work with',
  title: 'Built for the professional who owns the drawing.',
  items: [
    {
      key: 'designers',
      title: 'Interior designers',
      body: 'We do not simplify your intent. We find the engineering that lets it be built.',
    },
    {
      key: 'architects',
      title: 'Architects',
      body: 'Shop drawings, details and tolerances you can approve, then hold us to.',
    },
    {
      key: 'developers',
      title: 'Developers and general contractors',
      body: 'One contract, one schedule, one team responsible for the gaps between trades.',
    },
    {
      key: 'partners',
      title: 'Millwork partners',
      body: 'A production backend for your projects: your drawings, our plant, your name on the job.',
    },
  ],
} as const

export type Step = {
  key: string
  n: string
  title: string
  body: string
  deliverable: string
  gate?: string
}

export const howWeWork = {
  eyebrow: 'How we work',
  title: 'Six steps. Three signatures.',
  lede: 'A project moves through six steps you can follow. Three of them end with a stamp — nothing moves past it without your signature or ours.',
  rail: 'The sequence',
}

export const steps: readonly Step[] = [
  {
    key: 'consult',
    n: '01',
    title: 'Consult',
    body: 'Every project starts with the package, not a sales script. Send the drawings, the constraints, the calendar and the questions you cannot leave open. We read the brief as a production team: what is buildable, what is missing, which samples must be real before anyone talks about a date.',
    deliverable: 'A scoped estimate with the open questions listed, not hidden.',
  },
  {
    key: 'design',
    n: '02',
    title: 'Design',
    body: 'Engineering turns the concept into a set that can be cut. Joinery, materials, tolerances, hardware and edge conditions are resolved in drawings you can approve. You see the buildable version, not a mood and not a promise the floor cannot keep.',
    deliverable: 'Shop drawings, material and hardware schedule, physical samples.',
  },
  {
    key: 'confirm',
    n: '03',
    title: 'Confirm',
    body: 'Contract, specification, finishes and timeline lock in writing. Production does not start on a verbal maybe. If something in the set will not hold for the window or the budget, we say so here, before a machine moves.',
    deliverable: 'Signed contract and the approved drawing set as the single source of truth.',
    gate: 'Approved for Production',
  },
  {
    key: 'manufacture',
    n: '04',
    title: 'Manufacture',
    body: 'Procurement and manufacturing follow the approved set. The plant executes; it does not interpret. A control assembly proves the joinery before packing, and an inspector who did not build the piece reads it against the drawing.',
    deliverable: 'Batch photos as work progresses and a signed QC sheet per unit.',
    gate: 'QC Approved',
  },
  {
    key: 'deliver',
    n: '05',
    title: 'Deliver',
    body: 'Packing is part of the product. Crates are labelled to the install plan, so the site team knows what is in a box, which floor it belongs to and when it may move. Sea, road or air: the paperwork follows the same marks.',
    deliverable: 'Packing list keyed to drawing marks, loading photos, export documents.',
    gate: 'Approved for Shipment',
  },
  {
    key: 'support',
    n: '06',
    title: 'Support',
    body: 'Our crew installs, or your local team installs with our marks, drawings and remote support. Handover is documented by zone. Warranty terms are explicit. After the job we write down what held and what did not, so the next project inherits a tighter standard.',
    deliverable: 'Signed handover, warranty terms, one named contact after the job.',
  },
]

export const plant = {
  eyebrow: 'Made in our own plant',
  title: 'Engineering, production and inspection under one roof.',
  body: 'The drawing does not travel far from the people who cut it. Machining, veneer, finishing, assembly, quality control and packing are in one building in Kyiv region. Visit it, or walk it with us on a call.',
  facts: ['Own engineering office', 'Own production floor', 'Independent QC'],
}

export const capabilities = {
  eyebrow: 'Capabilities',
  title: 'If the interior is complex, the whole interior is our scope.',
  items: [
    { key: 'kitchens', title: 'Kitchens and built-ins', body: 'Carcass systems, fronts, worktops, integrated appliances.' },
    { key: 'wardrobes', title: 'Wardrobes and dressing rooms', body: 'Walk-in and built-in, with lighting and hardware.' },
    { key: 'walls', title: 'Wall systems and doors', body: 'Panelling, concealed doors, acoustic and feature walls.' },
    { key: 'millwork', title: 'Furniture and millwork', body: 'Loose pieces and the joinery that ties a room together.' },
  ],
} as const

export const projects = {
  eyebrow: 'Projects',
  title: 'Told the way they were built.',
  lede: 'Challenge, engineering, delivery, result. Photography and names are placeholders until the client releases the cases.',
  items: [
    {
      key: 'hospitality',
      title: 'Hotel, 64 keys',
      sector: 'Hospitality',
      challenge: 'One architect set repeated across rooms, with a fixed install window.',
      result: 'One approved assembly. Install ran to the window. The handover pack was the set that was built.',
    },
    {
      key: 'residential',
      title: 'Residential tower kitchens',
      sector: 'Residential',
      challenge: 'Developer drawings arrived as layouts and finish notes, not a buildable set.',
      result: 'Engineering closed the set before production. Units were packed and delivered by floor.',
    },
    {
      key: 'villa',
      title: 'Villa, Boka Bay',
      sector: 'Private residence',
      challenge: 'Full interior package for an Adriatic site with seasonal access.',
      result: 'Shipped by road and sea in two phases. Installed by our crew inside the agreed window.',
    },
  ],
} as const

export const ground = {
  eyebrow: 'On the ground',
  title: 'Someone in your time zone.',
  lede: 'We work directly with the design professional, not through dealers. In each market there is a person you can call.',
}

export const closing = {
  title: 'Your concept. Our responsibility for delivery.',
  cta: 'Send your project',
}

export const sendForm = {
  eyebrow: 'Start',
  title: 'Send your project',
  lede: 'Start as early as you can. Send the drawings you have today and we will tell you what happens next.',
  projectTypes: ['Hospitality', 'Residential', 'Workplace', 'Civic / cultural', 'Retail', 'Other'],
  timings: ['Already on a calendar', 'This quarter', 'This year', 'Exploring'],
  acceptHint: 'PDF, DWG, XLS or a cloud link',
  thanksTitle: 'Package noted.',
  thanksBody: 'A production lead reads the files next. This preview does not upload anything yet.',
}

export const footer = {
  tagline: 'B2B custom millwork manufacturing',
  languages: 'EN · UK',
  legal: 'Design Choice',
}

export const photos = {
  hero: '/images/hero-plant.jpg',
  detailA: '/images/hero-detail-a.jpg',
  detailB: '/images/hero-detail-b.jpg',
  process: '/images/process-floor.jpg',
  plant: '/images/company.jpg',
  capabilities: [
    '/images/mosaic-interior.jpg',
    '/images/mosaic-material.jpg',
    '/images/mosaic-geometry.jpg',
    '/images/mosaic-drawing.jpg',
  ],
  projects: ['/images/project-a.jpg', '/images/project-b.jpg', '/images/mosaic-interior.jpg'],
  cta: '/images/cta-floor.jpg',
}

export const brand = {
  logoDark: '/brand/Logo-02.svg',
  logoLight: '/brand/Logo-04.svg',
  iconDark: '/brand/icon-black.png',
}

export function gatesOf(items: readonly Step[]): string[] {
  return items.flatMap((step) => (step.gate ? [step.gate] : []))
}
