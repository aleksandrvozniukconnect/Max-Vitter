/**
 * The pit crew in the "How we work" easter egg. Each role stands at the
 * car like a pit-stop mechanic and belongs to one stage of the process.
 * Positions are in the 800x600 drawing space of PitCrewArt.
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
  x: number
  y: number
  /** Which way the person faces, in degrees (0 = up the page). */
  facing: number
  /** Which side the name tag sits on. */
  tag: 'left' | 'right'
}

export const crewSpots: readonly CrewSpot[] = [
  { role: 'manager', x: 330, y: 70, facing: 160, tag: 'left' },
  { role: 'estimator', x: 270, y: 190, facing: 90, tag: 'left' },
  { role: 'engineer', x: 270, y: 300, facing: 90, tag: 'left' },
  { role: 'designer', x: 270, y: 410, facing: 90, tag: 'left' },
  { role: 'contracts', x: 340, y: 540, facing: 20, tag: 'left' },
  { role: 'cnc', x: 530, y: 190, facing: -90, tag: 'right' },
  { role: 'finishing', x: 530, y: 300, facing: -90, tag: 'right' },
  { role: 'qc', x: 530, y: 410, facing: -90, tag: 'right' },
  { role: 'logistics', x: 460, y: 540, facing: -20, tag: 'right' },
  { role: 'installer', x: 470, y: 70, facing: -160, tag: 'right' },
]
