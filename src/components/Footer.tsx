import { marketFacts, nav } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { localeIds, localeLabels } from '../i18n/locale'
import { Logo } from './Logo'
import { AppLink } from './AppLink'
import styles from './Footer.module.css'

export function Footer() {
  const { locale, setLocale, copy } = useLocale()
  const desk = { ...marketFacts.UA, ...copy.markets.UA }

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
                <AppLink href={item.href}>{copy.nav[item.key]}</AppLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{desk.label}</h2>
          <p>
            {desk.city}
            <br />
            <a href={`tel:${desk.phone.replace(/\s/g, '')}`}>{desk.phone}</a>
            <br />
            <a href={`mailto:${desk.email}`}>{desk.email}</a>
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
