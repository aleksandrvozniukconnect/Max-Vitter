import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { chaptersFrom, type ProjectChapter } from '../content/projects'
import { projectKeys, type ProjectKey } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { applyDocumentLocale } from '../i18n/locale'
import { nextItem, pickActiveCase } from '../lib/dossier'
import { scrollToHash } from '../lib/navigate'
import { ClosingCta } from '../components/ClosingCta'
import { Reveal } from '../components/Reveal'
import styles from './ProjectsPage.module.css'

export function ProjectsPage() {
  const { locale, copy } = useLocale()
  const reduce = useReducedMotion()
  const chapters = chaptersFrom(copy)
  const page = copy.projectsPage
  const [active, setActive] = useState<ProjectKey>(projectKeys[0])

  useLayoutEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash)
    else window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    applyDocumentLocale(locale, page.meta)
    return () => applyDocumentLocale(locale, copy.meta)
  }, [locale, page.meta, copy.meta])

  useEffect(() => {
    const ratios: Partial<Record<ProjectKey, number>> = {}
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = entry.target.getAttribute('data-case')
          if (!key) continue
          ratios[key as ProjectKey] = entry.isIntersecting ? entry.intersectionRatio : 0
        }
        setActive(pickActiveCase(projectKeys, ratios, projectKeys[0]))
      },
      { rootMargin: '-28% 0px -48% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8] },
    )

    for (const key of projectKeys) {
      const node = document.getElementById(`case-${key}`)
      if (node) observer.observe(node)
    }

    return () => observer.disconnect()
  }, [chapters.length])

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Reveal>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className={styles.heroTitle}>{page.title}</h1>
          <p className={styles.heroLede}>{page.lede}</p>
        </Reveal>
      </header>

      {chapters.length === 0 ? (
        <p className={styles.empty}>{page.empty}</p>
      ) : (
        <>
          <nav className={styles.mobileIndex} aria-label={page.indexAria}>
            {chapters.map((item) => (
              <a
                key={item.key}
                href={`#case-${item.key}`}
                aria-current={item.key === active ? 'true' : undefined}
              >
                <span>{item.n}</span>
                {item.shortTitle}
              </a>
            ))}
          </nav>

          <div className={styles.dossier}>
            <div className={styles.dossierInner}>
              <aside className={styles.rail}>
                <p className={styles.railLabel}>{page.indexLabel}</p>
                <nav aria-label={page.indexAria}>
                  <ol className={styles.railList}>
                    {chapters.map((item) => (
                      <li key={item.key}>
                        <a
                          href={`#case-${item.key}`}
                          aria-current={item.key === active ? 'true' : undefined}
                        >
                          <span className={styles.railN}>{item.n}</span>
                          {item.shortTitle}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <div className={styles.stage}>
                {chapters.map((item, index) => (
                  <CaseChapter
                    key={item.key}
                    item={item}
                    next={nextItem(chapters, index)}
                    reduce={reduce}
                    copy={copy}
                    nextLabel={page.next}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <ClosingCta title={page.ctaTitle} cta={page.cta} href="/#start" />
    </div>
  )
}

function CaseChapter({
  item,
  next,
  reduce,
  copy,
  nextLabel,
}: {
  item: ProjectChapter
  next: ProjectChapter | null
  reduce: boolean | null
  copy: ReturnType<typeof useLocale>['copy']
  nextLabel: string
}) {
  return (
    <article
      className={styles.chapter}
      id={`case-${item.key}`}
      data-case={item.key}
      aria-labelledby={`case-title-${item.key}`}
    >
      <div className={styles.chapterHead}>
        <div>
          <p className={styles.kicker}>
            <span className={styles.n}>{item.n}</span>
            <span className={styles.sector}>{item.sector}</span>
          </p>
          <h2 className={styles.chapterTitle} id={`case-title-${item.key}`}>
            {item.title}
          </h2>
        </div>
        <motion.span
          className={styles.stamp}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.marketLabel}
        </motion.span>
      </div>

      <ul className={styles.tags}>
        {item.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p className={styles.outcome}>{item.result}</p>

      <CaseMedia src={item.photo} label={item.placeholder} reduce={Boolean(reduce)} />

      <div className={styles.notes}>
        <p>
          <strong>{copy.projects.challenge}</strong>
          {item.challenge}
        </p>
        <p>
          <strong>{copy.projects.result}</strong>
          {item.result}
        </p>
      </div>

      {next ? (
        <a className={styles.filmstrip} href={`#case-${next.key}`}>
          <span className={styles.filmstripImg}>
            <img
              src={next.photo}
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </span>
          <span>
            <span className={styles.filmstripLabel}>
              {nextLabel} · {next.n}
            </span>
            <span className={styles.filmstripTitle}>{next.shortTitle}</span>
          </span>
        </a>
      ) : null}
    </article>
  )
}

function CaseMedia({
  src,
  label,
  reduce,
}: {
  src: string
  label: string
  reduce: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.12, 1, 1.04])

  return (
    <div ref={ref} className={styles.media}>
      {failed ? null : (
        <motion.img src={src} alt="" style={{ y, scale }} onError={() => setFailed(true)} />
      )}
      <span className={styles.photoNote}>{label}</span>
    </div>
  )
}
