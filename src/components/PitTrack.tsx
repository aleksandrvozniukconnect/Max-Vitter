import { useEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { steps } from '../content/site'
import { ROAD_WIDTH, ROAD_X, carPlacement, driveEase, roadFromLogo, targetStop, type Stop } from '../lib/pitTrack'
import styles from './PitTrack.module.css'

const BAY_HEIGHT = 110
const BAY_MAX_WIDTH = 170
/** Height of a road tile for a given road width (tile art is 386 x 201, kerbs included). */
const tileHeight = (width: number) => (width * 201) / 386
/** Where the chequered strip sits inside the finish tile (share of its height). */
const FINISH_AT = 0.7224
const CAR_W = 53
const CAR_H = 84

type Layout = {
  width: number
  height: number
  top: number
  bottom: number
  roadX: number
  roadW: number
  /** Size of bays and car relative to the 1366px design. */
  scale: number
  /** Card edges, relative to the band. */
  cards: { top: number; bottom: number; left: number }[]
}

function measure(band: HTMLElement): Layout | null {
  const box = band.getBoundingClientRect()
  const cards = steps.map((step) => band.querySelector<HTMLElement>(`#step-${step.key}`))
  if (cards.some((card) => !card)) return null
  const rects = cards.map((card) => {
    const r = card!.getBoundingClientRect()
    return { top: r.top - box.top, bottom: r.bottom - box.top, left: r.left - box.left }
  })
  // The header logo is scaled by the intro, so use its layout width (which
  // ignores transforms); its left edge is the scale origin and does not move.
  const logo = document.querySelector<HTMLElement>('header img[alt="DSGN Choice"]')
  const road =
    logo && logo.offsetWidth > 0
      ? roadFromLogo(logo.getBoundingClientRect().left - box.left, logo.offsetWidth)
      : { x: ROAD_X, width: ROAD_WIDTH }
  return {
    roadX: road.x,
    roadW: road.width,
    scale: road.width / ROAD_WIDTH,
    width: box.width,
    height: box.height,
    top: 0,
    bottom: Math.min(box.height, rects[rects.length - 1].bottom + 36),
    cards: rects,
  }
}

type Props = {
  band: RefObject<HTMLDivElement | null>
}

/**
 * A hand-drawn pit lane that runs down the left edge of the section, in line
 * with the logo. Every card gets its own pit bay beside the road, and the car
 * pulls into the bay of the card on screen.
 */
export function PitTrack({ band }: Props) {
  const [layout, setLayout] = useState<Layout | null>(null)
  const [current, setCurrent] = useState(0)
  const car = useRef<SVGGElement>(null)
  const stopsRef = useRef<(Stop & { top: number; bottom: number })[]>([])
  const roadXRef = useRef(ROAD_X)
  const startYRef = useRef(0)
  const posRef = useRef(-1)
  const targetRef = useRef(-1)
  const frame = useRef(0)
  const { scrollY } = useScroll()

  const apply = () => {
    const node = car.current
    if (!node || stopsRef.current.length === 0) return
    const pos = posRef.current
    setCurrent(Math.round(pos))
    const pose = carPlacement(pos, stopsRef.current, roadXRef.current, startYRef.current)
    node.setAttribute(
      'transform',
      `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.angle.toFixed(1)})`,
    )
  }

  const driveTo = (target: number) => {
    cancelAnimationFrame(frame.current)
    const from = posRef.current
    if (from === target) {
      posRef.current = target
      apply()
      return
    }
    const distance = Math.abs(target - from)
    const duration = 2400 + 600 * (distance - 1)
    const start = performance.now()
    const step = (now: number) => {
      const t = (now - start) / duration
      posRef.current = from + (target - from) * driveEase(t)
      apply()
      if (t < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }

  // The car stays put while the reader scrolls. Once the next card sits fully
  // in the window it drives there by itself and pulls into that card's bay.
  const watch = () => {
    const el = band.current
    if (!el || stopsRef.current.length === 0) return
    const rect = el.getBoundingClientRect()
    // The car waits at the start of the road until the section is on screen.
    if (rect.top > window.innerHeight * 0.85 || rect.bottom < 0) return
    const top = rect.top
    // First drive: let the reader see the car on the start of the road before it moves.
    if (targetRef.current < 0 && top + startYRef.current > window.innerHeight * 0.6) return
    const inset = (document.querySelector('header')?.getBoundingClientRect().bottom ?? 0) | 0
    const spans = stopsRef.current.map((stop) => ({ top: stop.top + top, bottom: stop.bottom + top }))
    const target = targetStop(spans, inset, window.innerHeight, Math.max(0, targetRef.current))
    if (target === targetRef.current) return
    targetRef.current = target
    driveTo(target)
  }

  useEffect(() => {
    const el = band.current
    if (!el) return
    const update = () => setLayout(measure(el))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [band])

  useEffect(() => {
    if (!layout) return
    const lay = layout
    const bayX = (card: Layout['cards'][number]) => {
      const x = lay.roadX + lay.roadW / 2 - 6
      return x + Math.min(BAY_MAX_WIDTH * lay.scale, Math.max(60, card.left - 12 - x)) / 2 + 8
    }
    stopsRef.current = layout.cards.map((card) => ({
      y: (card.top + card.bottom) / 2,
      top: card.top,
      bottom: card.bottom,
      bayX: bayX(card),
    }))
    roadXRef.current = layout.roadX
    startYRef.current = layout.top + 56 * layout.scale
    apply()
    if (targetRef.current < 0) watch()
  })

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  useMotionValueEvent(scrollY, 'change', watch)

  if (!layout) return null
  const { roadX, roadW, scale } = layout
  const tileH = tileHeight(roadW)
  const bayLeft = roadX + roadW / 2
  const lastBay = layout.cards[layout.cards.length - 1]
  // The strip sits a little before the last pit bay: the car crosses it, then pulls in.
  const stripY = (lastBay.top + lastBay.bottom) / 2 - (BAY_HEIGHT * scale) / 2 - 22 * scale
  const finishTop = stripY - FINISH_AT * tileH

  const bays = layout.cards.map((card, i) => {
    const x = bayLeft - 6
    return {
      key: steps[i].key,
      on: current === i,
      x,
      y: (card.top + card.bottom) / 2 - (BAY_HEIGHT * scale) / 2,
      w: Math.min(BAY_MAX_WIDTH * scale, Math.max(60, card.left - 12 - x)),
      h: BAY_HEIGHT * scale,
    }
  })

  return (
    <svg className={styles.overlay} width={layout.width} height={layout.height} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="road-tile" patternUnits="userSpaceOnUse" x={roadX - roadW / 2} y={finishTop} width={roadW} height={tileH}>
          <image href="/images/track/road.webp" width={roadW} height={tileH} preserveAspectRatio="none" />
        </pattern>
        <clipPath id="road-end">
          <rect x={roadX - roadW / 2} y={layout.top} width={roadW} height={layout.bottom - layout.top} />
        </clipPath>
      </defs>
      {bays.map((bay) => (
        <image
          key={bay.key}
          href="/images/track/bay.webp"
          x={bay.x}
          y={bay.y}
          width={bay.w}
          height={bay.h}
          preserveAspectRatio="none"
        />
      ))}
      <rect x={roadX - roadW / 2} y={layout.top} width={roadW} height={layout.bottom - layout.top} fill="url(#road-tile)" />
      {/* A full road tile with the chequered strip drawn in: same asphalt, same kerbs, no seam. */}
      <image
        clipPath="url(#road-end)"
        href="/images/track/finish-tile.webp"
        x={roadX - roadW / 2}
        y={finishTop}
        width={roadW}
        height={tileH}
        preserveAspectRatio="none"
      />
      {layout.cards.map((card, i) => {
        const on = current === i
        const bayW = Math.min(BAY_MAX_WIDTH * scale, Math.max(60, card.left - 12 - (bayLeft - 6)))
        const cx = bayLeft - 6 + bayW / 2 + 8
        const mid = (card.top + card.bottom) / 2
        const cy = mid - (BAY_HEIGHT * scale) / 2 + 15 * scale
        return (
          <g key={steps[i].key}>
            <circle cx={cx} cy={cy} r={12 * scale} className={on ? styles.badgeOn : styles.badge} />
            <text x={cx} y={cy + 4.5 * scale} textAnchor="middle" className={styles.num} fontSize={12 * scale}>
              {steps[i].n}
            </text>
          </g>
        )
      })}
      <g ref={car} className={styles.car}>
        <image href="/images/track/car.webp" x={(-CAR_W * scale) / 2} y={(-CAR_H * scale) / 2} width={CAR_W * scale} height={CAR_H * scale} />
      </g>
    </svg>
  )
}
