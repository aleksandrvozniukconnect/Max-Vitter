import { describe, expect, it } from 'vitest'
import {
  chromeInteractive,
  chromeOpacity,
  chromeTranslateY,
  clamp01,
  compactHeaderHeight,
  interpolateScale,
  introBandHeight,
  introEase,
  introEnabled,
  introProgress,
  introScrollDistance,
  logoIntroScale,
  startBandHeight,
  COMPACT_HEADER_DESKTOP,
  INTRO_MOBILE_MAX_WIDTH,
} from './logoIntro'

describe('introProgress', () => {
  it('is 0 at the top of the page while the track exists', () => {
    expect(introProgress(0, 800)).toBe(0)
    expect(introProgress(-10, 800)).toBe(0)
  })

  it('reaches 1 after the intro distance and stays there', () => {
    expect(introProgress(800, 800)).toBe(1)
    expect(introProgress(1200, 800)).toBe(1)
  })

  it('stays at the oversized start until distance is measured', () => {
    expect(introProgress(40, 0)).toBe(0)
  })

  it('skips the morph for reduced motion, compact override, or mobile', () => {
    expect(introProgress(0, 800, true)).toBe(1)
    expect(introEnabled(390)).toBe(false)
    expect(introEnabled(1440, true)).toBe(false)
    expect(introEnabled(1440)).toBe(true)
    expect(INTRO_MOBILE_MAX_WIDTH).toBe(899)
  })

  it('maps mid-track scroll linearly before easing', () => {
    expect(introProgress(200, 800)).toBe(0.25)
  })
})

describe('chrome fade', () => {
  it('keeps nav and utilities hidden until the band is nearly compact', () => {
    expect(chromeOpacity(0)).toBe(0)
    expect(chromeOpacity(0.7)).toBe(0)
    expect(chromeInteractive(0.7)).toBe(false)
    expect(chromeTranslateY(0)).toBe(-8)
  })

  it('reveals nav as the header settles', () => {
    expect(chromeOpacity(1)).toBe(1)
    expect(chromeInteractive(0.9)).toBe(true)
    expect(chromeTranslateY(1)).toBe(0)
  })
})

describe('top-left scale-in-place intro', () => {
  const slotWidth = 110
  const desktop = { width: 1440, height: 900 }

  it('starts as an oversized top-left wordmark several hundred px wide', () => {
    const scale = logoIntroScale(slotWidth, desktop)
    expect(scale).toBeGreaterThan(6)
    expect(slotWidth * scale).toBeGreaterThan(500)
    expect(slotWidth * scale).toBeLessThanOrEqual(880)
    expect(interpolateScale(scale, 0)).toBe(scale)
    expect(interpolateScale(scale, 1)).toBe(1)
  })

  it('shrinks the white band with the same eased progress as the logo', () => {
    const start = startBandHeight(desktop.height)
    const end = compactHeaderHeight(desktop.width)
    expect(start).toBeGreaterThan(desktop.height * 0.6)
    expect(end).toBe(COMPACT_HEADER_DESKTOP)
    expect(introBandHeight(0, start, end)).toBe(start)
    expect(introBandHeight(1, start, end)).toBe(end)

    const midBand = introBandHeight(0.5, start, end)
    expect(midBand).toBeLessThan(start)
    expect(midBand).toBeGreaterThan(end)
    expect(introScrollDistance(desktop)).toBe(start - end)
  })

  it('starts compact on ~390px viewports', () => {
    expect(introEnabled(390)).toBe(false)
    expect(introEnabled(899)).toBe(false)
    expect(introEnabled(900)).toBe(true)
    expect(compactHeaderHeight(390)).toBe(64)
    expect(interpolateScale(1, 0)).toBe(1)
  })

  it('returns identity scale when the slot cannot be measured', () => {
    expect(logoIntroScale(0, desktop)).toBe(1)
  })
})

describe('intro ease', () => {
  it('is a unit cubic-bezier that eases both ends', () => {
    expect(clamp01(-2)).toBe(0)
    expect(clamp01(2)).toBe(1)
    expect(introEase(0)).toBe(0)
    expect(introEase(1)).toBe(1)
    expect(introEase(0.25)).toBeLessThan(0.25)
    expect(introEase(0.75)).toBeGreaterThan(0.75)
    expect(introEase(0.5)).toBeGreaterThan(0.4)
    expect(introEase(0.5)).toBeLessThan(0.65)
  })
})
