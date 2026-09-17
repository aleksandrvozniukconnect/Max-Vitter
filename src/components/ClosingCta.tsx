import { photos } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Reveal } from './Reveal'
import styles from './ClosingCta.module.css'

export function ClosingCta() {
  const { copy } = useLocale()

  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <img className={styles.bg} src={photos.cta} alt="" />
      <Reveal className={styles.panel}>
        <h2 id="closing-title">{copy.closing.title}</h2>
        <a className={styles.button} href="#start">
          {copy.closing.cta}
          <span aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  )
}
