import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chaptersFrom, featuredChapters } from './projects'
import { projectPhotos } from './projectPhotos'
import { FEATURED_PROJECT_COUNT, featuredProjectKeys, projectCases, projectKeys } from './site'
import { dictionaries } from '../i18n/dictionaries'
import { en } from '../i18n/en'
import { localeIds } from '../i18n/locale'

describe('projects dossier content', () => {
  it('builds every case from the shared content model', () => {
    const chapters = chaptersFrom(en)
    expect(projectKeys.length).toBeGreaterThanOrEqual(FEATURED_PROJECT_COUNT)
    expect(projectCases.map((item) => item.key)).toEqual([...projectKeys])
    expect(chapters.map((item) => item.key)).toEqual([...projectKeys])
    expect(new Set(chapters.map((item) => item.n)).size).toBe(chapters.length)
    for (const chapter of chapters) {
      expect(chapter.n).toMatch(/^\d{2}$/)
      expect(chapter.photos.length).toBeGreaterThanOrEqual(3)
      expect(chapter.photo).toBe(chapter.photos[0].src)
      expect(chapter.title.length).toBeGreaterThan(0)
      expect(chapter.shortTitle.length).toBeGreaterThan(0)
      expect(chapter.challenge.length).toBeGreaterThan(20)
      expect(chapter.result.length).toBeGreaterThan(20)
      expect(chapter.tags).toHaveLength(3)
    }
  })

  it('features the first three cases on the home page', () => {
    const featured = featuredChapters(chaptersFrom(en))
    expect(featured).toHaveLength(FEATURED_PROJECT_COUNT)
    expect(featured.map((item) => item.key)).toEqual([...featuredProjectKeys])
    expect(featured.map((item) => item.key)).toEqual(projectKeys.slice(0, FEATURED_PROJECT_COUNT))
  })

  it('ships every photo as a web-sized file under public/images/projects', () => {
    for (const key of projectKeys) {
      for (const photo of projectPhotos[key]) {
        expect(photo.src.startsWith(`/images/projects/${key}/`), photo.src).toBe(true)
        expect(photo.src.endsWith('.webp'), photo.src).toBe(true)
        expect(Math.max(photo.width, photo.height), photo.src).toBeLessThanOrEqual(1600)
        // Home-page cases use sharp, large frames; the other cases come from phone shots
        // compressed by a messenger and stay at least 660 x 1180.
        const featured = (featuredProjectKeys as readonly string[]).includes(key)
        expect(Math.max(photo.width, photo.height), photo.src).toBeGreaterThanOrEqual(featured ? 1280 : 1180)
        expect(Math.min(photo.width, photo.height), photo.src).toBeGreaterThanOrEqual(featured ? 900 : 660)
        expect(existsSync(resolve('public', photo.src.slice(1))), photo.src).toBe(true)
      }
    }
  })

  it('names no city, client or brand in any language', () => {
    for (const locale of localeIds) {
      const text = JSON.stringify(dictionaries[locale].projects.items)
      expect(text, locale).not.toMatch(/misto|місто|мисто|kyiv|київ|киев|montenegro|чорногор|черногор|boka|бока/i)
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
        expect(item.title.length).toBeGreaterThan(0)
        expect(item.shortTitle.length).toBeGreaterThan(0)
        expect(item.sector.length).toBeGreaterThan(0)
        expect(item.challenge.length).toBeGreaterThan(20)
        expect(item.result.length).toBeGreaterThan(20)
        expect(item.tags).toHaveLength(3)
      }
    }
  })
})
