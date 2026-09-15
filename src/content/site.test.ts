import { describe, expect, it } from 'vitest'
import {
  chaptersOf,
  gatesOf,
  howWeWorkSteps,
  journey,
  marketIds,
  markets,
  mosaic,
  nav,
} from './site'

describe('Design Choice content model', () => {
  it('exposes UA / US / ME market overlay', () => {
    expect([...marketIds]).toEqual(['UA', 'US', 'ME'])
    expect(markets.UA.desk).toMatch(/production/i)
    expect(markets.US.desk).toMatch(/US/i)
    expect(markets.ME.desk).toMatch(/Adriatic/i)
  })

  it('keeps nav to How we work, Journey, Send project', () => {
    expect(nav.map((item) => item.href)).toEqual(['#how', '#journey', '#start'])
  })

  it('has six How We Work steps in Foliot order', () => {
    expect(howWeWorkSteps).toHaveLength(6)
    expect(howWeWorkSteps.map((step) => step.key)).toEqual([
      'consult',
      'design',
      'confirm',
      'manufacture',
      'deliver',
      'support',
    ])
  })

  it('has seven journey chapters and three gates in production order', () => {
    const chapters = chaptersOf(journey)
    const gates = gatesOf(journey)
    expect(chapters).toHaveLength(7)
    expect(chapters.map((chapter) => chapter.title)).toEqual([
      'Understand',
      'Define',
      'Make',
      'Verify',
      'Deliver',
      'Complete',
      'Improve',
    ])
    expect(gates).toHaveLength(3)
    expect(gates.map((gate) => gate.stamp)).toEqual([
      'Approved for Production',
      'QC Approved',
      'Approved for Shipment',
    ])
    expect(journey.map((item) => (item.kind === 'chapter' ? item.title : item.stamp))).toEqual([
      'Understand',
      'Define',
      'Approved for Production',
      'Make',
      'Verify',
      'QC Approved',
      'Deliver',
      'Approved for Shipment',
      'Complete',
      'Improve',
    ])
  })

  it('keeps the Kettal mosaic phrases and quiet capabilities', () => {
    expect(mosaic.title).toBe('Material. Geometry. Sequence.')
    expect(mosaic.subtitle).toBe('From first line to final detail.')
    expect(mosaic.capabilities.length).toBeGreaterThanOrEqual(6)
    expect(mosaic.projects).toHaveLength(2)
  })
})
