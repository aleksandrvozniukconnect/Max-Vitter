import { photos } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { AppLink } from './AppLink'
import { Reveal } from './Reveal'
import styles from './ClosingCta.module.css'

type ClosingCtaProps = {
  title?: string
  cta?: string
  href?: string
}

export function ClosingCta({ title, cta, href = '/#start' }: ClosingCtaProps) {
  const { copy } = useLocale()

  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <img className={styles.bg} src={photos.cta} alt="" />
      <Reveal className={styles.panel}>
        <h2 id="closing-title">{title ?? copy.closing.title}</h2>
        <AppLink className={styles.button} href={href}>
          {cta ?? copy.closing.cta}
          <span aria-hidden="true" />
        </AppLink>
      </Reveal>
    </section>
  )
}
