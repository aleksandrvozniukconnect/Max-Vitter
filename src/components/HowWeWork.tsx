import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { steps } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { CabinetIcon, CarIcon, MetronomeIcon, StationIcon, TrafficLight } from './PitIcons'
import { Reveal } from './Reveal'
import styles from './HowWeWork.module.css'

export function HowWeWork() {
  const { copy } = useLocale()
  const { howWeWork } = copy
  const reduce = useReducedMotion()
  const laneRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: laneRef, offset: ['start 80%', 'end 55%'] })
  const [passed, setPassed] = useState(reduce ? steps.length : 0)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduce) return
    setPassed(Math.min(steps.length, Math.floor(value * steps.length + 0.15)))
  })

  return (
    <section className={styles.section} id="how">
      <Reveal className={styles.intro}>
        <p className="eyebrow">{howWeWork.eyebrow}</p>
        <h2 className="section-title">{howWeWork.title}</h2>
        <p className="lede">{howWeWork.lede}</p>
      </Reveal>

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <div className={styles.lead}>
            <p className={styles.pitIn}>
              <CarIcon />
              <span>{howWeWork.pitIn}</span>
            </p>
            <p className={styles.pace}>
              <MetronomeIcon />
              <span>{howWeWork.pace}</span>
            </p>
          </div>

          <ol className={styles.lane} ref={laneRef} aria-label={howWeWork.rail}>
            <motion.span
              className={styles.progress}
              style={{ '--p': reduce ? 1 : scrollYProgress } as never}
              aria-hidden="true"
            />
            {steps.map((step, index) => {
              const text = copy.steps[step.key]
              const done = passed > index
              return (
                <li
                  key={step.key}
                  id={`step-${step.key}`}
                  className={`${styles.station} ${done ? styles.stationDone : ''}`}
                >
                  <span className={styles.gear}>
                    {howWeWork.gear} {index + 1}
                  </span>
                  <span className={styles.icon}>
                    <StationIcon step={step.key} />
                  </span>
                  <h3>{text.title}</h3>
                  <p className={styles.body}>{text.body}</p>
                  <p className={styles.deliverable}>
                    <span>{howWeWork.youReceive}</span>
                    {text.deliverable}
                  </p>
                  {step.gate ? (
                    <p className={`${styles.gate} ${done ? styles.gateGo : ''}`}>
                      <TrafficLight go={done} />
                      <span className={styles.stamp}>{text.gate}</span>
                      {done ? null : <span className={styles.gateNote}>{howWeWork.gateNote}</span>}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ol>

          <p className={`${styles.pitOut} ${passed >= steps.length ? styles.pitOutOn : ''}`}>
            <CabinetIcon />
            <span>{howWeWork.pitOut}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
