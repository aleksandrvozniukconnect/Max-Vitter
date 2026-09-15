import { photos, plant } from '../content/site'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Plant() {
  return (
    <section className={styles.section} aria-labelledby="plant-title">
      <div className={`${styles.wrap} ${styles.plant}`}>
        <Reveal className={styles.plantMedia}>
          <img src={photos.plant} alt="" />
        </Reveal>
        <Reveal className={styles.plantCopy} delay={0.08}>
          <p className="eyebrow">{plant.eyebrow}</p>
          <h2 id="plant-title">{plant.title}</h2>
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
