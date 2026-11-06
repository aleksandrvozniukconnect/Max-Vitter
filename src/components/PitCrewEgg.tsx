import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocale } from '../context/LocaleContext'
import { MetronomeIcon } from './PitIcons'
import { crewSpots } from '../content/crew'
import styles from './PitCrewEgg.module.css'

/** The red "i" next to the section eyebrow; opens the pit-crew picture. */
export function PitCrewEgg() {
  const { copy } = useLocale()
  const egg = copy.howWeWork.egg
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      // The dialog holds a single control, so Tab stays on it.
      if (event.key === 'Tab') {
        event.preventDefault()
        closer.current?.focus()
      }
    }
    const overflow = document.body.style.overflow
    const trigger = opener.current
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closer.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={styles.trigger}
        aria-label={egg.label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path d="M12.6 10.2 C11.8 12.6 11 15 10.7 17.2 C10.6 18.2 11.2 18.6 12.1 18.1 C12.7 17.8 13.2 17.3 13.7 16.7" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="13.5" cy="5.9" r="1.5" fill="currentColor" />
        </svg>
      </button>
      {createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-label={egg.title}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closer}
                type="button"
                className={styles.close}
                aria-label={egg.close}
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
              <h3 className={styles.title}>{egg.title}</h3>
              <div className={styles.body}>
                <div className={styles.art}>
                  <img src="/images/egg/pitcrew.webp" alt="" width={900} height={1200} draggable={false} />
                  {crewSpots.map((spot, i) => (
                    <span key={spot.role} className={styles.marker} style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
                      {i + 1}
                    </span>
                  ))}
                </div>
                <ol className={styles.legend}>
                  {crewSpots.map((spot) => (
                    <li key={spot.role}>{egg.roles[spot.role]}</li>
                  ))}
                </ol>
              </div>
              <p className={styles.caption}>{egg.caption}</p>
              <p className={styles.pace}>
                <MetronomeIcon />
                <span>{copy.howWeWork.pace}</span>
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
      )}
    </>
  )
}
