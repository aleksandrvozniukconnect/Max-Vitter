import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { marketIds } from '../content/site'
import { useLocale } from '../context/LocaleContext'
import { useMarketView } from '../context/MarketContext'
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
  const { market } = useMarketView()
  const { copy } = useLocale()
  const form = copy.sendForm
  const [values, setValues] = useState<ProjectFormValues>(() => empty(market.id))
  const [attempted, setAttempted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const marketOptions = useMemo(
    () => [
      ...marketIds.map((id) => ({ value: id, label: copy.markets[id].label })),
      { value: 'Other', label: form.otherCountry },
    ],
    [copy.markets, form.otherCountry],
  )

  const errors = attempted ? validateProjectForm(values, form.errors) : {}

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
    const nextErrors = validateProjectForm(values, form.errors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      return
    }
    setAttempted(true)
  }

  return (
    <section className={styles.section} id="start">
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>{form.eyebrow}</p>
        <h2>{form.title}</h2>
        <p className={styles.lede}>{form.lede}</p>
        <p className={styles.desk}>
          {market.label} · {market.email} · {market.phone}
        </p>
      </Reveal>

      {submitted ? (
        <Reveal className={styles.thanks}>
          <h3>{form.thanksTitle}</h3>
          <p>{form.thanksBody}</p>
        </Reveal>
      ) : (
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label>
            {form.name}
            <input value={values.name} onChange={onField('name')} autoComplete="name" />
            {errors.name ? <span>{errors.name}</span> : null}
          </label>
          <label>
            {form.company}
            <input value={values.company} onChange={onField('company')} autoComplete="organization" />
            {errors.company ? <span>{errors.company}</span> : null}
          </label>
          <label>
            {form.country}
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
            {form.projectType}
            <select value={values.projectType} onChange={onField('projectType')}>
              <option value="">{form.select}</option>
              {form.projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.projectType ? <span>{errors.projectType}</span> : null}
          </label>
          <label>
            {form.timing}
            <select value={values.timing} onChange={onField('timing')}>
              <option value="">{form.select}</option>
              {form.timings.map((timing) => (
                <option key={timing.value} value={timing.value}>
                  {timing.label}
                </option>
              ))}
            </select>
            {errors.timing ? <span>{errors.timing}</span> : null}
          </label>
          <label className={styles.wide}>
            {form.comment}
            <textarea value={values.comment} onChange={onField('comment')} rows={4} />
            {errors.comment ? <span>{errors.comment}</span> : null}
          </label>
          <label className={styles.wide}>
            {form.cloudLink}
            <input
              value={values.cloudLink}
              onChange={onField('cloudLink')}
              placeholder="https://"
              inputMode="url"
            />
          </label>
          <label className={`${styles.wide} ${styles.drop}`}>
            {form.files}
            <input type="file" accept=".pdf,.dwg,.xls,.xlsx" multiple onChange={onFiles} />
            <em>{values.fileNames.length > 0 ? values.fileNames.join(', ') : form.acceptHint}</em>
            {errors.files ? <span>{errors.files}</span> : null}
          </label>
          <div className={styles.actions}>
            <button type="submit">
              {form.submit}
              <i />
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
