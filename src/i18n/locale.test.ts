import { describe, expect, it } from 'vitest'
import { dictionaries } from './dictionaries'
import { en } from './en'
import {
  isLocaleId,
  localeFromSearch,
  localeIds,
  localeLabels,
  resolveLocale,
} from './locale'

function leafKeys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => leafKeys(item, `${prefix}[${index}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nested]) =>
      leafKeys(nested, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

describe('locale resolution', () => {
  it('defaults to English', () => {
    expect(resolveLocale({})).toBe('en')
    expect(resolveLocale({ stored: 'nope', search: '' })).toBe('en')
  })

  it('prefers ?lang= over a stored choice', () => {
    expect(resolveLocale({ search: '?lang=uk', stored: 'ru' })).toBe('uk')
    expect(resolveLocale({ search: 'lang=ru', stored: 'en' })).toBe('ru')
    expect(localeFromSearch('?lang=en')).toBe('en')
    expect(localeFromSearch('?lang=de')).toBeNull()
  })

  it('uses a stored EN / UK / RU preference when the query is absent', () => {
    expect(resolveLocale({ stored: 'uk' })).toBe('uk')
    expect(resolveLocale({ stored: 'ru' })).toBe('ru')
    expect(isLocaleId('uk')).toBe(true)
    expect(isLocaleId('UA')).toBe(false)
  })
})

describe('locale dictionaries', () => {
  it('covers EN, UK and RU with the same copy keys', () => {
    const enKeys = leafKeys(en).sort()
    expect([...localeIds]).toEqual(['en', 'uk', 'ru'])
    expect(localeLabels.en).toBe('EN')
    expect(localeLabels.uk).toBe('UK')
    expect(localeLabels.ru).toBe('RU')
    expect(leafKeys(dictionaries.uk).sort()).toEqual(enKeys)
    expect(leafKeys(dictionaries.ru).sort()).toEqual(enKeys)
  })

  it('does not leave empty strings in any locale', () => {
    const emptyPaths = (value: unknown, prefix = ''): string[] => {
      if (typeof value === 'string') return value.trim() ? [] : [prefix]
      if (Array.isArray(value)) {
        return value.flatMap((item, index) => emptyPaths(item, `${prefix}[${index}]`))
      }
      if (value && typeof value === 'object') {
        return Object.entries(value).flatMap(([key, nested]) =>
          emptyPaths(nested, prefix ? `${prefix}.${key}` : key),
        )
      }
      return []
    }

    for (const locale of localeIds) {
      expect(emptyPaths(dictionaries[locale])).toEqual([])
    }
  })

  it('keeps Design Choice as a brand token in every language', () => {
    for (const locale of localeIds) {
      expect(dictionaries[locale].footer.legal).toBe('Design Choice')
      expect(dictionaries[locale].hero.lede).toContain('Design Choice')
    }
  })

  it('ships Projects page chrome in EN, UK and RU', () => {
    expect(en.projectsPage.eyebrow).toBe('Dossier')
    expect(en.projects.seeAll).toBe('See all projects')
    for (const locale of localeIds) {
      const page = dictionaries[locale].projectsPage
      expect(page.title.length).toBeGreaterThan(8)
      expect(page.lede.length).toBeGreaterThan(20)
      expect(page.indexLabel.length).toBeGreaterThan(0)
      expect(page.cta.length).toBeGreaterThan(0)
      expect(page.empty.length).toBeGreaterThan(0)
    }
  })
})
