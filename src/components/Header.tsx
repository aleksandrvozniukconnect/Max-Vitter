import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Logo } from './Logo'
import { useLocale } from '../context/LocaleContext'
import { useMarketView } from '../context/MarketContext'
import { marketIds, nav } from '../content/site'
import { localeIds, localeLabels } from '../i18n/locale'
import styles from './Header.module.css'

export function Header() {
  const { marketId, setMarketId, market } = useMarketView()
  const { locale, setLocale, copy } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!regionRef.current?.contains(event.target as Node)) setRegionOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

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
        <div className={styles.region} ref={regionRef}>
          <button
            type="button"
            className={styles.regionBtn}
            aria-haspopup="listbox"
            aria-expanded={regionOpen}
            aria-label={copy.header.marketOverlayAria}
            onClick={() => setRegionOpen((open) => !open)}
          >
            <GlobeIcon />
            <span>{marketId}</span>
          </button>
          {regionOpen ? (
            <ul className={styles.regionMenu} role="listbox" aria-label={copy.header.marketOverlayAria}>
              {marketIds.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={id === marketId}
                    className={id === marketId ? styles.regionActive : undefined}
                    onClick={() => {
                      setMarketId(id)
                      setRegionOpen(false)
                    }}
                  >
                    <span>{id}</span>
                    <em>{copy.markets[id].label}</em>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

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
              <p className={styles.overlayNote}>{market.heroLine}</p>
            </div>,
            document.body,
          )
        : null}
    </header>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.8-3.8-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}
