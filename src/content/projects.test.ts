import { describe, expect, it } from 'vitest'
import { chaptersFrom } from './projects'
import { photos, projectCases, projectKeys } from './site'
import { dictionaries } from '../i18n/dictionaries'
import { en } from '../i18n/en'
import { localeIds } from '../i18n/locale'

describe('projects dossier content', () => {
  it('renders at least three cases from the shared content model', () => {
    const chapters = chaptersFrom(en)
    expect(projectKeys).toHaveLength(3)
    expect(projectCases).toHaveLength(3)
    expect(photos.projects).toHaveLength(3)
    expect(chapters.length).toBeGreaterThanOrEqual(3)
    expect(chapters.map((item) => item.key)).toEqual([...projectKeys])
    for (const chapter of chapters) {
      expect(chapter.n).toMatch(/^0[1-3]$/)
      expect(chapter.photo.startsWith('/images/')).toBe(true)
      expect(chapter.title.length).toBeGreaterThan(0)
      expect(chapter.shortTitle.length).toBeGreaterThan(0)
      expect(chapter.tags).toHaveLength(3)
      expect(chapter.placeholder.length).toBeGreaterThan(8)
      expect(chapter.marketLabel.length).toBeGreaterThan(0)
    }
  })

  it('keeps EN / UK / RU chrome for the Projects page', () => {
    const keys = [
      'eyebrow',
      'title',
      'lede',
      'indexLabel',
      'indexAria',
      'next',
      'empty',
      'ctaTitle',
      'cta',
    ] as const

    for (const locale of localeIds) {
      const page = dictionaries[locale].projectsPage
      const teaser = dictionaries[locale].projects
      expect(page.meta.title.length).toBeGreaterThan(8)
      expect(page.meta.description.length).toBeGreaterThan(20)
      for (const key of keys) {
        expect(page[key].trim().length).toBeGreaterThan(0)
      }
      expect(teaser.seeAll.length).toBeGreaterThan(0)
      for (const projectKey of projectKeys) {
        const item = teaser.items[projectKey]
        expect(item.shortTitle.length).toBeGreaterThan(0)
        expect(item.tags).toHaveLength(3)
        expect(item.placeholder.length).toBeGreaterThan(8)
      }
    }
  })
})
