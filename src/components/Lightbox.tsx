import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectPhoto } from '../content/projectPhotos'
import styles from './Lightbox.module.css'

export type LightboxLabels = { close: string; prev: string; next: string; of: string }

type Props = {
  /** Index of the photo on screen, or null while closed. */
  index: number | null
  photos: readonly ProjectPhoto[]
  title: string
  labels: LightboxLabels
  onChange: (index: number) => void
  onClose: () => void
}

const SWIPE_PX = 48

/**
 * Full-screen photo slider: arrows, Esc, swipe, counter, focus kept inside.
 * Focus returns to whatever opened it when it closes.
 */
export function Lightbox({ index, photos, title, labels, onChange, onClose }: Props) {
  const open = index !== null
  const dialog = useRef<HTMLDivElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const swipeFrom = useRef<number | null>(null)
  const last = photos.length - 1

  const go = useCallback(
    (step: number) => {
      if (index === null) return
      onChange((index + step + photos.length) % photos.length)
    },
    [index, onChange, photos.length],
  )

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closer.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      opener?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      } else if (event.key === 'Tab') {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
        if (!nodes || nodes.length === 0) return
        const first = nodes[0]
        const end = nodes[nodes.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          end.focus()
        } else if (!event.shiftKey && document.activeElement === end) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go, onClose])

  const onPointerDown = (event: PointerEvent) => {
    swipeFrom.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    const from = swipeFrom.current
    swipeFrom.current = null
    if (from === null) return
    const delta = event.clientX - from
    if (Math.abs(delta) >= SWIPE_PX) go(delta < 0 ? 1 : -1)
  }

  const photo = index === null ? null : photos[index]

  return createPortal(
    open && photo ? (
        <div className={styles.overlay} onClick={onClose}>
          <div
            ref={dialog}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closer} type="button" className={styles.close} aria-label={labels.close} onClick={onClose}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </button>

            <div
              className={styles.stage}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                swipeFrom.current = null
              }}
            >
              <img
                key={photo.src}
                className={styles.photo}
                src={photo.src}
                alt={`${title}, ${(index ?? 0) + 1}`}
                width={photo.width}
                height={photo.height}
                draggable={false}
              />
            </div>

            {last > 0 ? (
              <>
                <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label={labels.prev} onClick={() => go(-1)}>
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                    <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label={labels.next} onClick={() => go(1)}>
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                    <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            ) : null}

            <p className={styles.counter} aria-live="polite">
              {(index ?? 0) + 1} {labels.of} {photos.length}
            </p>
          </div>
        </div>
      ) : null,
    document.body,
  )
}
