import type {
  AudienceKey,
  CapabilityKey,
  FormProjectType,
  FormTiming,
  MarketId,
  NavKey,
  ProjectKey,
  StepKey,
} from '../content/site'
import type { CrewRole } from '../content/crew'
import type { FormErrorMessages } from '../lib/form'

type StepCopy = {
  title: string
  body: string
  deliverable: string
  gate?: string
  /** Optional checklist shown instead of the body text. */
  points?: string[]
  /** Keep the body text above the checklist. */
  showBody?: boolean
  pointsTitle?: string
  deliverablePoints?: string[]
  /** false hides the traffic light next to the stamp. */
  gateLight?: boolean
}

export type SiteCopy = {
  meta: { title: string; description: string }
  header: {
    homeAria: string
    primaryNavAria: string
    sendProject: string
    languageAria: string
    openMenu: string
    closeMenu: string
    menuAria: string
    home: string
  }
  nav: Record<NavKey, string>
  hero: {
    eyebrow: string
    title: string
    lede: string
    primary: string
    secondary: string
  }
  audiences: {
    eyebrow: string
    title: string
    items: Record<AudienceKey, { title: string; body: string }>
    note: string
  }
  howWeWork: {
    eyebrow: string
    title: string
    lede: string
    rail: string
    youReceive: string
    gateNote: string
    pace: string
    pitIn: string
    egg: { label: string; title: string; close: string; caption: string; roles: Record<CrewRole, string> }
  }
  steps: Record<StepKey, StepCopy>
  plant: {
    eyebrow: string
    title: string
    lead: string
    steps: [string, string, string, string]
    body: string
    facts: [string, string, string]
  }
  capabilities: {
    eyebrow: string
    title: string
    items: Record<CapabilityKey, { title: string; body: string }>
  }
  projects: {
    eyebrow: string
    title: string
    lede: string
    challenge: string
    result: string
    seeAll: string
    items: Record<
      ProjectKey,
      {
        title: string
        shortTitle: string
        sector: string
        /** Task and result describe only what the photos show: object type and visible materials. */
        challenge: string
        result: string
        tags: [string, string, string]
      }
    >
  }
  projectsPage: {
    meta: { title: string; description: string }
    eyebrow: string
    title: string
    lede: string
    lightbox: { open: string; close: string; prev: string; next: string; of: string; photos: string }
    indexLabel: string
    indexAria: string
    next: string
    empty: string
    ctaTitle: string
    cta: string
  }
  ground: {
    eyebrow: string
    title: string
    lede: string
  }
  markets: Record<MarketId, { label: string; city: string; role: string; person: string; heroLine: string }>
  closing: {
    title: string
    cta: string
  }
  sendForm: {
    eyebrow: string
    title: string
    lede: string
    name: string
    company: string
    country: string
    projectType: string
    timing: string
    comment: string
    cloudLink: string
    files: string
    select: string
    submit: string
    otherCountry: string
    acceptHint: string
    thanksTitle: string
    thanksBody: string
    projectTypes: { value: FormProjectType; label: string }[]
    timings: { value: FormTiming; label: string }[]
    errors: FormErrorMessages
  }
  footer: {
    tagline: string
    site: string
    language: string
    legal: string
  }
}

export const en: SiteCopy = {
  meta: {
    title: 'Design Choice — B2B furniture and millwork production',
    description:
      'Design Choice makes custom furniture and architectural millwork in Ukraine for designers, architects, developers and general contractors, from engineering to installation.',
  },
  header: {
    homeAria: 'Design Choice home',
    primaryNavAria: 'Primary',
    sendProject: 'Send project',
    languageAria: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuAria: 'Menu',
    home: 'Home',
  },
  nav: {
    how: 'How we work',
    capabilities: 'Capabilities',
    projects: 'Projects',
    start: 'Send your project',
  },
  hero: {
    eyebrow: 'B2B furniture and architectural millwork · Made in Ukraine',
    title: 'Complete solutions. Precise result.',
    lede: 'We build bespoke furniture and custom joinery from your design projects and drawings. We combine veneer, stone, metal, glass and HPL for commercial and residential projects.',
    primary: 'How we work',
    secondary: 'Send your project',
  },
  audiences: {
    eyebrow: 'Who we work with',
    title: 'We work for the people who draw and deliver the interior.',
    items: {
      developers: {
        title: 'Developers and general contractors',
        body: 'One contract and one schedule for all the furniture and millwork on site.',
      },
      designers: {
        title: 'Architects and designers',
        body: 'You approve shop drawings, joints and tolerances before anything is made.',
      },
    },
    note: 'At every stage you can bring in our own designer.',
  },
  howWeWork: {
    eyebrow: 'How we work',
    title: 'A pit stop for your project',
    lede: 'Your project pulls into our pit lane. Each function works its own zone, the project manager keeps the pace, and the next stage gets a green light only after a signature.',
    rail: 'Pit lane',
    youReceive: 'You receive',
    gateNote: 'Red light until signed',
    pace: 'The project manager sets the pace for every team',
    pitIn: 'Your project comes in',
    egg: {
      label: 'Who works on your project',
      title: 'Your pit-stop crew',
      close: 'Close',
      caption: 'Everyone around the car owns one stage of your project.',
      roles: {
        manager: 'Project manager',
        estimator: 'Estimator',
        engineer: 'Design engineer',
        designer: 'Our designer',
        contracts: 'Contracts manager',
        cnc: 'CNC operator',
        finishing: 'Finishing',
        qc: 'Quality control',
        logistics: 'Logistics',
        installer: 'Installer',
      },
    },
  },
  steps: {
    consult: {
      title: 'Analysis',
      body: 'We study the drawings, specifications and measurements, then estimate.',
      points: ['We receive the drawings', 'We run a detailed analysis', 'We clarify the details', 'We prepare the estimate'],
      deliverable: 'Estimate and a list of open questions',
    },
    design: {
      title: 'Technical part',
      body: 'Engineers prepare production drawings and samples from your design.',
      deliverable: 'Shop drawings, samples, specification',
    },
    confirm: {
      title: 'Contract',
      body: 'Scope, price, schedule, logistics and installation go into the contract.',
      deliverable: 'Signed contract and approved drawings',
      gate: 'Approved for Production',
    },
    manufacture: {
      title: 'Production',
      body: 'Cutting, CNC, veneer, assembly and finishing, then a test assembly on the production stand. Every stage is recorded on video.',
      deliverable: 'A signed QC sheet for every item',
      gate: 'QC Approved',
    },
    deliver: {
      title: 'Delivery',
      body: 'Every item is marked and comes with an electronic interactive instruction.',
      showBody: true,
      pointsTitle: 'Delivery',
      points: ['Sea', 'Air', 'Road'],
      deliverable: 'Cleared goods, documents, support',
      deliverablePoints: ['Goods cleared through customs', 'Documents', 'Support'],
      gate: 'FOB, CIF, DAP, EXW',
      gateLight: false,
    },
    support: {
      title: 'Installation',
      body: 'Our crew installs, or we guide your local team remotely. The warranty starts at handover.',
      deliverable: 'Handover by zone and warranty terms',
    },
  },
  plant: {
    eyebrow: 'Made in our own plant',
    title: 'Engineering, production and QC in one building.',
    lead: 'The whole cycle under one roof in the Kyiv region.',
    steps: ['Management', 'Design', 'Engineering office', 'Full-cycle production'],
    body: 'Come and see it, or we can walk you through the plant on a video call.',
    facts: ['Own engineering office', 'Own production floor', 'Independent QC'],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    title: 'What we take on as a production partner.',
    items: {
      kitchens: {
        title: 'Kitchens and built-ins',
        body: 'Cabinets, fronts, countertops, integrated appliances.',
      },
      wardrobes: {
        title: 'Wardrobes and dressing rooms',
        body: 'Walk-in and built-in, with lighting and hardware.',
      },
      walls: {
        title: 'Wall systems and doors',
        body: 'Paneling, concealed doors, acoustic and feature walls.',
      },
      millwork: {
        title: 'Furniture and millwork',
        body: 'Loose furniture and custom joinery for the whole room.',
      },
    },
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Selected projects',
    lede: 'Real work from our plant: kitchens, bathrooms, restaurant details and objects.',
    challenge: 'Task.',
    result: 'Result.',
    seeAll: 'See all projects',
    items: {
      house: {
        title: 'Private house',
        shortTitle: 'House',
        sector: 'Residential',
        challenge: 'A kitchen, wardrobes and bathrooms for one house, in one material language.',
        result:
          'A kitchen with wood fronts and an island, glass and brass display cabinets, sliding wardrobe doors and two bathrooms with fitted vanities.',
        tags: ['Wood fronts', 'Stone-look worktops', 'Brass and glass'],
      },
      restaurant: {
        title: 'Restaurant',
        shortTitle: 'Restaurant',
        sector: 'Hospitality',
        challenge: 'Interior details for a restaurant, in stone, brass and metal: a washbasin area and a bar.',
        result:
          'A green marble washbasin on a brass base, a bar front with a rock-like relief and vertical metal profiles.',
        tags: ['Marble and brass', 'Relief bar front', 'Metal profiles'],
      },
      apartment: {
        title: 'Apartment: kitchen and hallway',
        shortTitle: 'Apartment',
        sector: 'Residential',
        challenge: 'A kitchen and a hallway wardrobe for one apartment.',
        result:
          'Wood-effect upper units, concrete-effect fronts, a marble-effect worktop and splashback, and a wardrobe with a ribbed wood niche and coat hooks.',
        tags: ['Wood-effect fronts', 'Concrete-effect fronts', 'Marble-effect worktop'],
      },
      sculpture: {
        title: 'Wood sculpture',
        shortTitle: 'Sculpture',
        sector: 'Art object',
        challenge: 'A tall figure carved in wood as an art object.',
        result: 'A figure with a carved, textured surface, photographed in the workshop.',
        tags: ['Carved surface', 'Solid wood', 'Workshop'],
      },
      ceiling: {
        title: 'Suspended ceiling ring',
        shortTitle: 'Ceiling ring',
        sector: 'Construction',
        challenge: 'A circular ceiling element around a column, built on site.',
        result: 'A board-clad ring with an inner frame, shown during construction.',
        tags: ['Circular form', 'Board cladding', 'Inner frame'],
      },
      moss: {
        title: 'Moss wall',
        shortTitle: 'Moss wall',
        sector: 'Commercial interior',
        challenge: 'A lobby wall with a living green panel, lit from behind.',
        result: 'Backlit panels of moss and plants set into a dark wood wall.',
        tags: ['Moss and plants', 'Backlit panels', 'Dark wood'],
      },
      washroom: {
        title: 'Washroom with round mirrors',
        shortTitle: 'Round mirrors',
        sector: 'Interior',
        challenge: 'A vanity zone with round backlit mirrors.',
        result: 'A floating dark vanity with two vessel basins under backlit round mirrors, against stone-look walls.',
        tags: ['Backlit mirrors', 'Floating vanity', 'Vessel basins'],
      },
      concrete: {
        title: 'Concrete decor and lamps',
        shortTitle: 'Concrete decor',
        sector: 'Objects',
        challenge: 'Decor and light fittings cast in concrete.',
        result: 'Pendant lamps, vases, planters and a bench in concrete, and sets of small cast tiles.',
        tags: ['Pendant lamps', 'Vases and planters', 'Cast tiles'],
      },
    },
  },
  projectsPage: {
    meta: {
      title: 'Projects — Design Choice',
      description:
        'Design Choice projects: a private house, a restaurant, an apartment kitchen and hallway, a wood sculpture and a ceiling ring.',
    },
    eyebrow: 'Portfolio',
    title: 'Our projects',
    lede: 'Selected work, from kitchens and bathrooms to restaurant details and objects.',
    lightbox: {
      open: 'Open photo',
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
      of: 'of',
      photos: 'Photos',
    },    indexLabel: 'Case',
    indexAria: 'Case index',
    next: 'Next case',
    empty: 'No cases published yet.',
    ctaTitle: 'Have drawings for a new project?',
    cta: 'Send your project',
  },
  ground: {
    eyebrow: 'On the ground',
    title: 'A contact in your time zone',
    lede: 'We work directly with designers, architects and contractors, without dealers. Each market has its own contact.',
  },
  markets: {
    UA: {
      label: 'Ukraine',
      city: 'Kyiv region',
      role: 'Production, engineering, QC',
      person: 'Name, role',
      heroLine: 'Production and engineering in the Kyiv region. Projects in Ukraine, the United States and Montenegro.',
    },
    US: {
      label: 'United States',
      city: 'Miami / New York',
      role: 'Project desk, install crews',
      person: 'Name, role',
      heroLine: 'A US project desk in your time zone. We produce in Ukraine and label every crate to your floor plan.',
    },
    ME: {
      label: 'Montenegro',
      city: 'Tivat / Boka Bay',
      role: 'Site coordination, partner install',
      person: 'Name, role',
      heroLine: 'Site coordination on the Boka Bay, with installation dates planned around the Adriatic season.',
    },
  },
  closing: {
    title: 'Send us the drawings. We start with the analysis.',
    cta: 'Send your project',
  },
  sendForm: {
    eyebrow: 'Start',
    title: 'Send your project',
    lede: 'Attach drawings, specifications or a cloud link. We reply with questions and the next steps.',
    name: 'Name',
    company: 'Company',
    country: 'Country',
    projectType: 'Project type',
    timing: 'Timing',
    comment: 'Comment',
    cloudLink: 'Cloud link',
    files: 'Files',
    select: 'Select',
    submit: 'Send your project',
    otherCountry: 'Other',
    acceptHint: 'PDF, DWG, XLS or a cloud link',
    thanksTitle: 'Thank you.',
    thanksBody: 'Online sending is not connected yet. Please email the files to the address above.',
    projectTypes: [
      { value: 'Hospitality', label: 'Hospitality' },
      { value: 'Residential', label: 'Residential' },
      { value: 'Workplace', label: 'Workplace' },
      { value: 'Civic / cultural', label: 'Civic / cultural' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Other', label: 'Other' },
    ],
    timings: [
      { value: 'Already on a calendar', label: 'Already on a calendar' },
      { value: 'This quarter', label: 'This quarter' },
      { value: 'This year', label: 'This year' },
      { value: 'Exploring', label: 'Exploring' },
    ],
    errors: {
      name: 'Name is required.',
      company: 'Company is required.',
      country: 'Country is required.',
      projectType: 'Project type is required.',
      timing: 'Timing is required.',
      files: 'Use PDF, DWG or XLS, or a cloud link.',
      comment: 'Add a short comment, a file or a cloud link.',
    },
  },
  footer: {
    tagline: 'B2B custom furniture and millwork manufacturing',
    site: 'Site',
    language: 'Language',
    legal: 'Design Choice',
  },
}
