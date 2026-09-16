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
    marketOverlayAria: string
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
    items: Record<ProjectKey, { title: string; sector: string; challenge: string; result: string }>
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
    title: 'Design Choice — B2B millwork production partner',
    description:
      'Design Choice — Ukrainian B2B production partner for custom millwork and joinery. Six steps, three signatures, one accountable team from drawing to handover.',
  },
  header: {
    homeAria: 'Design Choice home',
    primaryNavAria: 'Primary',
    sendProject: 'Send project',
    marketOverlayAria: 'Market overlay',
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
    eyebrow: 'B2B millwork and custom joinery · Ukraine',
    title: 'One partner. Every stage. One accountable result.',
    lede: 'Design Choice is the plant that designers, architects, developers and general contractors hand their complex interiors to. Hand us a project — this is what happens next.',
    primary: 'How we work',
    secondary: 'Send your project',
  },
  audiences: {
    eyebrow: 'Who we work with',
    title: 'Built for the professional who owns the drawing.',
    items: {
      designers: {
        title: 'Interior designers',
        body: 'We do not simplify your intent. We find the engineering that lets it be built.',
      },
      architects: {
        title: 'Architects',
        body: 'Shop drawings, details and tolerances you can approve, then hold us to.',
      },
      developers: {
        title: 'Developers and general contractors',
        body: 'One contract, one schedule, one team responsible for the gaps between trades.',
      },
      partners: {
        title: 'Millwork partners',
        body: 'A production backend for your projects: your drawings, our plant, your name on the job.',
      },
    },
  },
  howWeWork: {
    eyebrow: 'How we work',
    title: 'Six steps. Three signatures.',
    lede: 'A project moves through six steps you can follow. Three of them end with a stamp — nothing moves past it without your signature or ours.',
    rail: 'The sequence',
    youReceive: 'You receive',
    gateNote: 'Signed before the next step moves.',
  },
  steps: {
    consult: {
      title: 'Consult',
      body: 'Every project starts with the package, not a sales script. Send the drawings, the constraints, the calendar and the questions you cannot leave open. We read the brief as a production team: what is buildable, what is missing, which samples must be real before anyone talks about a date.',
      deliverable: 'A scoped estimate with the open questions listed, not hidden.',
    },
    design: {
      title: 'Design',
      body: 'Engineering turns the concept into a set that can be cut. Joinery, materials, tolerances, hardware and edge conditions are resolved in drawings you can approve. You see the buildable version, not a mood and not a promise the floor cannot keep.',
      deliverable: 'Shop drawings, material and hardware schedule, physical samples.',
    },
    confirm: {
      title: 'Confirm',
      body: 'Contract, specification, finishes and timeline lock in writing. Production does not start on a verbal maybe. If something in the set will not hold for the window or the budget, we say so here, before a machine moves.',
      deliverable: 'Signed contract and the approved drawing set as the single source of truth.',
      gate: 'Approved for Production',
    },
    manufacture: {
      title: 'Manufacture',
      body: 'Procurement and manufacturing follow the approved set. The plant executes; it does not interpret. A control assembly proves the joinery before packing, and an inspector who did not build the piece reads it against the drawing.',
      deliverable: 'Batch photos as work progresses and a signed QC sheet per unit.',
      gate: 'QC Approved',
    },
    deliver: {
      title: 'Deliver',
      body: 'Packing is part of the product. Crates are labelled to the install plan, so the site team knows what is in a box, which floor it belongs to and when it may move. Sea, road or air: the paperwork follows the same marks.',
      deliverable: 'Packing list keyed to drawing marks, loading photos, export documents.',
      gate: 'Approved for Shipment',
    },
    support: {
      title: 'Support',
      body: 'Our crew installs, or your local team installs with our marks, drawings and remote support. Handover is documented by zone. Warranty terms are explicit. After the job we write down what held and what did not, so the next project inherits a tighter standard.',
      deliverable: 'Signed handover, warranty terms, one named contact after the job.',
    },
  },
  plant: {
    eyebrow: 'Made in our own plant',
    title: 'Engineering, production and inspection under one roof.',
    body: 'The drawing does not travel far from the people who cut it. Machining, veneer, finishing, assembly, quality control and packing are in one building in Kyiv region. Visit it, or walk it with us on a call.',
    facts: ['Own engineering office', 'Own production floor', 'Independent QC'],
  },
  capabilities: {
    eyebrow: 'Capabilities',
    title: 'If the interior is complex, the whole interior is our scope.',
    items: {
      kitchens: {
        title: 'Kitchens and built-ins',
        body: 'Carcass systems, fronts, worktops, integrated appliances.',
      },
      wardrobes: {
        title: 'Wardrobes and dressing rooms',
        body: 'Walk-in and built-in, with lighting and hardware.',
      },
      walls: {
        title: 'Wall systems and doors',
        body: 'Panelling, concealed doors, acoustic and feature walls.',
      },
      millwork: {
        title: 'Furniture and millwork',
        body: 'Loose pieces and the joinery that ties a room together.',
      },
    },
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Told the way they were built.',
    lede: 'Challenge, engineering, delivery, result. Photography and names are placeholders until the client releases the cases.',
    challenge: 'Challenge.',
    result: 'Result.',
    items: {
      hospitality: {
        title: 'Hotel, 64 keys',
        sector: 'Hospitality',
        challenge: 'One architect set repeated across rooms, with a fixed install window.',
        result: 'One approved assembly. Install ran to the window. The handover pack was the set that was built.',
      },
      residential: {
        title: 'Residential tower kitchens',
        sector: 'Residential',
        challenge: 'Developer drawings arrived as layouts and finish notes, not a buildable set.',
        result: 'Engineering closed the set before production. Units were packed and delivered by floor.',
      },
      villa: {
        title: 'Villa, Boka Bay',
        sector: 'Private residence',
        challenge: 'Full interior package for an Adriatic site with seasonal access.',
        result: 'Shipped by road and sea in two phases. Installed by our crew inside the agreed window.',
      },
    },
  },
  ground: {
    eyebrow: 'On the ground',
    title: 'Someone in your time zone.',
    lede: 'We work directly with the design professional, not through dealers. In each market there is a person you can call.',
  },
  markets: {
    UA: {
      label: 'Ukraine',
      city: 'Kyiv region',
      role: 'Plant, engineering, QC',
      person: 'Name, role',
      heroLine: 'Plant and engineering in Kyiv region. Projects in Ukraine, the United States and the Adriatic.',
    },
    US: {
      label: 'United States',
      city: 'Miami / New York',
      role: 'Project desk, install crews',
      person: 'Name, role',
      heroLine: 'A US project desk in your time zone. Production stays in Ukraine; the crate arrives labelled to your floor plan.',
    },
    ME: {
      label: 'Montenegro',
      city: 'Tivat / Boka Bay',
      role: 'Site coordination, partner install',
      person: 'Name, role',
      heroLine: 'Site coordination on the Boka Bay. The same sequence, with install windows planned around the Adriatic season.',
    },
  },
  closing: {
    title: 'Your concept. Our responsibility for delivery.',
    cta: 'Send your project',
  },
  sendForm: {
    eyebrow: 'Start',
    title: 'Send your project',
    lede: 'Start as early as you can. Send the drawings you have today and we will tell you what happens next.',
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
    thanksTitle: 'Package noted.',
    thanksBody: 'A production lead reads the files next. This preview does not upload anything yet.',
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
      files: 'Use PDF, DWG, or XLS — or a cloud link.',
      comment: 'Add a short comment, a file, or a cloud link.',
    },
  },
  footer: {
    tagline: 'B2B custom millwork manufacturing',
    site: 'Site',
    language: 'Language',
    legal: 'Design Choice',
  },
}
