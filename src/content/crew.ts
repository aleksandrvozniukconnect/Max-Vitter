/**
 * The pit crew in the "How we work" easter egg. Each role is one person in
 * the illustration and belongs to one stage of the process. Positions are
 * percentages of the picture, where the numbered marker is placed.
 */
export const crewRoles = [
  'manager',
  'estimator',
  'engineer',
  'designer',
  'contracts',
  'cnc',
  'finishing',
  'qc',
  'packing',
  'logistics',
  'installer',
] as const
export type CrewRole = (typeof crewRoles)[number]

export type CrewSpot = {
  role: CrewRole
  /** Marker position, percent of the picture width. */
  x: number
  /** Marker position, percent of the picture height. */
  y: number
}

export const crewSpots: readonly CrewSpot[] = [
  { role: 'manager', x: 52, y: 7 },
  { role: 'estimator', x: 17, y: 18 },
  { role: 'engineer', x: 85, y: 18 },
  { role: 'designer', x: 14, y: 33 },
  { role: 'contracts', x: 88, y: 32 },
  { role: 'cnc', x: 14, y: 50 },
  { role: 'finishing', x: 93, y: 47 },
  { role: 'qc', x: 14, y: 68 },
  { role: 'packing', x: 86, y: 62 },
  { role: 'logistics', x: 87, y: 79 },
  { role: 'installer', x: 50, y: 92 },
]
