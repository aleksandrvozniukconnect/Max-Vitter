import { steps } from '../content/site'

export const WIDTH = 280
export const HEIGHT = 640
const TOP = 56
const BOTTOM = 584
export const ROAD = 44

/** Centre line of the hand-drawn road: a gentle S-curve down the panel. */
export function roadX(y: number): number {
  return 74 + 20 * Math.sin((y / HEIGHT) * Math.PI * 3)
}

export const stopY = steps.map((_, i) => TOP + ((BOTTOM - TOP) * i) / (steps.length - 1))

export const roadPath = (() => {
  const points: string[] = []
  for (let y = 0; y <= HEIGHT; y += 8) {
    points.push(`${points.length ? 'L' : 'M'}${roadX(y).toFixed(1)} ${y}`)
  }
  return points.join(' ')
})()

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * Where the car is along the road, as a fractional stop index. The car
 * parks at a stop while its chapter is in view and drives on in between.
 */
export function carStopIndex(progress: number, count = steps.length): number {
  const x = Math.min(count - 1, Math.max(0, progress * count - 0.5))
  const base = Math.min(count - 2, Math.floor(x))
  const frac = Math.min(1, Math.max(0, (x - base - 0.25) / 0.5))
  return base + smooth(frac)
}

export function carPose(index: number): { x: number; y: number; angle: number } {
  const lo = Math.min(stopY.length - 2, Math.max(0, Math.floor(index)))
  const y = stopY[lo] + (stopY[lo + 1] - stopY[lo]) * (index - lo)
  const slope = (roadX(y + 1) - roadX(y - 1)) / 2
  return { x: roadX(y), y, angle: (-Math.atan(slope) * 180) / Math.PI }
}

