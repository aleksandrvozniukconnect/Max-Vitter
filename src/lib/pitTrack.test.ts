import { describe, expect, it } from 'vitest'
import { carPose, carStopIndex, stopY } from './pitTrack'

describe('pit track car', () => {
  it('parks on a stop while its chapter is centred', () => {
    // chapter i is centred at progress (i + 0.5) / 6
    for (let i = 0; i < 6; i += 1) {
      expect(carStopIndex((i + 0.5) / 6)).toBeCloseTo(i, 5)
    }
  })

  it('never leaves the road ends and only moves forward', () => {
    let last = -1
    for (let p = 0; p <= 1.0001; p += 0.01) {
      const index = carStopIndex(p)
      expect(index).toBeGreaterThanOrEqual(last)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(index).toBeLessThanOrEqual(5)
      last = index
    }
  })

  it('maps stop indices to stop positions', () => {
    expect(carPose(0).y).toBe(stopY[0])
    expect(carPose(5).y).toBeCloseTo(stopY[5], 5)
  })
})
