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

export const audienceKeys = ['developers', 'designers'] as const
export type AudienceKey = (typeof audienceKeys)[number]

export const capabilityKeys = ['kitchens', 'wardrobes', 'walls', 'millwork'] as const
export type CapabilityKey = (typeof capabilityKeys)[number]

/** Real projects, in the order shown on the Projects page. The first three are featured on the home page. */
export const projectKeys = [
  'house',
  'restaurant',
  'apartment',
  'sculpture',
  'ceiling',
  'moss',
  'washroom',
  'concrete',
] as const
export type ProjectKey = (typeof projectKeys)[number]

export const FEATURED_PROJECT_COUNT = 3
export const featuredProjectKeys: readonly ProjectKey[] = projectKeys.slice(0, FEATURED_PROJECT_COUNT)

export const projectCases = [
  { key: 'house', n: '01' },
  { key: 'restaurant', n: '02' },
  { key: 'apartment', n: '03' },
  { key: 'sculpture', n: '04' },
  { key: 'ceiling', n: '05' },
  { key: 'moss', n: '06' },
  { key: 'washroom', n: '07' },
  { key: 'concrete', n: '08' },
] as const satisfies readonly { key: ProjectKey; n: string }[]

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
  hero: '/images/hero-plant.webp',
  detailA: '/images/hero-detail-a.webp',
  detailB: '/images/hero-detail-b.webp',
  process: '/images/process-floor.webp',
  plant: '/images/projects/house/01.webp',
  capabilities: [
    '/images/mosaic-interior.webp',
    '/images/mosaic-material.webp',
    '/images/mosaic-geometry.webp',
    '/images/mosaic-drawing.webp',
  ],
  cta: '/images/cta-floor.webp',
}

export const brand = {
  logoDark: '/brand/Logo-02.svg',
  logoLight: '/brand/Logo-04.svg',
  iconDark: '/brand/icon-black.png',
}

export function gatesOf(items: readonly Step[]): GateId[] {
  return items.flatMap((step) => (step.gate ? [step.gate] : []))
}
