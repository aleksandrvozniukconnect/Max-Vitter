import { footer, nav } from '../content/site'
import { useMarket } from '../context/MarketContext'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  const { market } = useMarket()

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo tone="light" compact />
          <p className={styles.tagline}>{footer.tagline}</p>
        </div>
        <div>
          <h2>Site</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{market.label}</h2>
          <p>
            {market.city}
            <br />
            <a href={`tel:${market.phone.replace(/\s/g, '')}`}>{market.phone}</a>
            <br />
            <a href={`mailto:${market.email}`}>{market.email}</a>
          </p>
        </div>
        <div>
          <h2>Language</h2>
          <p>{footer.languages}</p>
        </div>
      </div>
      <p className={styles.legal}>
        {footer.legal} · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
