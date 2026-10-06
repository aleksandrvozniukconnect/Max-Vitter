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
import type { FormErrorMessages } from '../lib/form'

type StepCopy = {
  title: string
  body: string
  deliverable: string
  gate?: string
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
    pitOut: string
  }
  steps: Record<StepKey, StepCopy>
  plant: {
    eyebrow: string
    title: string
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
        challenge: string
        result: string
        tags: [string, string, string]
        placeholder: string
      }
    >
  }
  projectsPage: {
    meta: { title: string; description: string }
    eyebrow: string
    title: string
    lede: string
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
    title: 'Complex intent. Precise result.',
    lede: 'Design Choice builds furniture and millwork for designers, architects, developers and general contractors, from engineering drawings to handover on site.',
    primary: 'How we work',
    secondary: 'Send your project',
  },
  audiences: {
    eyebrow: 'Who we work with',
    title: 'We work for the people who draw and deliver the interior.',
    items: {
      designers: {
        title: 'Interior designers',
        body: 'We keep your design and work out the engineering to build it.',
      },
      architects: {
        title: 'Architects',
        body: 'You approve shop drawings, joints and tolerances before anything is cut.',
      },
      developers: {
        title: 'Developers and general contractors',
        body: 'One contract and one schedule for all the furniture and millwork on site.',
      },
      partners: {
        title: 'Millwork partners',
        body: 'We produce to your drawings in our plant. The project stays under your name.',
      },
    },
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
    pitOut: 'It leaves as a finished interior: installed, adjusted and handed over',
  },
  steps: {
    consult: {
      title: 'Analysis',
      body: 'We study the drawings, specifications and measurements, then estimate.',
      deliverable: 'Estimate and a list of open questions',
    },
    design: {
      title: 'Engineering',
      body: 'Engineers turn the design into production drawings and samples.',
      deliverable: 'Shop drawings, samples, hardware list',
    },
    confirm: {
      title: 'Contract',
      body: 'Scope, price, schedule, logistics and installation go into the contract.',
      deliverable: 'Signed contract and approved drawings',
      gate: 'Approved for Production',
    },
    manufacture: {
      title: 'Production',
      body: 'Cutting, CNC, veneer, assembly and finishing, then a test assembly in the plant.',
      deliverable: 'A signed QC sheet for every item',
      gate: 'QC Approved',
    },
    deliver: {
      title: 'Delivery',
      body: 'Every crate is labeled with its item and room. Sea, road or air.',
      deliverable: 'Packing list and export documents',
      gate: 'Approved for Shipment',
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
    body: 'Machining, veneer, finishing, assembly, quality control and packing all happen in one plant in the Kyiv region. Come and see it, or we can walk you through it on a video call.',
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
    lede: 'Each case covers the task, the engineering, the delivery and the result.',
    challenge: 'Task.',
    result: 'Result.',
    seeAll: 'See all projects',
    items: {
      hospitality: {
        title: 'Hotel, 64 keys',
        shortTitle: 'Hotel',
        sector: 'Hospitality',
        challenge: 'One architectural set repeated across rooms, with a fixed install window.',
        result: 'We approved one assembly for every room and installed inside the window.',
        tags: ['Repeating set', 'Guest rooms', 'Veneer'],
        placeholder: 'Project photos coming soon',
      },
      residential: {
        title: 'Residential tower kitchens',
        shortTitle: 'Tower kitchens',
        sector: 'Residential',
        challenge: 'The developer sent layouts and finish notes, not production drawings.',
        result: 'We completed the drawings before production and delivered the kitchens floor by floor.',
        tags: ['Kitchens', 'By floor', 'Developer set'],
        placeholder: 'Project photos coming soon',
      },
      villa: {
        title: 'Villa, Boka Bay',
        shortTitle: 'Boka Bay',
        sector: 'Private residence',
        challenge: 'A full interior for an Adriatic site with seasonal access.',
        result: 'Two shipments by road and sea, installed by our crew on the agreed dates.',
        tags: ['Full interior', 'Road + sea', 'Seasonal access'],
        placeholder: 'Project photos coming soon',
      },
    },
  },
  projectsPage: {
    meta: {
      title: 'Projects — Design Choice',
      description:
        'Design Choice projects: a hotel, residential tower kitchens and a private villa on the Adriatic. Task, engineering, delivery, result.',
    },
    eyebrow: 'Portfolio',
    title: 'Our projects',
    lede: 'Three projects, each told from the first drawing to handover.',
    indexLabel: 'Case',
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
      role: 'Plant, engineering, QC',
      person: 'Name, role',
      heroLine: 'Plant and engineering in the Kyiv region. Projects in Ukraine, the United States and Montenegro.',
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
