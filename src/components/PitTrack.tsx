import { useEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { steps } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { ROAD_WIDTH, ROAD_X, carPlacement, carStopIndex, type Stop } from '../lib/pitTrack'
import styles from './PitTrack.module.css'

const BAY_HEIGHT = 140

type Layout = {
  width: number
  height: number
  top: number
  bottom: number
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
  return {
    width: box.width,
    height: box.height,
    top: Math.max(0, rects[0].top - 36),
    bottom: Math.min(box.height, rects[rects.length - 1].bottom + 36),
    cards: rects,
  }
}

function Car() {
  return (
    <g>
      <rect x="-15" y="-19" width="8" height="13" rx="2" fill="#111318" />
      <rect x="7" y="-19" width="8" height="13" rx="2" fill="#111318" />
      <rect x="-16" y="7" width="9" height="16" rx="2" fill="#111318" />
      <rect x="7" y="7" width="9" height="16" rx="2" fill="#111318" />
      <rect x="-14" y="-27" width="28" height="5" rx="1" fill="#c4271d" stroke="#111318" strokeWidth="1.3" />
      <path d="M-6 -22 L6 -22 L10 9 L6 25 L-6 25 L-10 9 Z" fill="#c4271d" stroke="#111318" strokeWidth="1.5" />
      <rect x="-13" y="25" width="26" height="6" rx="1" fill="#c4271d" stroke="#111318" strokeWidth="1.3" />
      <circle cx="0" cy="5" r="3.6" fill="#f4efe9" stroke="#111318" strokeWidth="1.1" />
    </g>
  )
}

type Props = {
  band: RefObject<HTMLDivElement | null>
  current: number
  reduce: boolean | null
}

/**
 * A hand-drawn pit lane that runs down the left edge of the section, in line
 * with the logo. Every card gets its own pit bay beside the road, and the car
 * pulls into the bay of the card on screen.
 */
export function PitTrack({ band, current, reduce }: Props) {
  const { copy } = useLocale()
  const [layout, setLayout] = useState<Layout | null>(null)
  const car = useRef<SVGGElement>(null)
  const stopsRef = useRef<Stop[]>([])
  const centersRef = useRef<number[]>([])
  const { scrollY } = useScroll()

  const place = () => {
    const el = band.current
    const node = car.current
    if (!el || !node || stopsRef.current.length === 0) return
    const top = el.getBoundingClientRect().top
    const line = window.innerHeight * 0.45 - top
    const index = reduce ? stopsRef.current.length - 1 : carStopIndex(line, centersRef.current)
    const pose = carPlacement(index, stopsRef.current)
    node.setAttribute(
      'transform',
      `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.angle.toFixed(1)})`,
    )
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
    const bayX = (card: Layout['cards'][number]) => (ROAD_X + ROAD_WIDTH / 2 + card.left - 8) / 2 + 4
    stopsRef.current = layout.cards.map((card) => ({ y: (card.top + card.bottom) / 2, bayX: bayX(card) }))
    centersRef.current = stopsRef.current.map((stop) => stop.y)
    place()
  })

  useMotionValueEvent(scrollY, 'change', place)

  if (!layout) return null
  const bayLeft = ROAD_X + ROAD_WIDTH / 2
  const road = `M${ROAD_X} ${layout.top} C ${ROAD_X - 7} ${layout.top + (layout.bottom - layout.top) * 0.3}, ${ROAD_X + 7} ${layout.top + (layout.bottom - layout.top) * 0.7}, ${ROAD_X} ${layout.bottom}`

  return (
    <svg className={styles.overlay} width={layout.width} height={layout.height} aria-hidden="true" focusable="false">
      <defs>
        <filter id="track-sketch" filterUnits="userSpaceOnUse" x="0" y="0" width={layout.width} height={layout.height}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
        </filter>
      </defs>
      <g filter="url(#track-sketch)">
        <path d={road} fill="none" stroke="#111318" strokeWidth={ROAD_WIDTH + 6} strokeLinecap="round" />
        <path d={road} fill="none" stroke="#3a3c43" strokeWidth={ROAD_WIDTH} strokeLinecap="round" />
        <path d={road} fill="none" stroke="#eee7e1" strokeWidth="2" strokeDasharray="14 12" />
        {layout.cards.map((card, i) => {
          const on = current === i
          const right = card.left - 10
          const height = BAY_HEIGHT
          const top = (card.top + card.bottom) / 2 - height / 2
          return (
            <rect
              key={steps[i].key}
              x={bayLeft - 2}
              y={top}
              width={Math.max(40, right - bayLeft + 2)}
              height={height}
              rx="8"
              className={on ? styles.bayOn : styles.bay}
            />
          )
        })}
      </g>
      {layout.cards.map((card, i) => {
        const on = current === i
        const cx = (bayLeft + card.left - 10) / 2 + 2
        const mid = (card.top + card.bottom) / 2
        const cy = mid - BAY_HEIGHT / 2 + 24
        return (
          <g key={steps[i].key}>
            <circle cx={cx} cy={cy} r="15" className={on ? styles.badgeOn : styles.badge} />
            <text x={cx} y={cy + 5} textAnchor="middle" className={styles.num}>
              {steps[i].n}
            </text>
            <text x={cx} y={mid + BAY_HEIGHT / 2 - 14} textAnchor="middle" className={styles.name}>
              {copy.steps[steps[i].key].title}
            </text>
          </g>
        )
      })}
      <g ref={car} className={styles.car}>
        <g transform="scale(1.35)">
          <Car />
        </g>
      </g>
    </svg>
  )
}
