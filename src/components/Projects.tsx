import { photos, projectKeys } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Projects() {
  const { copy } = useLocale()
  const { projects } = copy

  return (
    <section className={styles.section} id="projects">
      <Reveal className={styles.head}>
        <p className="eyebrow">{projects.eyebrow}</p>
        <h2 className="section-title">{projects.title}</h2>
        <p className="lede">{projects.lede}</p>
      </Reveal>
      <div className={`${styles.wrap} ${styles.cases}`}>
        {projectKeys.map((key, index) => {
          const item = projects.items[key]
          return (
            <Reveal key={key} delay={index * 0.05} className={styles.case}>
              <img src={photos.projects[index]} alt="" loading="lazy" />
              <div className={styles.caseBody}>
                <div className={styles.caseMeta}>
                  <h3>{item.title}</h3>
                  <span>{item.sector}</span>
                </div>
                <p>
                  <strong>{projects.challenge}</strong> {item.challenge}
                </p>
                <p>
                  <strong>{projects.result}</strong> {item.result}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
