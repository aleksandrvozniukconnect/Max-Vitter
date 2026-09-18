import { brand } from '../content/site'
import styles from './Logo.module.css'

type LogoProps = {
  tone?: 'dark' | 'light'
  compact?: boolean
}

export function Logo({ tone = 'dark', compact = false }: LogoProps) {
  return (
    <img
      className={`${styles.logo} ${compact ? styles.compact : ''}`}
      src={tone === 'dark' ? brand.logoDark : brand.logoLight}
      alt="DSGN Choice"
      width={194}
      height={64}
    />
  )
}
