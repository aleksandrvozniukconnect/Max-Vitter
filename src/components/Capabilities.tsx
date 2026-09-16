import { capabilityKeys, photos } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Capabilities() {
  const { copy } = useLocale()
  const { capabilities } = copy

  return (
    <section className={`${styles.section} ${styles.sectionPaper}`} id="capabilities">
      <Reveal className={styles.head}>
        <p className="eyebrow">{capabilities.eyebrow}</p>
        <h2 className="section-title">{capabilities.title}</h2>
      </Reveal>
      <div className={`${styles.wrap} ${styles.tiles}`}>
        {capabilityKeys.map((key, index) => {
          const item = capabilities.items[key]
          return (
            <Reveal key={key} delay={index * 0.05}>
              <figure className={styles.tile}>
                <img src={photos.capabilities[index]} alt="" loading="lazy" />
                <figcaption>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </figcaption>
              </figure>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
