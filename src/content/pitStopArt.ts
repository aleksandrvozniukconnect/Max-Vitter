import { dictionaries } from '../i18n/dictionaries'
import type { LocaleId } from '../i18n/locale'
import { stepKeys, type StepKey } from './site'

const stageWord: Record<LocaleId, string> = {
  en: 'Stage',
  uk: 'Етап',
  ru: 'Этап',
}

export type PitStopCaption = {
  title: string
  body: string
}

export function stepArtFor(locale: LocaleId, key: StepKey): string {
  return `/images/pit-stop/${locale}/${key}.webp`
}

export function stepArtSrcSet(locale: LocaleId, key: StepKey): string {
  const base = `/images/pit-stop/${locale}/${key}`
  return `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}.webp 1152w`
}

function captionLang(locale: LocaleId): string {
  if (locale === 'uk') return 'uk'
  if (locale === 'ru') return 'ru'
  return 'en'
}

/** Stage line plus the step body, both taken from the locale dictionary. */
export function pitStopCaption(locale: LocaleId, key: StepKey): PitStopCaption {
  const step = dictionaries[locale].steps[key]
  const index = stepKeys.indexOf(key) + 1
  const upper = (value: string) => value.toLocaleUpperCase(captionLang(locale))
  return {
    title: upper(`${stageWord[locale]} ${index} • ${step.title}`),
    body: upper(step.body.replace(/\.+$/u, '')),
  }
}
