import { company, nav } from '../content/site'
import { useMarket } from '../context/MarketContext'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  const { market } = useMarket()

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo compact />
          <p className={styles.blurb}>{company.blurb}</p>
        </div>
        <div>
          <h2>Site</h2>
          <ul>
            <li>
              <a href="#top">Home</a>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Partners</h2>
          <ul>
            {company.partners.map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Market overlay</h2>
          <p>
            {market.label}
            <br />
            {market.desk}
            <br />
            {market.email}
            <br />
            {market.phone}
          </p>
        </div>
      </div>
      <p className={styles.legal}>Design Choice · Production partner · UA / US / ME</p>
    </footer>
  )
}
