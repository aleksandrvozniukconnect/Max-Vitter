import { motion, useReducedMotion } from 'framer-motion'
import { hero, photos } from '../content/site'
import { useMarket } from '../context/MarketContext'
import { Reveal } from './Reveal'
import styles from './Hero.module.css'

export function Hero() {
  const reduce = useReducedMotion()
  const { market } = useMarket()

  return (
    <section className={styles.hero} id="top">
      <div className={styles.copy}>
        <motion.p
          className={styles.eyebrow}
          initial={reduce ? false : { opacity: 0, color: '#f3f1ee' }}
          animate={{ opacity: 1, color: '#111111' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          className={styles.title}
          initial={reduce ? false : { opacity: 0, color: '#f2eee9' }}
          animate={{ opacity: 1, color: '#000000' }}
          transition={{ duration: 1.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.title}
        </motion.h1>
        <motion.p
          className={styles.lede}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.lede}
        </motion.p>
        <p className={styles.market}>{market.note}</p>
      </div>

      <div className={styles.media}>
        <img src={photos.hero} alt="" />
        <span className={styles.caption}>Temporary plant photography</span>
      </div>

      <Reveal className={styles.details}>
        <figure className={styles.detailA}>
          <img src={photos.detailB} alt="" />
        </figure>
        <figure className={styles.detailB}>
          <img src={photos.detailA} alt="" />
        </figure>
      </Reveal>
    </section>
  )
}
