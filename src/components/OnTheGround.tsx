import { ground, marketIds, markets } from '../content/site'
import { useMarket } from '../context/MarketContext'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function OnTheGround() {
  const { marketId, setMarketId } = useMarket()

  return (
    <section className={`${styles.section} ${styles.sectionPaper}`} id="ground">
      <Reveal className={styles.head}>
        <p className="eyebrow">{ground.eyebrow}</p>
        <h2 className="section-title">{ground.title}</h2>
        <p className="lede">{ground.lede}</p>
      </Reveal>
      <div className={`${styles.wrap} ${styles.places}`}>
        {marketIds.map((id, index) => {
          const m = markets[id]
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
                <h3>{m.label}</h3>
                <p className={styles.placeCity}>{m.city}</p>
                <p className={styles.placeRole}>{m.role}</p>
                <p className={styles.placeContact}>
                  {m.person}
                  <br />
                  <a href={`tel:${m.phone.replace(/\s/g, '')}`}>{m.phone}</a> · {m.hours}
                  <br />
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                </p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
