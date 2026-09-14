import { mosaic, photos } from '../content/site'
import { Reveal } from './Reveal'
import styles from './Mosaic.module.css'

export function Mosaic() {
  return (
    <section className={styles.section} aria-labelledby="mosaic-title">
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>{mosaic.eyebrow}</p>
        <h2 id="mosaic-title">{mosaic.title}</h2>
        <p className={styles.subtitle}>{mosaic.subtitle}</p>
      </Reveal>

      <div className={styles.grid}>
        <figure className={`${styles.cell} ${styles.spanTall}`}>
          <img src={photos.mosaicMaterial} alt="" />
          <figcaption>Material — temporary photography</figcaption>
        </figure>
        <article className={`${styles.cell} ${styles.textCell}`}>
          <p>A system, not a catalog. Assemblies, edges, and hardware chosen so the drawing can survive the floor.</p>
        </article>
        <figure className={styles.cell}>
          <img src={photos.mosaicGeometry} alt="" />
          <figcaption>Geometry</figcaption>
        </figure>
        <figure className={styles.cell}>
          <img src={photos.mosaicDrawing} alt="" />
          <figcaption>Sequence starts on paper</figcaption>
        </figure>
        <article className={`${styles.cell} ${styles.quoteCell}`}>
          <p>{mosaic.subtitle}</p>
        </article>
        <figure className={`${styles.cell} ${styles.spanWide}`}>
          <img src={photos.mosaicInterior} alt="" />
          <figcaption>Interior as the destination of the set</figcaption>
        </figure>
        {mosaic.projects.map((project, index) => (
          <article key={project.title} className={`${styles.cell} ${styles.case}`}>
            <img src={index === 0 ? photos.projectA : photos.projectB} alt="" />
            <div>
              <h3>{project.title}</h3>
              <p>
                <strong>Challenge.</strong> {project.challenge}
              </p>
              <p>
                <strong>Result.</strong> {project.result}
              </p>
            </div>
          </article>
        ))}
      </div>

      <ul className={styles.caps}>
        {mosaic.capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
