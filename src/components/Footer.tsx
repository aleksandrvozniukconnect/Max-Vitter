import { nav } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { useMarketView } from '../context/MarketContext'
import { localeIds, localeLabels } from '../i18n/locale'
import { Logo } from './Logo'
import styles from './Footer.module.css'

export function Footer() {
  const { market } = useMarketView()
  const { locale, setLocale, copy } = useLocale()

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Logo tone="light" compact />
          <p className={styles.tagline}>{copy.footer.tagline}</p>
        </div>
        <div>
          <h2>{copy.footer.site}</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{copy.nav[item.key]}</a>
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
          <h2>{copy.footer.language}</h2>
          <p className={styles.langs} role="group" aria-label={copy.header.languageAria}>
            {localeIds.map((id) => (
              <button
                type="button"
                key={id}
                aria-pressed={id === locale}
                className={id === locale ? styles.langActive : undefined}
                onClick={() => setLocale(id)}
              >
                {localeLabels[id]}
              </button>
            ))}
          </p>
        </div>
      </div>
      <p className={styles.legal}>
        {copy.footer.legal} · {new Date().getFullYear()}
      </p>
    </footer>
  )
}
