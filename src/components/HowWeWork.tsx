import { howWeWork, photos, steps } from '../content/site'
import { Reveal } from './Reveal'
import styles from './HowWeWork.module.css'

export function HowWeWork() {
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
                  <span>{step.n}</span> {step.title}
                </a>
              </li>
            ))}
          </ol>

          <div className={styles.cards}>
            {steps.map((step, index) => (
              <Reveal key={step.key} delay={index * 0.04} className={styles.card}>
                <div className={styles.cardHead} id={`step-${step.key}`}>
                  <span className={styles.n}>{step.n}</span>
                  <h3>{step.title}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p>{step.body}</p>
                  <p className={styles.deliverable}>
                    <span>You receive</span>
                    {step.deliverable}
                  </p>
                  {step.gate ? (
                    <p className={styles.gate}>
                      <span className={styles.stamp}>{step.gate}</span>
                      <span className={styles.gateNote}>Signed before the next step moves.</span>
                    </p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
