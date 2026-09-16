import { audienceKeys } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Audiences() {
  const { copy } = useLocale()
  const { audiences } = copy

  return (
    <section className={styles.section} aria-labelledby="audiences-title">
      <Reveal className={styles.head}>
        <p className="eyebrow">{audiences.eyebrow}</p>
        <h2 id="audiences-title" className="section-title">
          {audiences.title}
        </h2>
      </Reveal>
      <div className={`${styles.wrap} ${styles.audiences}`}>
        {audienceKeys.map((key, index) => {
          const item = audiences.items[key]
          return (
            <Reveal key={key} delay={index * 0.05} className={styles.audience}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
