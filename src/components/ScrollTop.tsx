import { useEffect, useState } from 'react'
import styles from './ScrollTop.module.css'

export function ScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY
      const half = document.documentElement.scrollHeight * 0.5 - window.innerHeight
      setVisible(scrolled > half)
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <button
      className={`${styles.btn} ${visible ? styles.show : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 16V4m0 0L4 10m6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
