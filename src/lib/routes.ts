export const HOME_PATH = '/'
export const PROJECTS_PATH = '/projects'

export const NAVIGATE_EVENT = 'dc:navigate'

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === HOME_PATH) return HOME_PATH
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
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
