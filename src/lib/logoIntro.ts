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

export type IntroFrom = {
  x: number
  y: number
  scale: number
}

export const INTRO_MOBILE_MAX_WIDTH = 599

export const INTRO_METRICS = {
  desktop: { maxWidthRatio: 0.84, maxHeightRatio: 0.46 },
  mobile: { maxWidthRatio: 0.9, maxHeightRatio: 0.3 },
} as const

export function clamp01(value: number): number {
  if (value <= 0) return 0
  if (value >= 1) return 1
  return value
}

export function easeOutCubic(t: number): number {
  const p = clamp01(t)
  return 1 - (1 - p) ** 3
}

export function introMetrics(viewportWidth: number) {
  return viewportWidth <= INTRO_MOBILE_MAX_WIDTH ? INTRO_METRICS.mobile : INTRO_METRICS.desktop
}

/** Scroll 0 = large centered mark; distance or skip = compact header. */
export function introProgress(scrollY: number, distance: number, skip = false): number {
  if (skip) return 1
  if (distance <= 0) return 0
  return clamp01(scrollY / distance)
}

export function chromeOpacity(progress: number): number {
  return clamp01((progress - 0.52) / 0.48)
}

export function chromeTranslateY(progress: number): number {
  const opacity = chromeOpacity(progress)
  if (opacity >= 1) return 0
  return (1 - opacity) * -12
}

export function chromeInteractive(progress: number): boolean {
  return chromeOpacity(progress) >= 0.45
}

/**
 * Transform that takes the header-slot logo to a viewport-centered oversized mark.
 * Applied with transform-origin at the slot center; progress 1 is identity.
 */
export function logoIntroFrom(
  slot: IntroRect,
  viewport: IntroViewport,
  options?: { headerSafe?: number },
): IntroFrom {
  if (slot.width <= 0 || slot.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    return { x: 0, y: 0, scale: 1 }
  }

  const metrics = introMetrics(viewport.width)
  const scale = Math.min(
    (viewport.width * metrics.maxWidthRatio) / slot.width,
    (viewport.height * metrics.maxHeightRatio) / slot.height,
    12,
  )

  const slotCx = slot.left + slot.width / 2
  const slotCy = slot.top + slot.height / 2
  const headerSafe = Math.max(0, options?.headerSafe ?? 0)
  const canvasH = Math.max(viewport.height - headerSafe, slot.height)
  const targetCx = viewport.width / 2
  const targetCy = headerSafe + canvasH / 2

  return {
    x: targetCx - slotCx,
    y: targetCy - slotCy,
    scale: Math.max(scale, 1),
  }
}

export function interpolateIntro(from: IntroFrom, progress: number): IntroFrom {
  const p = clamp01(progress)
  const move = easeOutCubic(p)
  // Shrink ahead of the slide so the oversized mark does not clip the viewport
  // while it travels into the top-left slot.
  const shrink = easeOutCubic(Math.min(1, p * 1.4))
  return {
    x: from.x * (1 - move),
    y: from.y * (1 - move),
    scale: from.scale + (1 - from.scale) * shrink,
  }
}

/** Left edge of the transformed logo in viewport coordinates. */
export function introLogoLeft(slot: IntroRect, from: IntroFrom, progress: number): number {
  const pose = interpolateIntro(from, progress)
  const centerX = slot.left + slot.width / 2 + pose.x
  return centerX - (slot.width * pose.scale) / 2
}
