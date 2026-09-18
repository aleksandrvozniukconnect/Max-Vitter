import { describe, expect, it } from 'vitest'
import {
  chromeInteractive,
  chromeOpacity,
  chromeTranslateY,
  clamp01,
  compactHeaderHeight,
  compactLogoSecondLinePx,
  interpolateScale,
  introBandHeight,
  introEase,
  introEnabled,
  introProgress,
  introScrollDistance,
  logoIntroScale,
  oversizedLogoHeight,
  startBandHeight,
  CHROME_FADE_START,
  COMPACT_HEADER_DESKTOP,
  COMPACT_HEADER_MOBILE,
  COMPACT_LOGO_DESKTOP,
  COMPACT_LOGO_MOBILE,
  HEADER_PAD_Y_DESKTOP,
  HEADER_PAD_Y_MOBILE,
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
  it('keeps nav, language switcher, hamburger and Send project hidden until the band is nearly compact', () => {
    expect(CHROME_FADE_START).toBe(0.72)
    expect(chromeOpacity(0)).toBe(0)
    expect(chromeOpacity(0.5)).toBe(0)
    expect(chromeOpacity(CHROME_FADE_START)).toBe(0)
    expect(chromeOpacity(0.7)).toBe(0)
    expect(chromeInteractive(0.7)).toBe(false)
    expect(chromeInteractive(CHROME_FADE_START)).toBe(false)
    expect(chromeTranslateY(0)).toBe(-8)
  })

  it('reveals that chrome together as the header settles', () => {
    expect(chromeOpacity(1)).toBe(1)
    expect(chromeInteractive(0.9)).toBe(true)
    expect(chromeInteractive(1)).toBe(true)
    expect(chromeTranslateY(1)).toBe(0)
  })

  it('skips the hide when the morph is skipped (reduced motion, mobile, compact override)', () => {
    expect(chromeOpacity(introProgress(0, 800, true))).toBe(1)
    expect(chromeInteractive(introProgress(0, 800, true))).toBe(true)
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
    expect(compactHeaderHeight(390)).toBe(COMPACT_HEADER_MOBILE)
    expect(interpolateScale(1, 0)).toBe(1)
  })

  it('returns identity scale when the slot cannot be measured', () => {
    expect(logoIntroScale(0, desktop)).toBe(1)
  })

  it('keeps both wordmark lines readable in the compact header', () => {
    expect(compactLogoSecondLinePx()).toBeGreaterThanOrEqual(7)
    expect(COMPACT_HEADER_DESKTOP).toBe(COMPACT_LOGO_DESKTOP + HEADER_PAD_Y_DESKTOP * 2)
    expect(COMPACT_HEADER_MOBILE).toBe(COMPACT_LOGO_MOBILE + HEADER_PAD_Y_MOBILE * 2)
  })

  it('fits the oversized wordmark inside the intro band with padding', () => {
    const logoH = oversizedLogoHeight(desktop)
    expect(logoH).toBeGreaterThan(250)
    expect(startBandHeight(desktop.height)).toBeGreaterThanOrEqual(logoH + HEADER_PAD_Y_DESKTOP * 2)
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
