export const localeIds = ['en', 'uk', 'ru'] as const
export type LocaleId = (typeof localeIds)[number]

export const localeLabels: Record<LocaleId, string> = {
  en: 'EN',
  uk: 'UK',
  ru: 'RU',
}

export const localeHtmlLang: Record<LocaleId, string> = {
  en: 'en',
  uk: 'uk',
  ru: 'ru',
}

export const STORAGE_KEY = 'design-choice-lang'
export const QUERY_KEY = 'lang'

export function isLocaleId(value: string | null | undefined): value is LocaleId {
  return value === 'en' || value === 'uk' || value === 'ru'
}

export function localeFromSearch(search: string): LocaleId | null {
  const trimmed = search.startsWith('?') ? search.slice(1) : search
  const raw = new URLSearchParams(trimmed).get(QUERY_KEY)
  return isLocaleId(raw) ? raw : null
}

export function resolveLocale(input: { search?: string; stored?: string | null } = {}): LocaleId {
  const fromQuery = localeFromSearch(input.search ?? '')
  if (fromQuery) return fromQuery
  if (isLocaleId(input.stored)) return input.stored
  return 'en'
}

export function resolveBrowserLocale(): LocaleId {
  if (typeof window === 'undefined') return 'en'
  return resolveLocale({
    search: window.location.search,
    stored: window.localStorage.getItem(STORAGE_KEY),
  })
}

export function persistLocale(id: LocaleId) {
  window.localStorage.setItem(STORAGE_KEY, id)
  const url = new URL(window.location.href)
  url.searchParams.set(QUERY_KEY, id)
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

export function applyDocumentLocale(
  id: LocaleId,
  meta: { title: string; description: string },
) {
  document.documentElement.lang = localeHtmlLang[id]
  document.title = meta.title
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', meta.description)
}
