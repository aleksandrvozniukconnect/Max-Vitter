import { describe, expect, it } from 'vitest'
import {
  HOME_PATH,
  isHomePath,
  isInternalHref,
  isProjectsPath,
  normalizePathname,
  PROJECTS_PATH,
  skipLogoIntro,
} from './routes'
import { withLang } from './navigate'
import { nav } from '../content/site'

describe('site routes', () => {
  it('exposes a first-class /projects path', () => {
    expect(PROJECTS_PATH).toBe('/projects')
    expect(HOME_PATH).toBe('/')
    expect(isProjectsPath('/projects')).toBe(true)
    expect(isProjectsPath('/projects/')).toBe(true)
    expect(isProjectsPath('/')).toBe(false)
    expect(isHomePath('/')).toBe(true)
    expect(isHomePath('/projects')).toBe(false)
    expect(normalizePathname('/projects/')).toBe('/projects')
  })

  it('keeps the Projects nav item on the dedicated route', () => {
    expect(nav.map((item) => item.href)).toEqual([
      '/#how',
      '/#capabilities',
      '/projects',
      '/#start',
    ])
    expect(nav.some((item) => item.key === 'projects' && item.href === PROJECTS_PATH)).toBe(true)
  })

  it('skips the Kettal logo intro on non-home routes', () => {
    expect(skipLogoIntro('/')).toBe(false)
    expect(skipLogoIntro('/projects')).toBe(true)
    expect(skipLogoIntro('/projects/')).toBe(true)
  })

  it('treats hash and site paths as internal', () => {
    expect(isInternalHref('/projects')).toBe(true)
    expect(isInternalHref('/#start')).toBe(true)
    expect(isInternalHref('#how')).toBe(true)
    expect(isInternalHref('mailto:ua@designchoice.work')).toBe(false)
  })

  it('keeps language on internal hrefs', () => {
    expect(withLang('/projects', 'uk')).toBe('/projects?lang=uk')
    expect(withLang('/#start', 'ru')).toBe('/?lang=ru#start')
    expect(withLang('#how', 'en')).toBe('/?lang=en#how')
  })
})
