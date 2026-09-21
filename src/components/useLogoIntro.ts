import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import {
  chromeInteractive,
  chromeOpacity,
  chromeTranslateY,
  compactHeaderHeight,
  interpolateScale,
  introBandHeight,
  introProgress,
  introScrollDistance,
  isSessionCompact,
  logoIntroScale,
  markSessionCompact,
  shouldPlayIntro,
  startBandHeight,
  COMPACT_HEADER_DESKTOP,
} from '../lib/logoIntro'

function readPlayIntro(hideIntro: boolean): boolean {
  if (typeof window === 'undefined') return false
  return shouldPlayIntro({ skipIntro: hideIntro })
}

export type LogoIntro = {
  showIntro: boolean
  ready: boolean
  /** Nav, language switcher, hamburger and Send project share this threshold. */
  navReady: boolean
  settled: boolean
  slotRef: RefObject<HTMLAnchorElement | null>
  scale: MotionValue<number>
  chrome: MotionValue<number>
  navY: MotionValue<number>
  bandHeight: MotionValue<string>
  spacerHeight: MotionValue<string>
}

export function useLogoIntro(forceCompact: boolean, skipIntro = false): LogoIntro {
  const suppressIntro = skipIntro || isSessionCompact()

  const slotRef = useRef<HTMLAnchorElement>(null)
  const { scrollY } = useScroll()

  const fromS = useMotionValue(1)
  const distanceMV = useMotionValue(1)
  const startHMV = useMotionValue(COMPACT_HEADER_DESKTOP)
  const endHMV = useMotionValue(COMPACT_HEADER_DESKTOP)
  const skipMV = useMotionValue(1)

  const [showIntro, setShowIntro] = useState(() => readPlayIntro(suppressIntro))
  const [ready, setReady] = useState(!showIntro)
  const [navReady, setNavReady] = useState(!showIntro)
  const [settled, setSettled] = useState(!showIntro)

  useLayoutEffect(() => {
    if (skipIntro) markSessionCompact()

    const measure = () => {
      const hideIntro = skipIntro || isSessionCompact()
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      const enabled = shouldPlayIntro({ skipIntro: hideIntro })
      const endH = compactHeaderHeight(viewport.width)
      const startH = enabled ? startBandHeight(viewport.height, viewport.width) : endH
      const distance = enabled ? introScrollDistance(viewport) : 1
      const skip = !enabled || forceCompact

      endHMV.set(endH)
      startHMV.set(startH)
      distanceMV.set(distance)
      skipMV.set(skip ? 1 : 0)
      setShowIntro(enabled)

      const slot = slotRef.current
      if (enabled && slot) {
        const rect = slot.getBoundingClientRect()
        fromS.set(logoIntroScale(rect.width, viewport))
      } else {
        fromS.set(1)
      }

      const progressNow = introProgress(window.scrollY, distance, skip)
      setReady(true)
      setNavReady(chromeInteractive(progressNow))
      setSettled(progressNow >= 1)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('resize', measure)
    }
  }, [forceCompact, skipIntro, fromS, distanceMV, startHMV, endHMV, skipMV])

  const progress = useTransform([scrollY, distanceMV, skipMV], (values) => {
    const y = Number(values[0])
    const distance = Number(values[1])
    const skip = Number(values[2]) >= 1
    return introProgress(y, distance, skip)
  })

  const scale = useTransform([progress, fromS], (values) => interpolateScale(Number(values[1]), Number(values[0])))
  const chrome = useTransform(progress, (p) => chromeOpacity(p))
  const navY = useTransform(progress, (p) => chromeTranslateY(p))
  const bandHeight = useTransform([progress, startHMV, endHMV], (values) => {
    const height = introBandHeight(Number(values[0]), Number(values[1]), Number(values[2]))
    return `${Math.round(height)}px`
  })

  const spacerHeight = useTransform(startHMV, (height) => `${Math.round(height)}px`)

  useMotionValueEvent(progress, 'change', (p) => {
    const next = chromeInteractive(p)
    setNavReady((prev) => (prev === next ? prev : next))
    const nextSettled = p >= 1
    setSettled((prev) => (prev === nextSettled ? prev : nextSettled))
  })

  return {
    showIntro,
    ready,
    navReady,
    settled,
    slotRef,
    scale,
    chrome,
    navY,
    bandHeight,
    spacerHeight,
  }
}
