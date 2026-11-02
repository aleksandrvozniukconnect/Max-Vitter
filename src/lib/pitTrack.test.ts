import { describe, expect, it } from 'vitest'
import { LOGO_BAR, ROAD_X, carPlacement, driveEase, roadFromLogo, targetStop } from './pitTrack'

const centers = [100, 400, 700, 1000]
const stops = centers.map((y) => ({ y, bayX: 200 }))

describe('pit track car', () => {
  it('picks the card that is fully inside the viewport', () => {
    const cards = [
      { top: -300, bottom: 200 },
      { top: 220, bottom: 720 },
      { top: 740, bottom: 1240 },
    ]
    expect(targetStop(cards, 90, 800)).toBe(1)
    expect(targetStop([{ top: 100, bottom: 600 }], 90, 800)).toBe(0)
  })

  it('stays on the current stop while no card fits entirely', () => {
    const cards = [
      { top: -200, bottom: 300 },
      { top: 320, bottom: 820 },
    ]
    expect(targetStop(cards, 90, 800, 0)).toBe(0)
    // Current card scrolled out: fall back to the one nearest the middle.
    expect(targetStop([{ top: -600, bottom: -100 }, { top: -80, bottom: 420 }], 90, 800, 0)).toBe(1)
  })

  it('eases from 0 to 1', () => {
    expect(driveEase(0)).toBe(0)
    expect(driveEase(1)).toBe(1)
    expect(driveEase(0.5)).toBeCloseTo(0.5, 5)
  })

  it('pulls into the bay when parked and drives on the road between stops', () => {
    const parked = carPlacement(1, stops)
    expect(parked).toEqual({ x: 200, y: 400, angle: -90 })
    const driving = carPlacement(1.5, stops)
    expect(driving.x).toBe(ROAD_X)
    expect(driving.angle).toBeCloseTo(0, 5)
    expect(driving.y).toBe(550)
  })

  it('keeps the right edge of the road on the bar of the logo', () => {
    const road = roadFromLogo(55, 235)
    expect(road.x + road.width / 2).toBeCloseTo(55 + LOGO_BAR * 235, 5)
    expect(road.x - road.width / 2).toBeCloseTo(55, 5)
  })
})
