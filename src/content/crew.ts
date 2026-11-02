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
  { role: 'manager', x: 62, y: 5 },
  { role: 'estimator', x: 10, y: 10 },
  { role: 'engineer', x: 90, y: 10 },
  { role: 'designer', x: 6, y: 30 },
  { role: 'contracts', x: 93, y: 27 },
  { role: 'cnc', x: 4, y: 48 },
  { role: 'finishing', x: 5, y: 63 },
  { role: 'qc', x: 94, y: 62 },
  { role: 'logistics', x: 90, y: 80 },
  { role: 'installer', x: 36, y: 90 },
]
