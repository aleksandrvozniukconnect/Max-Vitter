import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { useLocale } from '../context/LocaleContext'
import { nav } from '../content/site'
import { localeIds, localeLabels } from '../i18n/locale'
import { useLogoIntro } from './useLogoIntro'
import styles from './Header.module.css'

export function Header() {
  const { locale, setLocale, copy } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const { ready, navReady, showIntro, slotRef, scale, chrome, navY, bandHeight, spacerHeight } =
    useLogoIntro(menuOpen)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <span id="top" className={styles.topAnchor} />
      {showIntro ? <motion.div className={styles.introSpacer} style={{ height: spacerHeight }} aria-hidden="true" /> : null}
      <motion.header
        className={`${styles.header} ${showIntro ? styles.fixed : ''}`}
        style={{ height: bandHeight }}
      >
        <a
          className={styles.brand}
          href="#top"
          aria-label={copy.header.homeAria}
          ref={slotRef}
        >
          <motion.span
            className={styles.brandMark}
            style={{
              scale,
              originX: 0,
              originY: 0,
              opacity: ready ? 1 : 0,
            }}
          >
            <Logo />
          </motion.span>
        </a>

        <motion.nav
          className={styles.desktopNav}
          aria-label={copy.header.primaryNavAria}
          aria-hidden={!navReady}
          inert={!navReady}
          style={{ opacity: chrome, y: navY }}
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {copy.nav[item.key]}
            </a>
          ))}
        </motion.nav>

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

          <motion.a
            className={styles.cta}
            href="#start"
            aria-hidden={!navReady}
            inert={!navReady}
            style={{ opacity: chrome, y: navY }}
          >
            {copy.header.sendProject}
            <span className={styles.ctaDot} aria-hidden="true" />
          </motion.a>

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
      </motion.header>
    </>
  )
}
