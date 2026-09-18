import { describe, expect, it } from 'vitest'
import {
  chromeInteractive,
  chromeOpacity,
  chromeTranslateY,
  clamp01,
  easeOutCubic,
  interpolateIntro,
  introLogoLeft,
  introMetrics,
  introProgress,
  logoIntroFrom,
  INTRO_METRICS,
  INTRO_MOBILE_MAX_WIDTH,
} from './logoIntro'

describe('introProgress', () => {
  it('is 0 at the top of the page while the track exists', () => {
    expect(introProgress(0, 800)).toBe(0)
    expect(introProgress(-10, 800)).toBe(0)
  })

  it('reaches 1 after the intro track and stays there', () => {
    expect(introProgress(800, 800)).toBe(1)
    expect(introProgress(1200, 800)).toBe(1)
  })

  it('stays at the oversized start until the track has been measured', () => {
    expect(introProgress(40, 0)).toBe(0)
    expect(introProgress(40, -1)).toBe(0)
  })

  it('skips the morph for reduced motion or a compact override', () => {
    expect(introProgress(0, 800, true)).toBe(1)
    expect(introProgress(0, 0, true)).toBe(1)
  })

  it('maps mid-track scroll linearly before easing', () => {
    expect(introProgress(200, 800)).toBe(0.25)
  })
})

describe('chrome fade', () => {
  it('keeps nav hidden while the mark still dominates', () => {
    expect(chromeOpacity(0)).toBe(0)
    expect(chromeOpacity(0.5)).toBe(0)
    expect(chromeInteractive(0.5)).toBe(false)
    expect(chromeTranslateY(0)).toBe(-12)
  })

  it('fades and slides nav in as the logo settles', () => {
    expect(chromeOpacity(0.76)).toBeCloseTo(0.5, 5)
    expect(chromeOpacity(1)).toBe(1)
    expect(chromeInteractive(0.76)).toBe(true)
    expect(chromeTranslateY(1)).toBe(0)
  })
})

describe('logoIntroFrom', () => {
  const desktopSlot = { left: 40, top: 16, width: 110, height: 44 }
  const desktopView = { width: 1440, height: 900 }

  it('places a large mark in the canvas below the header at progress 0', () => {
    const from = logoIntroFrom(desktopSlot, desktopView, { headerSafe: 76 })
    const start = interpolateIntro(from, 0)
    const end = interpolateIntro(from, 1)

    expect(from.scale).toBeGreaterThan(6)
    expect(start).toEqual(from)
    expect(end).toEqual({ x: 0, y: 0, scale: 1 })

    const slotCx = desktopSlot.left + desktopSlot.width / 2
    const visualCx = slotCx + from.x
    const visualCy = desktopSlot.top + desktopSlot.height / 2 + from.y
    expect(visualCx).toBe(desktopView.width / 2)
    expect(visualCy).toBe(76 + (desktopView.height - 76) / 2)

    const visualW = desktopSlot.width * from.scale
    expect(visualW).toBeLessThanOrEqual(desktopView.width * INTRO_METRICS.desktop.maxWidthRatio + 0.01)

    const early = interpolateIntro(from, 0.2)
    expect(early.scale).toBeLessThan(from.scale * 0.75)
    expect(Math.abs(early.x)).toBeLessThan(Math.abs(from.x))
  })

  it('keeps the morphing mark on-screen on a 1440 desktop and a 390 mobile', () => {
    const cases = [
      {
        slot: desktopSlot,
        view: desktopView,
        headerSafe: 76,
      },
      {
        slot: { left: 16, top: 15, width: 85, height: 34 },
        view: { width: 390, height: 844 },
        headerSafe: 64,
      },
    ]

    for (const { slot, view, headerSafe } of cases) {
      const from = logoIntroFrom(slot, view, { headerSafe })
      for (let i = 0; i <= 20; i++) {
        const left = introLogoLeft(slot, from, i / 20)
        expect(left).toBeGreaterThanOrEqual(-1)
      }
    }
  })

  it('uses a shorter, narrower mark on ~390px viewports so the morph is not cramped', () => {
    const slot = { left: 16, top: 15, width: 85, height: 34 }
    const view = { width: 390, height: 844 }
    const from = logoIntroFrom(slot, view, { headerSafe: 64 })
    const desktop = logoIntroFrom(desktopSlot, desktopView, { headerSafe: 76 })

    expect(view.width).toBeLessThanOrEqual(INTRO_MOBILE_MAX_WIDTH)
    expect(introMetrics(view.width)).toEqual(INTRO_METRICS.mobile)
    expect(from.scale).toBeGreaterThan(3)
    expect(from.scale).toBeLessThan(desktop.scale)

    const visualW = slot.width * from.scale
    const visualH = slot.height * from.scale
    expect(visualW).toBeLessThanOrEqual(view.width * INTRO_METRICS.mobile.maxWidthRatio + 0.01)
    expect(visualH).toBeLessThanOrEqual(view.height * INTRO_METRICS.mobile.maxHeightRatio + 0.01)
  })

  it('returns identity when the slot cannot be measured', () => {
    expect(logoIntroFrom({ left: 0, top: 0, width: 0, height: 44 }, desktopView)).toEqual({
      x: 0,
      y: 0,
      scale: 1,
    })
  })
})

describe('easing helpers', () => {
  it('clamps and eases out without overshoot so the morph starts on the first scroll', () => {
    expect(clamp01(-2)).toBe(0)
    expect(clamp01(2)).toBe(1)
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
    expect(easeOutCubic(0.25)).toBeGreaterThan(0.5)
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.8)
  })
})
