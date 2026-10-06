import { useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { pitStopCaption, stepArtFor, stepArtSrcSet } from '../content/pitStopArt'
import { steps, type Step, type StepKey } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import type { LocaleId } from '../i18n/locale'
import { CabinetIcon, MetronomeIcon, StationIcon, TrafficLight } from './PitIcons'
import { Reveal } from './Reveal'
import styles from './HowWeWork.module.css'

type Copy = ReturnType<typeof useLocale>['copy']

function chapterLayout(index: number): 'left' | 'right' | 'wide' {
  if (index === 5) return 'wide'
  if (index % 2 === 1) return 'right'
  return 'left'
}

function ChapterArt({
  locale,
  stepKey,
  layout,
  reduce,
}: {
  locale: LocaleId
  stepKey: StepKey
  layout: 'left' | 'right' | 'wide'
  reduce: boolean | null
}) {
  const caption = pitStopCaption(locale, stepKey)
  const fromX = layout === 'right' ? 48 : layout === 'left' ? -48 : 0

  return (
    <motion.figure
      className={styles.artWrap}
      initial={reduce ? false : { opacity: 0.08, filter: 'blur(16px)', x: fromX, scale: 1.05 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, scale: 1 }}
      viewport={{ amount: 0.85, margin: '0px 0px -6% 0px', once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.artFrame}>
        <img
          className={styles.art}
          src={stepArtFor(locale, stepKey)}
          srcSet={stepArtSrcSet(locale, stepKey)}
          sizes="(min-width: 900px) 520px, calc(100vw - 80px)"
          alt=""
          width={1152}
          height={736}
          loading="lazy"
          draggable={false}
        />
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>{caption.title}</span>
      </figcaption>
    </motion.figure>
  )
}

function Chapter({
  locale,
  step,
  index,
  copy,
  howWeWork,
  reduce,
  current,
}: {
  locale: LocaleId
  step: Step
  index: number
  copy: Copy
  howWeWork: Copy['howWeWork']
  reduce: boolean | null
  current: number
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { amount: 0.4, margin: '-8% 0px' })
  const text = copy.steps[step.key]
  const layout = chapterLayout(index)
  const done = Boolean(reduce) || inView || current > index
  const active = current === index

  return (
    <li
      ref={ref}
      id={`step-${step.key}`}
      className={`${styles.chapter} ${styles[layout]} ${done ? styles.chapterOn : ''} ${
        active ? styles.chapterActive : ''
      }`}
    >
      <ChapterArt locale={locale} stepKey={step.key} layout={layout} reduce={reduce} />
      <div className={styles.copy}>
        <div className={styles.cardHead}>
          <span className={styles.n}>{step.n}</span>
          <span className={styles.icon}>
            <StationIcon step={step.key} />
          </span>
          <h3>{text.title}</h3>
        </div>
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
      </div>
    </li>
  )
}

export function HowWeWork() {
  const { copy, locale } = useLocale()
  const { howWeWork } = copy
  const reduce = useReducedMotion()
  const laneRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: laneRef, offset: ['start 75%', 'end 45%'] })
  const [current, setCurrent] = useState(reduce ? steps.length - 1 : -1)

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduce) return
    const i = Math.min(steps.length - 1, Math.max(-1, Math.floor(value * steps.length - 0.02)))
    setCurrent(i)
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
              <span>{howWeWork.pitIn}</span>
            </p>
            <p className={styles.pace}>
              <MetronomeIcon />
              <span>{howWeWork.pace}</span>
            </p>
          </div>

          <div className={styles.stage}>
            <ol className={styles.rail} aria-label={howWeWork.rail}>
              {steps.map((step, index) => (
                <li key={step.key} className={current >= index ? styles.railOn : ''}>
                  <a href={`#step-${step.key}`}>
                    <span>{step.n}</span> {copy.steps[step.key].title}
                  </a>
                </li>
              ))}
            </ol>

            <ol className={styles.chapters} ref={laneRef} aria-label={howWeWork.rail}>
              {steps.map((step, index) => (
                <Chapter
                  key={step.key}
                  locale={locale}
                  step={step}
                  index={index}
                  copy={copy}
                  howWeWork={howWeWork}
                  reduce={reduce}
                  current={current}
                />
              ))}
            </ol>
          </div>

          <p className={`${styles.pitOut} ${current >= steps.length - 1 ? styles.pitOutOn : ''}`}>
            <CabinetIcon />
            <span>{howWeWork.pitOut}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
