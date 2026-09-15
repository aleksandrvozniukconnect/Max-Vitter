import styles from './Logo.module.css'

type LogoProps = {
  compact?: boolean
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <span className={`${styles.logo} ${compact ? styles.compact : ''}`}>
      <svg className={styles.mark} viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="6" fill="currentColor" />
        <path fill="#fff" d="M8 30h32v6H8zM30 8h6v22h-6z" />
      </svg>
      <span className={styles.wordmark}>
        <span>design</span>
        <span>choice</span>
      </span>
    </span>
  )
}
