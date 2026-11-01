import { useRef } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import { steps } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import {
  HEIGHT,
  ROAD,
  WIDTH,
  carPose,
  carStopIndex,
  roadPath,
  roadX,
  stopY,
} from '../lib/pitTrack'
import styles from './PitTrack.module.css'

function Car() {
  return (
    <g>
      <rect x="-13" y="-17" width="7" height="12" rx="2" fill="#111318" />
      <rect x="6" y="-17" width="7" height="12" rx="2" fill="#111318" />
      <rect x="-14" y="6" width="8" height="14" rx="2" fill="#111318" />
      <rect x="6" y="6" width="8" height="14" rx="2" fill="#111318" />
      <rect x="-12" y="-24" width="24" height="4" rx="1" fill="#c4271d" stroke="#111318" strokeWidth="1.2" />
      <path d="M-5 -20 L5 -20 L9 8 L5 22 L-5 22 L-9 8 Z" fill="#c4271d" stroke="#111318" strokeWidth="1.4" />
      <rect x="-11" y="22" width="22" height="5" rx="1" fill="#c4271d" stroke="#111318" strokeWidth="1.2" />
      <circle cx="0" cy="4" r="3.2" fill="#f4efe9" stroke="#111318" strokeWidth="1" />
    </g>
  )
}

type Props = {
  progress: MotionValue<number>
  current: number
  reduce: boolean | null
}

export function PitTrack({ progress, current, reduce }: Props) {
  const { copy } = useLocale()
  const { howWeWork } = copy
  const car = useRef<SVGGElement>(null)
  const initial = carPose(reduce ? steps.length - 1 : 0)

  useMotionValueEvent(progress, 'change', (value) => {
    if (reduce || !car.current) return
    const pose = carPose(carStopIndex(value))
    car.current.setAttribute('transform', `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.angle.toFixed(1)})`)
  })

  return (
    <nav className={styles.track} aria-label={howWeWork.rail}>
      <p className={styles.title}>{howWeWork.pitIn}</p>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMin meet"
        focusable="false"
      >
        <defs>
          <filter id="track-sketch" x="-10%" y="-5%" width="120%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" />
          </filter>
        </defs>
        <g filter="url(#track-sketch)">
          <path d={roadPath} fill="none" stroke="#111318" strokeWidth={ROAD + 6} strokeLinejoin="round" />
          <path d={roadPath} fill="none" stroke="#3a3c43" strokeWidth={ROAD} strokeLinejoin="round" />
          <path d={roadPath} fill="none" stroke="#eee7e1" strokeWidth="2" strokeDasharray="12 10" />
        </g>
        {steps.map((step, i) => {
          const y = stopY[i]
          const x = roadX(y)
          const boxX = 128
          const on = current === i
          const passed = current > i
          return (
            <a key={step.key} href={`#step-${step.key}`} className={styles.stop} data-on={on} data-passed={passed}>
              <g filter="url(#track-sketch)">
                <path d={`M${x + ROAD / 2} ${y} H${boxX}`} stroke="#111318" strokeWidth="2" />
                <rect
                  x={boxX}
                  y={y - 19}
                  width={WIDTH - boxX - 4}
                  height="38"
                  rx="4"
                  className={styles.box}
                />
              </g>
              <text x={boxX + 10} y={y + 5} className={styles.label}>
                <tspan className={styles.num}>{step.n}</tspan>
                <tspan dx="8">{copy.steps[step.key].title}</tspan>
              </text>
            </a>
          )
        })}
        <g
          ref={car}
          className={styles.car}
          transform={`translate(${initial.x.toFixed(1)} ${initial.y.toFixed(1)}) rotate(${initial.angle.toFixed(1)})`}
        >
          <Car />
        </g>
      </svg>
    </nav>
  )
}
