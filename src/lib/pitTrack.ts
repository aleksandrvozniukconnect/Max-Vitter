/** Geometry of the pit-lane road that runs beside the "How we work" cards. */

/** Fallback road geometry, used when the header logo cannot be measured. */
export const ROAD_X = 113
export const ROAD_WIDTH = 60

/**
 * The road runs from the left edge of the logo to the vertical bar in it, so
 * its right edge meets that bar. The bar sits at this share of the logo width.
 */
export const LOGO_BAR = 0.367

export function roadFromLogo(logoLeft: number, logoWidth: number): { x: number; width: number } {
  const bar = logoLeft + LOGO_BAR * logoWidth
  const width = Math.max(40, bar - logoLeft)
  return { x: bar - width / 2, width }
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

export type Stop = {
  /** Vertical centre of the stop, relative to the band. */
  y: number
  /** Horizontal centre of the pit bay. */
  bayX: number
}

/**
 * Fractional stop index for a scroll line. The car parks at a stop while the
 * line is near the middle of its card and drives on in between.
 */
export function carStopIndex(line: number, centers: readonly number[]): number {
  if (centers.length === 0) return 0
  if (line <= centers[0]) return 0
  const last = centers.length - 1
  if (line >= centers[last]) return last
  let k = 0
  while (k < last - 1 && line >= centers[k + 1]) k += 1
  const frac = (line - centers[k]) / (centers[k + 1] - centers[k])
  return k + smooth(Math.min(1, Math.max(0, (frac - 0.15) / 0.7)))
}

/** Where the car is for a fractional stop index: on the road, or pulled into a bay. */
export function carPlacement(
  index: number,
  stops: readonly Stop[],
  roadX: number = ROAD_X,
): { x: number; y: number; angle: number } {
  if (stops.length === 0) return { x: roadX, y: 0, angle: 0 }
  const lo = Math.min(stops.length - 1, Math.max(0, Math.floor(index)))
  const hi = Math.min(stops.length - 1, lo + 1)
  const t = index - lo
  const y = stops[lo].y + (stops[hi].y - stops[lo].y) * t
  const nearest = t < 0.5 ? lo : hi
  const distance = Math.abs(index - nearest)
  const parked = 1 - smooth(Math.min(1, distance / 0.2))
  const x = roadX + (stops[nearest].bayX - roadX) * parked
  return { x, y, angle: -90 * parked }
}
