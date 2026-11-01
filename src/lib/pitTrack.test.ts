import { describe, expect, it } from 'vitest'
import { ROAD_X, carPlacement, carStopIndex } from './pitTrack'

const centers = [100, 400, 700, 1000]
const stops = centers.map((y) => ({ y, bayX: 200 }))

describe('pit track car', () => {
  it('parks on a stop while its card is at the scroll line', () => {
    centers.forEach((c, i) => expect(carStopIndex(c, centers)).toBeCloseTo(i, 5))
    expect(carStopIndex(-50, centers)).toBe(0)
    expect(carStopIndex(5000, centers)).toBe(3)
  })

  it('only moves forward as the line moves down', () => {
    let last = -1
    for (let line = 0; line <= 1100; line += 10) {
      const index = carStopIndex(line, centers)
      expect(index).toBeGreaterThanOrEqual(last)
      last = index
    }
  })

  it('pulls into the bay when parked and drives on the road between stops', () => {
    const parked = carPlacement(1, stops)
    expect(parked).toEqual({ x: 200, y: 400, angle: -90 })
    const driving = carPlacement(1.5, stops)
    expect(driving.x).toBe(ROAD_X)
    expect(driving.angle).toBeCloseTo(0, 5)
    expect(driving.y).toBe(550)
  })
})
