import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
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
  introEnabled,
  introProgress,
  introScrollDistance,
  logoIntroScale,
  startBandHeight,
  COMPACT_HEADER_DESKTOP,
} from '../lib/logoIntro'

function readReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type LogoIntro = {
  reduceMotion: boolean
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

export function useLogoIntro(forceCompact: boolean): LogoIntro {
  const reduceHook = useReducedMotion()
  const reduceMotion = reduceHook ?? readReducedMotion()

  const slotRef = useRef<HTMLAnchorElement>(null)
  const { scrollY } = useScroll()

  const fromS = useMotionValue(1)
  const distanceMV = useMotionValue(1)
  const startHMV = useMotionValue(COMPACT_HEADER_DESKTOP)
  const endHMV = useMotionValue(COMPACT_HEADER_DESKTOP)
  const skipMV = useMotionValue(1)

  const [ready, setReady] = useState(reduceMotion)
  const [navReady, setNavReady] = useState(reduceMotion)
  const [settled, setSettled] = useState(reduceMotion)
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== 'undefined' && introEnabled(window.innerWidth, reduceMotion),
  )

  useLayoutEffect(() => {
    const measure = () => {
      const enabled = introEnabled(window.innerWidth, reduceMotion)
      const endH = compactHeaderHeight(window.innerWidth)
      const startH = enabled ? startBandHeight(window.innerHeight) : endH
      const distance = enabled ? introScrollDistance({ width: window.innerWidth, height: window.innerHeight }) : 1
      const skip = !enabled || forceCompact

      endHMV.set(endH)
      startHMV.set(startH)
      distanceMV.set(distance)
      skipMV.set(skip ? 1 : 0)
      setShowIntro(enabled)

      const slot = slotRef.current
      if (enabled && slot) {
        const rect = slot.getBoundingClientRect()
        fromS.set(logoIntroScale(rect.width, { width: window.innerWidth, height: window.innerHeight }))
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
    return () => window.removeEventListener('resize', measure)
  }, [reduceMotion, forceCompact, fromS, distanceMV, startHMV, endHMV, skipMV])

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
    reduceMotion,
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
