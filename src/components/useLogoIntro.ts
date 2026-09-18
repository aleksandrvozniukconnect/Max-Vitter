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
  interpolateIntro,
  introProgress,
  logoIntroFrom,
} from '../lib/logoIntro'

function readReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type LogoIntro = {
  reduceMotion: boolean
  ready: boolean
  navReady: boolean
  slotRef: RefObject<HTMLAnchorElement | null>
  trackRef: RefObject<HTMLDivElement | null>
  x: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  chrome: MotionValue<number>
  navY: MotionValue<number>
  headerBg: MotionValue<string>
}

export function useLogoIntro(forceCompact: boolean): LogoIntro {
  const reduceHook = useReducedMotion()
  const reduceMotion = reduceHook ?? readReducedMotion()

  const slotRef = useRef<HTMLAnchorElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const fromX = useMotionValue(0)
  const fromY = useMotionValue(0)
  const fromS = useMotionValue(1)
  const distanceMV = useMotionValue(0)
  const skipMV = useMotionValue(reduceMotion || forceCompact ? 1 : 0)

  const [ready, setReady] = useState(reduceMotion)
  const [navReady, setNavReady] = useState(reduceMotion)

  useLayoutEffect(() => {
    skipMV.set(reduceMotion || forceCompact ? 1 : 0)
  }, [reduceMotion, forceCompact, skipMV])

  useLayoutEffect(() => {
    if (reduceMotion) {
      fromX.set(0)
      fromY.set(0)
      fromS.set(1)
      distanceMV.set(0)
      return
    }

    const measure = () => {
      const slot = slotRef.current
      const track = trackRef.current
      if (!slot) return

      const rect = slot.getBoundingClientRect()
      const header = slot.closest('header')
      const headerSafe = header?.getBoundingClientRect().height ?? 76
      const next = logoIntroFrom(
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        { width: window.innerWidth, height: window.innerHeight },
        { headerSafe },
      )

      fromX.set(next.x)
      fromY.set(next.y)
      fromS.set(next.scale)
      distanceMV.set(track?.offsetHeight ?? 0)
      setReady(true)

      const progressNow = introProgress(window.scrollY, track?.offsetHeight ?? 0, forceCompact)
      setNavReady(chromeInteractive(progressNow))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reduceMotion, forceCompact, fromX, fromY, fromS, distanceMV])

  const progress = useTransform([scrollY, distanceMV, skipMV], (values) => {
    const y = Number(values[0])
    const distance = Number(values[1])
    const skip = Number(values[2]) >= 1
    return introProgress(y, distance, skip)
  })

  const x = useTransform([progress, fromX], (values) =>
    interpolateIntro({ x: Number(values[1]), y: 0, scale: 1 }, Number(values[0])).x,
  )
  const y = useTransform([progress, fromY], (values) =>
    interpolateIntro({ x: 0, y: Number(values[1]), scale: 1 }, Number(values[0])).y,
  )
  const scale = useTransform([progress, fromS], (values) =>
    interpolateIntro({ x: 0, y: 0, scale: Number(values[1]) }, Number(values[0])).scale,
  )
  const chrome = useTransform(progress, (p) => chromeOpacity(p))
  const navY = useTransform(progress, (p) => chromeTranslateY(p))
  const headerBg = useTransform(progress, [0.45, 0.92], ['rgba(252, 251, 250, 0)', 'rgba(252, 251, 250, 1)'])

  useMotionValueEvent(progress, 'change', (p) => {
    const next = chromeInteractive(p)
    setNavReady((prev) => (prev === next ? prev : next))
  })

  return {
    reduceMotion,
    ready,
    navReady,
    slotRef,
    trackRef,
    x,
    y,
    scale,
    chrome,
    navY,
    headerBg,
  }
}
