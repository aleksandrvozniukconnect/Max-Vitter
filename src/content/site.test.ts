import { describe, expect, it } from 'vitest'
import {
  audiences,
  capabilities,
  gatesOf,
  hero,
  marketIds,
  markets,
  nav,
  photos,
  projects,
  steps,
} from './site'

describe('Design Choice content model', () => {
  it('exposes UA / US / ME with a person, phone and hours per market', () => {
    expect([...marketIds]).toEqual(['UA', 'US', 'ME'])
    for (const id of marketIds) {
      const m = markets[id]
      expect(m.person.length).toBeGreaterThan(0)
      expect(m.phone.length).toBeGreaterThan(0)
      expect(m.hours).toMatch(/\d{2}:\d{2}/)
      expect(m.heroLine.length).toBeGreaterThan(20)
    }
  })

  it('keeps nav to the four owner pages, no Journey duplicate', () => {
    expect(nav.map((item) => item.href)).toEqual(['#how', '#capabilities', '#projects', '#start'])
    expect(nav.map((item) => item.label)).not.toContain('Journey')
  })

  it('has six Foliot-order steps, each with a deliverable', () => {
    expect(steps).toHaveLength(6)
    expect(steps.map((step) => step.key)).toEqual([
      'consult',
      'design',
      'confirm',
      'manufacture',
      'deliver',
      'support',
    ])
    for (const step of steps) {
      expect(step.deliverable.length).toBeGreaterThan(10)
      expect(step.n).toMatch(/^0[1-6]$/)
    }
  })

  it('folds the three gates into steps 3, 4 and 5 in production order', () => {
    expect(gatesOf(steps)).toEqual(['Approved for Production', 'QC Approved', 'Approved for Shipment'])
    expect(steps[2].gate).toBe('Approved for Production')
    expect(steps[3].gate).toBe('QC Approved')
    expect(steps[4].gate).toBe('Approved for Shipment')
    expect(steps[0].gate).toBeUndefined()
    expect(steps[5].gate).toBeUndefined()
  })

  it('does not list more than six stage titles anywhere on the home page', () => {
    const titles = steps.map((step) => step.title)
    expect(new Set(titles).size).toBe(6)
  })

  it('states positioning once in the hero, not in section ledes', () => {
    expect(hero.title).toBe('One partner. Every stage. One accountable result.')
    expect(audiences.title).not.toContain('One partner')
  })

  it('has four audiences, four capabilities and three projects with photos', () => {
    expect(audiences.items).toHaveLength(4)
    expect(capabilities.items).toHaveLength(4)
    expect(photos.capabilities).toHaveLength(4)
    expect(projects.items).toHaveLength(3)
    expect(photos.projects).toHaveLength(3)
  })

  it('does not publish unverified numbers', () => {
    const text = JSON.stringify({ hero, audiences, capabilities, projects, steps })
    expect(text).not.toMatch(/86\s?%/)
    expect(text).not.toMatch(/\d+\s?m²/)
  })
})
