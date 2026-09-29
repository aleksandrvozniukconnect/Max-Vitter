import { describe, expect, it } from 'vitest'
import {
  audienceKeys,
  capabilityKeys,
  formProjectTypeValues,
  formTimingValues,
  gatesOf,
  marketFacts,
  marketIds,
  nav,
  photos,
  projectCases,
  projectKeys,
  stepKeys,
  steps,
} from './site'
import { dictionaries } from '../i18n/dictionaries'
import { en } from '../i18n/en'
import { localeIds, localeLabels } from '../i18n/locale'

describe('Design Choice content model', () => {
  it('exposes UA / US / ME with a person, phone and hours per market', () => {
    expect([...marketIds]).toEqual(['UA', 'US', 'ME'])
    for (const id of marketIds) {
      const facts = marketFacts[id]
      expect(facts.phone.length).toBeGreaterThan(0)
      expect(facts.hours).toMatch(/\d{2}:\d{2}/)
      for (const locale of localeIds) {
        const m = dictionaries[locale].markets[id]
        expect(m.person.length).toBeGreaterThan(0)
        expect(m.heroLine.length).toBeGreaterThan(20)
        expect(m.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps nav to the four owner pages, no Journey duplicate', () => {
    expect(nav.map((item) => item.href)).toEqual(['/#how', '/#capabilities', '/projects', '/#start'])
    for (const locale of localeIds) {
      const labels = nav.map((item) => dictionaries[locale].nav[item.key])
      expect(labels).not.toContain('Journey')
      expect(labels).toHaveLength(4)
      expect(dictionaries[locale].nav.projects.length).toBeGreaterThan(0)
    }
  })

  it('has six Foliot-order steps, each with a deliverable', () => {
    expect(steps).toHaveLength(6)
    expect(steps.map((step) => step.key)).toEqual([...stepKeys])
    for (const step of steps) {
      expect(step.n).toMatch(/^0[1-6]$/)
      for (const locale of localeIds) {
        const text = dictionaries[locale].steps[step.key]
        expect(text.deliverable.length).toBeGreaterThan(10)
        expect(text.title.length).toBeGreaterThan(0)
      }
    }
  })

  it('folds the three gates into steps 3, 4 and 5 in production order', () => {
    expect(gatesOf(steps)).toEqual(['production', 'qc', 'shipment'])
    expect(steps[2].gate).toBe('production')
    expect(steps[3].gate).toBe('qc')
    expect(steps[4].gate).toBe('shipment')
    expect(steps[0].gate).toBeUndefined()
    expect(steps[5].gate).toBeUndefined()
    expect(en.steps.confirm.gate).toBe('Approved for Production')
    expect(en.steps.manufacture.gate).toBe('QC Approved')
    expect(en.steps.deliver.gate).toBe('Approved for Shipment')
    expect(en.steps.consult.gate).toBeUndefined()
    expect(en.steps.support.gate).toBeUndefined()
    for (const locale of localeIds) {
      const copy = dictionaries[locale]
      expect(copy.steps.confirm.gate?.length).toBeGreaterThan(4)
      expect(copy.steps.manufacture.gate?.length).toBeGreaterThan(4)
      expect(copy.steps.deliver.gate?.length).toBeGreaterThan(4)
    }
  })

  it('does not list more than six stage titles anywhere on the home page', () => {
    for (const locale of localeIds) {
      const titles = stepKeys.map((key) => dictionaries[locale].steps[key].title)
      expect(new Set(titles).size).toBe(6)
    }
  })

  it('uses the brief headline in the hero in every language', () => {
    expect(en.hero.title).toBe('Complex intent. Precise result.')
    expect(dictionaries.uk.hero.title).toBe('Складний задум. Точний результат.')
    expect(dictionaries.ru.hero.title).toBe('Сложный замысел. Точный результат.')
  })

  it('keeps every pit-stop station to one short line', () => {
    for (const locale of localeIds) {
      for (const key of stepKeys) {
        const text = dictionaries[locale].steps[key]
        expect(text.body.length, `${locale}.${key}.body`).toBeLessThanOrEqual(110)
        expect(text.deliverable.length, `${locale}.${key}.deliverable`).toBeLessThanOrEqual(60)
      }
    }
  })

  it('does not ship internal notes or em dashes in public copy', () => {
    const values = (value: unknown): string[] =>
      typeof value === 'string'
        ? [value]
        : value && typeof value === 'object'
          ? Object.values(value).flatMap(values)
          : []
    for (const locale of localeIds) {
      const { meta: _meta, projectsPage, ...rest } = dictionaries[locale]
      const { meta: _pageMeta, ...page } = projectsPage
      const text = values({ ...rest, page }).join(' | ')
      expect(text, locale).not.toMatch(/placeholder|заглушк|stand-in|preview|предпросмотр|попередній перегляд/i)
      expect(text, locale).not.toContain('—')
    }
  })

  it('has four audiences, four capabilities and three projects with photos', () => {
    expect(audienceKeys).toHaveLength(4)
    expect(capabilityKeys).toHaveLength(4)
    expect(photos.capabilities).toHaveLength(4)
    expect(projectKeys).toHaveLength(3)
    expect(projectCases.map((item) => item.key)).toEqual([...projectKeys])
    expect(photos.projects).toHaveLength(3)
  })

  it('does not publish unverified numbers', () => {
    const text = JSON.stringify(dictionaries)
    expect(text).not.toMatch(/86\s?%/)
    expect(text).not.toMatch(/\d+\s?m²/)
  })

  it('keeps form option values stable across languages', () => {
    for (const locale of localeIds) {
      const form = dictionaries[locale].sendForm
      expect(form.projectTypes.map((item) => item.value)).toEqual([...formProjectTypeValues])
      expect(form.timings.map((item) => item.value)).toEqual([...formTimingValues])
    }
  })

  it('exposes an EN / UK / RU language switcher in header copy', () => {
    expect([...localeIds]).toEqual(['en', 'uk', 'ru'])
    expect(localeLabels).toEqual({ en: 'EN', uk: 'UK', ru: 'RU' })
    for (const locale of localeIds) {
      expect(dictionaries[locale].header.languageAria.length).toBeGreaterThan(0)
      expect(dictionaries[locale].header).not.toHaveProperty('marketOverlayAria')
    }
  })
})
