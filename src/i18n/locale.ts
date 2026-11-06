import { localeFromPath, stripLocalePrefix } from '../lib/routes'

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

/** `/projects` in a language: `/uk/projects`; the home page is just `/uk`. */
export function localizedPath(pathname: string, id: LocaleId): string {
  const path = stripLocalePrefix(pathname)
  return `/${id}${path === '/' ? '' : path}`
}

export const SITE_URL = 'https://designchoice.work'

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

export function resolveLocale(
  input: { pathname?: string; search?: string; stored?: string | null } = {},
): LocaleId {
  const fromPath = localeFromPath(input.pathname ?? '')
  if (fromPath) return fromPath
  const fromQuery = localeFromSearch(input.search ?? '')
  if (fromQuery) return fromQuery
  if (isLocaleId(input.stored)) return input.stored
  return 'en'
}

export function resolveBrowserLocale(): LocaleId {
  if (typeof window === 'undefined') return 'en'
  return resolveLocale({
    pathname: window.location.pathname,
    search: window.location.search,
    stored: window.localStorage.getItem(STORAGE_KEY),
  })
}

export function persistLocale(id: LocaleId) {
  window.localStorage.setItem(STORAGE_KEY, id)
  const { pathname, search, hash } = window.location
  const params = new URLSearchParams(search)
  params.delete(QUERY_KEY)
  const rest = params.toString() ? `?${params.toString()}` : ''
  window.history.replaceState({}, '', `${localizedPath(pathname, id)}${rest}${hash}`)
}

export function applyDocumentLocale(
  id: LocaleId,
  meta: { title: string; description: string },
) {
  document.documentElement.lang = localeHtmlLang[id]
  const canonical = document.querySelector('link[rel="canonical"]')
  const here = `${SITE_URL}${localizedPath(window.location.pathname, id)}`
  if (canonical) canonical.setAttribute('href', here)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', here)
  document.title = meta.title
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', meta.description)

  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', meta.title)
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', meta.description)
  const twTitle = document.querySelector('meta[name="twitter:title"]')
  if (twTitle) twTitle.setAttribute('content', meta.title)
  const twDesc = document.querySelector('meta[name="twitter:description"]')
  if (twDesc) twDesc.setAttribute('content', meta.description)
}
