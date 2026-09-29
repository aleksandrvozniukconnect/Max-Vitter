export const marketIds = ['UA', 'US', 'ME'] as const
export type MarketId = (typeof marketIds)[number]

export type MarketFacts = {
  id: MarketId
  phone: string
  email: string
  hours: string
}

export const marketFacts: Record<MarketId, MarketFacts> = {
  UA: {
    id: 'UA',
    phone: '+380 44 000 00 00',
    email: 'ua@designchoice.work',
    hours: '09:00–18:00 EET',
  },
  US: {
    id: 'US',
    phone: '+1 646 000 0000',
    email: 'us@designchoice.work',
    hours: '09:00–18:00 ET',
  },
  ME: {
    id: 'ME',
    phone: '+382 20 000 000',
    email: 'me@designchoice.work',
    hours: '09:00–18:00 CET',
  },
}

export const nav = [
  { key: 'how', href: '/#how' },
  { key: 'capabilities', href: '/#capabilities' },
  { key: 'projects', href: '/projects' },
  { key: 'start', href: '/#start' },
] as const

export type NavKey = (typeof nav)[number]['key']

export const audienceKeys = ['designers', 'architects', 'developers', 'partners'] as const
export type AudienceKey = (typeof audienceKeys)[number]

export const capabilityKeys = ['kitchens', 'wardrobes', 'walls', 'millwork'] as const
export type CapabilityKey = (typeof capabilityKeys)[number]

export const projectKeys = ['hospitality', 'residential', 'villa'] as const
export type ProjectKey = (typeof projectKeys)[number]

export const projectCases = [
  { key: 'hospitality', n: '01', market: 'UA' },
  { key: 'residential', n: '02', market: 'US' },
  { key: 'villa', n: '03', market: 'ME' },
] as const satisfies readonly { key: ProjectKey; n: string; market: MarketId }[]

export const stepKeys = ['consult', 'design', 'confirm', 'manufacture', 'deliver', 'support'] as const
export type StepKey = (typeof stepKeys)[number]

export const gateIds = ['production', 'qc', 'shipment'] as const
export type GateId = (typeof gateIds)[number]

export type Step = {
  key: StepKey
  n: string
  gate?: GateId
}

export const steps: readonly Step[] = [
  { key: 'consult', n: '01' },
  { key: 'design', n: '02' },
  { key: 'confirm', n: '03', gate: 'production' },
  { key: 'manufacture', n: '04', gate: 'qc' },
  { key: 'deliver', n: '05', gate: 'shipment' },
  { key: 'support', n: '06' },
]

export const formProjectTypeValues = [
  'Hospitality',
  'Residential',
  'Workplace',
  'Civic / cultural',
  'Retail',
  'Other',
] as const

export type FormProjectType = (typeof formProjectTypeValues)[number]

export const formTimingValues = [
  'Already on a calendar',
  'This quarter',
  'This year',
  'Exploring',
] as const

export type FormTiming = (typeof formTimingValues)[number]

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

export function gatesOf(items: readonly Step[]): GateId[] {
  return items.flatMap((step) => (step.gate ? [step.gate] : []))
}
