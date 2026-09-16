import { marketFacts, marketIds } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { useMarketView } from '../context/MarketContext'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function OnTheGround() {
  const { marketId, setMarketId } = useMarketView()
  const { copy } = useLocale()

  return (
    <section className={`${styles.section} ${styles.sectionPaper}`} id="ground">
      <Reveal className={styles.head}>
        <p className="eyebrow">{copy.ground.eyebrow}</p>
        <h2 className="section-title">{copy.ground.title}</h2>
        <p className="lede">{copy.ground.lede}</p>
      </Reveal>
      <div className={`${styles.wrap} ${styles.places}`}>
        {marketIds.map((id, index) => {
          const text = copy.markets[id]
          const facts = marketFacts[id]
          const on = id === marketId
          return (
            <Reveal key={id} delay={index * 0.05}>
              <article
                className={`${styles.place} ${on ? styles.placeOn : ''}`}
                onMouseEnter={() => setMarketId(id)}
                onFocus={() => setMarketId(id)}
                tabIndex={0}
                aria-current={on ? 'true' : undefined}
              >
                <h3>{text.label}</h3>
                <p className={styles.placeCity}>{text.city}</p>
                <p className={styles.placeRole}>{text.role}</p>
                <p className={styles.placeContact}>
                  {text.person}
                  <br />
                  <a href={`tel:${facts.phone.replace(/\s/g, '')}`}>{facts.phone}</a> · {facts.hours}
                  <br />
                  <a href={`mailto:${facts.email}`}>{facts.email}</a>
                </p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
