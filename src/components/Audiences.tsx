import { audienceKeys } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { DesignerIcon } from './AudienceIcons'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Audiences() {
  const { copy } = useLocale()
  const { audiences } = copy

  return (
    <section className={styles.section} aria-labelledby="audiences-title">
      <Reveal className={styles.head}>
        <Eyebrow>{audiences.eyebrow}</Eyebrow>
        <h2 id="audiences-title" className="section-title">
          {audiences.title}
        </h2>
      </Reveal>
      <div className={`${styles.wrap} ${styles.audiences}`}>
        {audienceKeys.map((key, index) => {
          const item = audiences.items[key]
          return (
            <Reveal key={key} delay={index * 0.05} className={styles.audienceSlot}>
              <article className={styles.audience}>
                <span className={styles.audienceIcon}>
                  <img src={`/images/audiences/${key === 'developers' ? 'developers' : 'architects'}.webp`} alt="" width={128} height={128} loading="lazy" draggable={false} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            </Reveal>
          )
        })}
        <Reveal className={styles.audienceBridge}>
          <p className={styles.audienceNote}>
            <span className={styles.audienceNoteIcon}>
              <DesignerIcon />
            </span>
            <span>{audiences.note}</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
