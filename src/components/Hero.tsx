import { motion, useReducedMotion } from 'framer-motion'
import { hero, photos } from '../content/site'
import { useMarket } from '../context/MarketContext'
import styles from './Hero.module.css'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const { market } = useMarket()

  return (
    <section className={styles.hero} id="top">
      <div className={styles.copy}>
        <motion.p
          className="eyebrow"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease }}
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          className={styles.title}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.06, ease }}
        >
          {hero.title}
        </motion.h1>
        <motion.p
          className={styles.lede}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease }}
        >
          {hero.lede}
        </motion.p>
        <motion.div
          className={styles.actions}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
        >
          <a className="pill" href={hero.primary.href}>
            {hero.primary.label}
          </a>
          <a className="pill pill--ghost" href={hero.secondary.href}>
            {hero.secondary.label}
          </a>
        </motion.div>
      </div>

      <div className={styles.media}>
        <img src={photos.hero} alt="" />
        <p className={styles.marketLine}>{market.heroLine}</p>
      </div>
    </section>
  )
}
