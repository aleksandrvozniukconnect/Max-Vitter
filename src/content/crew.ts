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
  { role: 'manager', x: 50, y: 6 },
  { role: 'estimator', x: 21, y: 12 },
  { role: 'engineer', x: 75, y: 14 },
  { role: 'designer', x: 19, y: 30 },
  { role: 'contracts', x: 85, y: 32 },
  { role: 'cnc', x: 12, y: 47 },
  { role: 'finishing', x: 17, y: 64 },
  { role: 'qc', x: 84, y: 64 },
  { role: 'logistics', x: 75, y: 79 },
  { role: 'installer', x: 49, y: 89 },
]
