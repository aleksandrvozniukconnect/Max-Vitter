export const HOME_PATH = '/'
export const PROJECTS_PATH = '/projects'

export const NAVIGATE_EVENT = 'dc:navigate'

const LOCALE_PREFIX = /^\/(en|uk|ru)(?=\/|$)/

/** The language in a `/uk/...` style path, if there is one. */
export function localeFromPath(pathname: string): 'en' | 'uk' | 'ru' | null {
  const match = LOCALE_PREFIX.exec(pathname)
  return match ? (match[1] as 'en' | 'uk' | 'ru') : null
}

/** The path without its language prefix: `/uk/projects` becomes `/projects`. */
export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '') || HOME_PATH
}

export function normalizePathname(pathname: string): string {
  const path = stripLocalePrefix(pathname)
  if (!path || path === HOME_PATH) return HOME_PATH
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export function isHomePath(pathname: string): boolean {
  return normalizePathname(pathname) === HOME_PATH
}

export function isProjectsPath(pathname: string): boolean {
  return normalizePathname(pathname) === PROJECTS_PATH
}

/** Kettal oversized intro is home-only. */
export function skipLogoIntro(pathname: string): boolean {
  return !isHomePath(pathname)
}

export function isInternalHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#')
}
