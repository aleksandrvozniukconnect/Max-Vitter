import { closing, photos } from '../content/site'
import { Reveal } from './Reveal'
import styles from './ClosingCta.module.css'

export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <img className={styles.bg} src={photos.cta} alt="" />
      <Reveal className={styles.panel}>
        <h2 id="closing-title">{closing.title}</h2>
        <a className={styles.button} href="#start">
          {closing.cta}
          <span aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  )
}
