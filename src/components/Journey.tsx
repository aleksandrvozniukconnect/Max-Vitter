import { journey } from '../content/site'
import { Reveal } from './Reveal'
import styles from './Journey.module.css'

export function Journey() {
  return (
    <section className={styles.section} id="journey">
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>The production sequence</p>
        <h2>Seven chapters. Three gates.</h2>
        <p className={styles.lede}>
          How we work is the conversation you can follow. The journey is the plant sequence underneath it —
          the chapters a package actually moves through, and the stamps that stop it if the set is not true.
        </p>
      </Reveal>

      <ol className={styles.list}>
        {journey.map((item) =>
          item.kind === 'gate' ? (
            <li key={item.stamp} className={styles.gateItem}>
              <Reveal className={styles.gate}>
                <span className={styles.stamp}>{item.stamp}</span>
                <p>{item.note}</p>
              </Reveal>
            </li>
          ) : (
            <li key={item.title} className={styles.chapterItem}>
              <Reveal className={styles.chapter}>
                <p className={styles.n}>Chapter {item.n}</p>
                <h3>{item.title}</h3>
                <p className={styles.body}>{item.body}</p>
              </Reveal>
            </li>
          ),
        )}
      </ol>
    </section>
  )
}
