import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { useMarket } from '../context/MarketContext'
import { marketIds, markets, nav } from '../content/site'
import styles from './Header.module.css'

export function Header() {
  const { marketId, setMarketId } = useMarket()
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
      <a className={styles.brand} href="#top" aria-label="Design Choice home">
        <Logo />
      </a>

      <nav className={styles.desktopNav} aria-label="Primary">
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
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
            onClick={() => setRegionOpen((open) => !open)}
          >
            <GlobeIcon />
            <span>{marketId}</span>
          </button>
          {regionOpen ? (
            <ul className={styles.regionMenu} role="listbox" aria-label="Market overlay">
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
                    <em>{markets[id].label}</em>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <a className={styles.cta} href="#start">
          Send project
          <span className={styles.ctaDot} aria-hidden="true" />
        </a>

        <button
          type="button"
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      {menuOpen ? (
        <div className={styles.overlay} role="dialog" aria-label="Menu">
          <nav className={styles.overlayNav}>
            <a href="#top" onClick={closeMenu}>
              Home
            </a>
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </nav>
          <p className={styles.overlayNote}>{markets[marketId].overlay}</p>
        </div>
      ) : null}
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
