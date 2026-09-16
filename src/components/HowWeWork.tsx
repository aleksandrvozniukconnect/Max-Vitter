import { photos, steps } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Reveal } from './Reveal'
import styles from './HowWeWork.module.css'

export function HowWeWork() {
  const { copy } = useLocale()
  const { howWeWork } = copy

  return (
    <section className={styles.section} id="how">
      <Reveal className={styles.intro}>
        <p className="eyebrow">{howWeWork.eyebrow}</p>
        <h2 className="section-title">{howWeWork.title}</h2>
        <p className="lede">{howWeWork.lede}</p>
      </Reveal>

      <div className={styles.media}>
        <img src={photos.process} alt="" />
      </div>

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <ol className={styles.rail} aria-label={howWeWork.rail}>
            {steps.map((step) => (
              <li key={step.key}>
                <a href={`#step-${step.key}`}>
                  <span>{step.n}</span> {copy.steps[step.key].title}
                </a>
              </li>
            ))}
          </ol>

          <div className={styles.cards}>
            {steps.map((step, index) => {
              const text = copy.steps[step.key]
              return (
                <Reveal key={step.key} delay={index * 0.04} className={styles.card}>
                  <div className={styles.cardHead} id={`step-${step.key}`}>
                    <span className={styles.n}>{step.n}</span>
                    <h3>{text.title}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p>{text.body}</p>
                    <p className={styles.deliverable}>
                      <span>{howWeWork.youReceive}</span>
                      {text.deliverable}
                    </p>
                    {step.gate ? (
                      <p className={styles.gate}>
                        <span className={styles.stamp}>{text.gate}</span>
                        <span className={styles.gateNote}>{howWeWork.gateNote}</span>
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
