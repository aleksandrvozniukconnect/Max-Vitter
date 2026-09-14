import { howWeWork, howWeWorkSteps, photos } from '../content/site'
import { Reveal } from './Reveal'
import styles from './HowWeWork.module.css'

export function HowWeWork() {
  return (
    <section className={styles.section} id="how">
      <div className={styles.intro}>
        <Reveal>
          <p className={styles.eyebrow}>{howWeWork.rail}</p>
          <h2 className={styles.title}>{howWeWork.introTitle}</h2>
          <p className={styles.lede}>{howWeWork.introLede}</p>
        </Reveal>
      </div>

      <div className={styles.media}>
        <img src={photos.process} alt="" />
        <span>Temporary plant photography</span>
      </div>

      <div className={styles.band}>
        <div className={styles.bandInner}>
          <p className={styles.rail}>{howWeWork.rail}</p>
          <div className={styles.cards}>
            {howWeWorkSteps.map((step, index) => (
              <Reveal key={step.key} delay={index * 0.04} className={styles.card}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
