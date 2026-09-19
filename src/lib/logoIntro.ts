export type IntroRect = {
  left: number
  top: number
  width: number
  height: number
}

export type IntroViewport = {
  width: number
  height: number
}

export const INTRO_MOBILE_MAX_WIDTH = 899

/**
 * Cropped wordmark artboard (Logo-02 / Logo-04). Tight around DC + DSGN + CHOICE
 * so the second line is not lost in Illustrator padding at header size.
 */
export const WORDMARK_VIEWBOX_WIDTH = 1120
export const WORDMARK_VIEWBOX_HEIGHT = 370
/** CHOICE cap-height inside the cropped viewBox. */
export const WORDMARK_SECOND_LINE = 45

export const COMPACT_LOGO_DESKTOP = 64
export const COMPACT_LOGO_MOBILE = 42
export const HEADER_PAD_Y_DESKTOP = 14
export const HEADER_PAD_Y_MOBILE = 13

export const COMPACT_HEADER_DESKTOP = COMPACT_LOGO_DESKTOP + HEADER_PAD_Y_DESKTOP * 2
export const COMPACT_HEADER_MOBILE = COMPACT_LOGO_MOBILE + HEADER_PAD_Y_MOBILE * 2

/** Kettal-like scroll ease: cubic-bezier(.785, .135, .15, .86) */
export const INTRO_BEZIER = { x1: 0.785, y1: 0.135, x2: 0.15, y2: 0.86 } as const

const START_BAND_VH = 0.72
const DESKTOP_LOGO_MAX_WIDTH = 880
const DESKTOP_LOGO_WIDTH_RATIO = 0.72

export function clamp01(value: number): number {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

function bezierComponent(t: number, a: number, b: number): number {
  const inv = 1 - t
  return 3 * inv * inv * t * a + 3 * inv * t * t * b + t * t * t
}

function bezierDerivative(t: number, a: number, b: number): number {
  const inv = 1 - t
  return 3 * inv * inv * a + 6 * inv * t * (b - a) + 3 * t * t * (1 - b)
}

/** Unit-interval cubic bezier matching CSS cubic-bezier(.785,.135,.15,.86). */
export function introEase(progress: number): number {
  const x = clamp01(progress)
  if (x === 0 || x === 1) return x

  const { x1, y1, x2, y2 } = INTRO_BEZIER
  let t = x
  for (let i = 0; i < 8; i++) {
    const current = bezierComponent(t, x1, x2) - x
    const dt = bezierDerivative(t, x1, x2)
    if (Math.abs(dt) < 1e-6) break
    t -= current / dt
  }

  return clamp01(bezierComponent(t, y1, y2))
}

export function compactHeaderHeight(viewportWidth: number): number {
  return viewportWidth <= 599 ? COMPACT_HEADER_MOBILE : COMPACT_HEADER_DESKTOP
}

/** Oversized top-left morph is desktop-first; compact on small screens. */
export function introEnabled(viewportWidth: number, reducedMotion = false): boolean {
  return !reducedMotion && viewportWidth > INTRO_MOBILE_MAX_WIDTH
}

export function startBandHeight(viewportHeight: number): number {
  return Math.round(viewportHeight * START_BAND_VH)
}

export function oversizedLogoHeight(viewport: IntroViewport): number {
  const width = Math.min(viewport.width * DESKTOP_LOGO_WIDTH_RATIO, DESKTOP_LOGO_MAX_WIDTH)
  return width * (WORDMARK_VIEWBOX_HEIGHT / WORDMARK_VIEWBOX_WIDTH)
}

export function compactLogoSecondLinePx(logoHeight = COMPACT_LOGO_DESKTOP): number {
  return (WORDMARK_SECOND_LINE / WORDMARK_VIEWBOX_HEIGHT) * logoHeight
}

export function introScrollDistance(viewport: IntroViewport): number {
  return Math.max(startBandHeight(viewport.height) - compactHeaderHeight(viewport.width), 1)
}

export function introProgress(scrollY: number, distance: number, skip = false): number {
  if (skip) return 1
  if (distance <= 0) return 0
  return clamp01(scrollY / distance)
}

/** Header chrome (nav, Send project, language switcher, hamburger) stays hidden until this progress. */
export const CHROME_FADE_START = 0.72
const CHROME_FADE_SPAN = 1 - CHROME_FADE_START
const CHROME_INTERACTIVE_OPACITY = 0.45

export function chromeOpacity(progress: number): number {
  return clamp01((progress - CHROME_FADE_START) / CHROME_FADE_SPAN)
}

export function chromeTranslateY(progress: number): number {
  const opacity = chromeOpacity(progress)
  if (opacity >= 1) return 0
  return (1 - opacity) * -8
}

export function chromeInteractive(progress: number): boolean {
  return chromeOpacity(progress) >= CHROME_INTERACTIVE_OPACITY
}

export function introBandHeight(progress: number, startHeight: number, endHeight: number): number {
  const p = introEase(progress)
  return startHeight + (endHeight - startHeight) * p
}

/**
 * Scale that makes the header-slot logo several hundred px wide, top-left anchored.
 * Progress 1 is identity (compact). No translation — it scales in place.
 */
export function logoIntroScale(slotWidth: number, viewport: IntroViewport): number {
  if (slotWidth <= 0 || viewport.width <= 0) return 1
  const targetWidth = Math.min(viewport.width * DESKTOP_LOGO_WIDTH_RATIO, DESKTOP_LOGO_MAX_WIDTH)
  return Math.max(targetWidth / slotWidth, 1)
}

export function interpolateScale(fromScale: number, progress: number): number {
  const p = introEase(progress)
  return fromScale + (1 - fromScale) * p
}

let sessionCompact = false

export function isSessionCompact(): boolean {
  return sessionCompact
}

export function markSessionCompact() {
  sessionCompact = true
}

export function resetSessionCompact() {
  sessionCompact = false
}
