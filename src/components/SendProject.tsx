import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { marketIds, markets, sendForm } from '../content/site'
import { useMarket } from '../context/MarketContext'
import { validateProjectForm, type ProjectFormValues } from '../lib/form'
import { Reveal } from './Reveal'
import styles from './SendProject.module.css'

const empty = (country: string): ProjectFormValues => ({
  name: '',
  company: '',
  country,
  projectType: '',
  timing: '',
  comment: '',
  cloudLink: '',
  fileNames: [],
})

export function SendProject() {
  const { market } = useMarket()
  const [values, setValues] = useState<ProjectFormValues>(() => empty(market.id))
  const [errors, setErrors] = useState<ReturnType<typeof validateProjectForm>>({})
  const [submitted, setSubmitted] = useState(false)

  const marketOptions = useMemo(
    () => [
      ...marketIds.map((id) => ({ value: id, label: markets[id].label })),
      { value: 'Other', label: 'Other' },
    ],
    [],
  )

  const onField =
    (key: keyof ProjectFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }))
    }

  const onFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map((file) => file.name)
    setValues((current) => ({ ...current, fileNames: names }))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateProjectForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <section className={styles.section} id="start">
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>{sendForm.eyebrow}</p>
        <h2>{sendForm.title}</h2>
        <p className={styles.lede}>{sendForm.lede}</p>
        <p className={styles.desk}>
          {market.label} · {market.email} · {market.phone}
        </p>
      </Reveal>

      {submitted ? (
        <Reveal className={styles.thanks}>
          <h3>{sendForm.thanksTitle}</h3>
          <p>{sendForm.thanksBody}</p>
        </Reveal>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label>
            Name
            <input value={values.name} onChange={onField('name')} autoComplete="name" />
            {errors.name ? <span>{errors.name}</span> : null}
          </label>
          <label>
            Company
            <input value={values.company} onChange={onField('company')} autoComplete="organization" />
            {errors.company ? <span>{errors.company}</span> : null}
          </label>
          <label>
            Country
            <select value={values.country} onChange={onField('country')}>
              {marketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.country ? <span>{errors.country}</span> : null}
          </label>
          <label>
            Project type
            <select value={values.projectType} onChange={onField('projectType')}>
              <option value="">Select</option>
              {sendForm.projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.projectType ? <span>{errors.projectType}</span> : null}
          </label>
          <label>
            Timing
            <select value={values.timing} onChange={onField('timing')}>
              <option value="">Select</option>
              {sendForm.timings.map((timing) => (
                <option key={timing} value={timing}>
                  {timing}
                </option>
              ))}
            </select>
            {errors.timing ? <span>{errors.timing}</span> : null}
          </label>
          <label className={styles.wide}>
            Comment
            <textarea value={values.comment} onChange={onField('comment')} rows={4} />
            {errors.comment ? <span>{errors.comment}</span> : null}
          </label>
          <label className={styles.wide}>
            Cloud link
            <input
              value={values.cloudLink}
              onChange={onField('cloudLink')}
              placeholder="https://"
              inputMode="url"
            />
          </label>
          <label className={`${styles.wide} ${styles.drop}`}>
            Files
            <input type="file" accept=".pdf,.dwg,.xls,.xlsx" multiple onChange={onFiles} />
            <em>
              {values.fileNames.length > 0
                ? values.fileNames.join(', ')
                : sendForm.acceptHint}
            </em>
            {errors.files ? <span>{errors.files}</span> : null}
          </label>
          <div className={styles.actions}>
            <button type="submit">
              Send your project
              <i />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
