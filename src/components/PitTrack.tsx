import { useEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { steps } from '../content/site'
import { ROAD_WIDTH, ROAD_X, carPlacement, driveEase, roadFromLogo, targetStop, type Stop } from '../lib/pitTrack'
import styles from './PitTrack.module.css'

const BAY_HEIGHT = 110
const BAY_MAX_WIDTH = 170
/** Height of a road tile for a given road width (tile art is 249 x 1086). */
const tileHeight = (width: number) => (width * 1086) / 249
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
  const posRef = useRef(0)
  const targetRef = useRef(-1)
  const frame = useRef(0)
  const placed = useRef(false)
  const { scrollY } = useScroll()

  const apply = () => {
    const node = car.current
    if (!node || stopsRef.current.length === 0) return
    const pos = posRef.current
    setCurrent(Math.round(pos))
    const pose = carPlacement(pos, stopsRef.current, roadXRef.current)
    node.setAttribute(
      'transform',
      `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.angle.toFixed(1)})`,
    )
  }

  const driveTo = (target: number) => {
    cancelAnimationFrame(frame.current)
    const from = posRef.current
    if (!placed.current || from === target) {
      placed.current = true
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
    const top = el.getBoundingClientRect().top
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
    if (targetRef.current < 0) watch()
    else apply()
  })

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  useMotionValueEvent(scrollY, 'change', watch)

  if (!layout) return null
  const { roadX, roadW, scale } = layout
  const tileH = tileHeight(roadW)
  const bayLeft = roadX + roadW / 2

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
        <pattern id="finish-check" patternUnits="userSpaceOnUse" x={roadX - roadW / 2} y={layout.bottom - 4 * (roadW / 6)} width={roadW / 3} height={roadW / 3}>
          <rect width={roadW / 3} height={roadW / 3} fill="#fcfbfa" />
          <rect width={roadW / 6} height={roadW / 6} fill="#111318" />
          <rect x={roadW / 6} y={roadW / 6} width={roadW / 6} height={roadW / 6} fill="#111318" />
        </pattern>
        <pattern id="road-tile" patternUnits="userSpaceOnUse" x={roadX - roadW / 2} y="0" width={roadW} height={tileH}>
          <image href="/images/track/road.webp" width={roadW} height={tileH} preserveAspectRatio="none" />
        </pattern>
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
      <rect
        x={roadX - roadW / 2}
        y={layout.bottom - 4 * (roadW / 6)}
        width={roadW}
        height={4 * (roadW / 6)}
        fill="url(#finish-check)"
        stroke="#111318"
        strokeWidth="1"
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
