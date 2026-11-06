import { chaptersFrom, featuredChapters } from '../content/projects'
import { PROJECTS_PATH } from '../lib/routes'
import { useLocale } from '../context/LocaleContext'
import { AppLink } from './AppLink'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'
import styles from './Proof.module.css'

export function Projects() {
  const { copy } = useLocale()
  const { projects } = copy
  const featured = featuredChapters(chaptersFrom(copy))

  return (
    <section className={styles.section} id="projects">
      <Reveal className={styles.head}>
        <Eyebrow>{projects.eyebrow}</Eyebrow>
        <h2 className="section-title">{projects.title}</h2>
        <p className="lede">{projects.lede}</p>
        <AppLink className={`pill ${styles.seeAll}`} href={PROJECTS_PATH}>
          {projects.seeAll}
        </AppLink>
      </Reveal>
      <div className={`${styles.wrap} ${styles.cases}`}>
        {featured.map((item, index) => {
          return (
            <Reveal key={item.key} delay={index * 0.05} className={styles.case}>
              <AppLink href={`${PROJECTS_PATH}#case-${item.key}`} className={styles.caseLink}>
                <img src={item.photo} alt={item.title} loading="lazy" />
                <div className={styles.caseBody}>
                  <div className={styles.caseMeta}>
                    <h3>{item.title}</h3>
                    <span>{item.sector}</span>
                  </div>
                  <p>{item.summary}</p>
                </div>
              </AppLink>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
