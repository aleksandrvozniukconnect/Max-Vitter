import { describe, expect, it } from 'vitest'
import {
  chromeInteractive,
  chromeOpacity,
  chromeTranslateY,
  clamp01,
  compactHeaderHeight,
  compactLogoSecondLinePx,
  compactSlotWidth,
  headerPadX,
  interpolateScale,
  introBandHeight,
  introEase,
  introEnabled,
  introProgress,
  introScrollDistance,
  isSessionCompact,
  logoIntroScale,
  markSessionCompact,
  oversizedLogoHeight,
  oversizedLogoWidth,
  resetSessionCompact,
  shouldPlayIntro,
  startBandHeight,
  CHROME_FADE_START,
  COMPACT_HEADER_DESKTOP,
  COMPACT_HEADER_MOBILE,
  COMPACT_LOGO_DESKTOP,
  COMPACT_LOGO_MOBILE,
  HEADER_PAD_Y_DESKTOP,
  HEADER_PAD_Y_MOBILE,
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

  it('skips the morph for reduced motion or skipIntro, not for width', () => {
    expect(introProgress(0, 800, true)).toBe(1)
    expect(introEnabled()).toBe(true)
    expect(introEnabled(true)).toBe(false)
    expect(shouldPlayIntro({ reducedMotion: true })).toBe(false)
    expect(shouldPlayIntro({ skipIntro: true })).toBe(false)
    expect(shouldPlayIntro({})).toBe(true)
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

  it('skips the hide when the morph is skipped (reduced motion or skipIntro)', () => {
    expect(chromeOpacity(introProgress(0, 800, true))).toBe(1)
    expect(chromeInteractive(introProgress(0, 800, true))).toBe(true)
  })
})

describe('top-left scale-in-place intro', () => {
  const slotWidth = 110
  const desktop = { width: 1440, height: 900 }
  const phone = { width: 390, height: 844 }

  it('starts as an oversized top-left wordmark several hundred px wide', () => {
    const scale = logoIntroScale(slotWidth, desktop)
    expect(scale).toBeGreaterThan(6)
    expect(slotWidth * scale).toBeGreaterThan(500)
    expect(slotWidth * scale).toBeLessThanOrEqual(880)
    expect(interpolateScale(scale, 0)).toBe(scale)
    expect(interpolateScale(scale, 1)).toBe(1)
  })

  it('shrinks the white band with the same eased progress as the logo', () => {
    const start = startBandHeight(desktop.height, desktop.width)
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

  it('plays the morph on ~390px viewports and hides chrome until settled', () => {
    expect(shouldPlayIntro({})).toBe(true)
    expect(introEnabled()).toBe(true)
    expect(compactHeaderHeight(390)).toBe(COMPACT_HEADER_MOBILE)

    const slot = compactSlotWidth(390)
    const scale = logoIntroScale(slot, phone)
    const target = oversizedLogoWidth(phone)
    expect(target).toBeGreaterThan(300)
    expect(target).toBeLessThanOrEqual(phone.width - headerPadX(phone.width) * 2)
    expect(scale).toBeGreaterThan(2)
    expect(interpolateScale(scale, 0)).toBe(scale)
    expect(interpolateScale(scale, 1)).toBe(1)

    const distance = introScrollDistance(phone)
    expect(introProgress(0, distance)).toBe(0)
    expect(chromeOpacity(introProgress(0, distance))).toBe(0)
    expect(chromeInteractive(introProgress(0, distance))).toBe(false)
    expect(chromeOpacity(introProgress(distance, distance))).toBe(1)
  })

  it('fits the mobile wordmark inside the intro band without clipping', () => {
    const logoH = oversizedLogoHeight(phone)
    const band = startBandHeight(phone.height, phone.width)
    expect(band).toBeGreaterThanOrEqual(logoH + HEADER_PAD_Y_MOBILE * 2)
    expect(band).toBeLessThan(phone.height)
    expect(oversizedLogoWidth(phone) + headerPadX(phone.width) * 2).toBeLessThanOrEqual(phone.width)
  })

  it('does not change desktop ≥900px feel', () => {
    expect(startBandHeight(desktop.height, desktop.width)).toBe(Math.round(desktop.height * 0.72))
    expect(oversizedLogoWidth(desktop)).toBe(880)
    expect(logoIntroScale(slotWidth, desktop) * slotWidth).toBe(880)

    const at900 = { width: 900, height: 900 }
    expect(oversizedLogoWidth(at900)).toBe(Math.min(900 * 0.72, 880))
    expect(startBandHeight(at900.height, at900.width)).toBe(Math.round(900 * 0.72))
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
    expect(startBandHeight(desktop.height, desktop.width)).toBeGreaterThanOrEqual(logoH + HEADER_PAD_Y_DESKTOP * 2)
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

describe('session compact header', () => {
  it('remembers a compact visit so the intro does not replay', () => {
    resetSessionCompact()
    expect(isSessionCompact()).toBe(false)
    markSessionCompact()
    expect(isSessionCompact()).toBe(true)
    resetSessionCompact()
    expect(isSessionCompact()).toBe(false)
  })
})
