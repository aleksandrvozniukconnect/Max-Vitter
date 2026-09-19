import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Logo } from './Logo'
import { AppLink } from './AppLink'
import { useLocale } from '../context/LocaleContext'
import { nav } from '../content/site'
import { usePathname } from '../hooks/usePathname'
import { localeIds, localeLabels } from '../i18n/locale'
import { isProjectsPath, PROJECTS_PATH, skipLogoIntro } from '../lib/routes'
import { useLogoIntro } from './useLogoIntro'
import styles from './Header.module.css'

export function Header() {
  const { locale, setLocale, copy } = useLocale()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const skipIntro = skipLogoIntro(pathname)
  const { ready, navReady, settled, showIntro, slotRef, scale, chrome, navY, bandHeight, spacerHeight } =
    useLogoIntro(menuOpen, skipIntro)
  const compactFromStart = !showIntro

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
        className={`${styles.header} ${showIntro ? styles.fixed : ''} ${settled ? styles.settled : ''} ${compactFromStart ? styles.compactFromStart : ''}`}
        style={showIntro ? { height: bandHeight } : undefined}
      >
        <AppLink
          className={styles.brand}
          href="/"
          aria-label={copy.header.homeAria}
          ref={slotRef}
        >
          <motion.span
            className={styles.brandMark}
            style={
              showIntro
                ? {
                    scale,
                    originX: 0,
                    originY: 0,
                    opacity: ready ? 1 : 0,
                  }
                : undefined
            }
          >
            <Logo />
          </motion.span>
        </AppLink>

        <motion.nav
          className={styles.desktopNav}
          aria-label={copy.header.primaryNavAria}
          aria-hidden={!navReady}
          inert={!navReady}
          style={showIntro ? { opacity: chrome, y: navY } : undefined}
        >
          {nav.map((item) => (
            <AppLink
              key={item.href}
              href={item.href}
              aria-current={item.href === PROJECTS_PATH && isProjectsPath(pathname) ? 'page' : undefined}
              className={
                item.href === PROJECTS_PATH && isProjectsPath(pathname) ? styles.navCurrent : undefined
              }
            >
              {copy.nav[item.key]}
            </AppLink>
          ))}
        </motion.nav>

        <motion.div
          className={styles.actions}
          aria-hidden={!navReady}
          inert={!navReady}
          style={showIntro ? { opacity: chrome, y: navY } : undefined}
        >
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

          <AppLink className={styles.cta} href="/#start">
            {copy.header.sendProject}
            <span className={styles.ctaDot} aria-hidden="true" />
          </AppLink>

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
        </motion.div>

        {menuOpen
          ? createPortal(
              <div className={styles.overlay} role="dialog" aria-label={copy.header.menuAria}>
                <nav className={styles.overlayNav}>
                  <AppLink href="/" onClick={closeMenu}>
                    {copy.header.home}
                  </AppLink>
                  {nav.map((item) => (
                    <AppLink key={item.href} href={item.href} onClick={closeMenu}>
                      {copy.nav[item.key]}
                    </AppLink>
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
