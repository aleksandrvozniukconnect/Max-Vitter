import { photos } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Plant() {
  const { copy } = useLocale()
  const { plant } = copy

  return (
    <section className={styles.section} aria-labelledby="plant-title">
      <div className={`${styles.wrap} ${styles.plant}`}>
        <Reveal className={styles.plantMedia}>
          <img src={photos.plant} alt="" width={441} height={536} loading="lazy" />
        </Reveal>
        <Reveal className={styles.plantCopy} delay={0.08}>
          <Eyebrow align="left">{plant.eyebrow}</Eyebrow>
          <h2 id="plant-title">{plant.title}</h2>
          <p>{plant.lead}</p>
          <ol className={styles.steps}>
            {plant.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{plant.body}</p>
          <ul className={styles.facts}>
            {plant.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
