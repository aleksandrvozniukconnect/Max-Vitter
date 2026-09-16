import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Logo } from './Logo'
import { useLocale } from '../context/LocaleContext'
import { nav } from '../content/site'
import { localeIds, localeLabels } from '../i18n/locale'
import styles from './Header.module.css'

export function Header() {
  const { locale, setLocale, copy } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label={copy.header.homeAria}>
        <Logo />
      </a>

      <nav className={styles.desktopNav} aria-label={copy.header.primaryNavAria}>
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {copy.nav[item.key]}
          </a>
        ))}
      </nav>

      <div className={styles.actions}>
        <div className={styles.langs} role="group" aria-label={copy.header.languageAria}>
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
        </div>

        <a className={styles.cta} href="#start">
          {copy.header.sendProject}
          <span className={styles.ctaDot} aria-hidden="true" />
        </a>

        <button
          type="button"
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? copy.header.closeMenu : copy.header.openMenu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      {menuOpen
        ? createPortal(
            <div className={styles.overlay} role="dialog" aria-label={copy.header.menuAria}>
              <nav className={styles.overlayNav}>
                <a href="#top" onClick={closeMenu}>
                  {copy.header.home}
                </a>
                {nav.map((item) => (
                  <a key={item.href} href={item.href} onClick={closeMenu}>
                    {copy.nav[item.key]}
                  </a>
                ))}
              </nav>
              <p className={styles.overlayNote}>{copy.markets.UA.heroLine}</p>
            </div>,
            document.body,
          )
        : null}
    </header>
  )
}
