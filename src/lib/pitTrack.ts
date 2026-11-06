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

export type Span = { top: number; bottom: number }

/**
 * The stop the car should be at: the card that sits fully inside the viewport
 * (nearest to its middle if several do). When no card fits entirely, such as
 * tall cards on a small screen, the card closest to the middle of the
 * viewport wins. `current` keeps the car where it is while nothing changes.
 */
export function targetStop(cards: readonly Span[], viewTop: number, viewBottom: number, current = 0): number {
  if (cards.length === 0) return 0
  const middle = (viewTop + viewBottom) / 2
  const distance = (card: Span) => Math.abs((card.top + card.bottom) / 2 - middle)
  let best = -1
  cards.forEach((card, i) => {
    if (card.top >= viewTop && card.bottom <= viewBottom && (best < 0 || distance(card) < distance(cards[best]))) {
      best = i
    }
  })
  if (best >= 0) return best
  // Between cards: keep the current stop until another card is fully visible,
  // unless the current one has left the screen altogether.
  const cur = cards[Math.min(current, cards.length - 1)]
  if (cur.bottom > viewTop && cur.top < viewBottom) return Math.min(current, cards.length - 1)
  let nearest = 0
  cards.forEach((card, i) => {
    if (distance(card) < distance(cards[nearest])) nearest = i
  })
  return nearest
}

/** Smooth ease for the drive between two stops, 0..1. */
export function driveEase(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  // Mostly even speed so the drive reads as one steady movement.
  return 0.6 * x + 0.4 * smooth(x)
}

/** Where the car is for a fractional stop index: on the road, or pulled into a bay. */
export function carPlacement(
  index: number,
  stops: readonly Stop[],
  roadX: number = ROAD_X,
  /** Where the road starts: index -1 is here, driving down to stop 0. */
  startY?: number,
): { x: number; y: number; angle: number } {
  if (stops.length === 0) return { x: roadX, y: 0, angle: 0 }
  if (index < 0) {
    const first = stops[0].y
    const from = startY ?? first - 300
    return { x: roadX, y: first + (first - from) * Math.max(-1, index), angle: 0 }
  }
  const lo = Math.min(stops.length - 1, Math.max(0, Math.floor(index)))
  const hi = Math.min(stops.length - 1, lo + 1)
  const t = index - lo
  const y = stops[lo].y + (stops[hi].y - stops[lo].y) * t
  const nearest = t < 0.5 ? lo : hi
  const distance = Math.abs(index - nearest)
  const parked = 1 - smooth(Math.min(1, distance / 0.18))
  const x = roadX + (stops[nearest].bayX - roadX) * parked
  return { x, y, angle: -90 * parked }
}
