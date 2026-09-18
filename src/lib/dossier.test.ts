import { describe, expect, it } from 'vitest'
import { nextItem, pickActiveCase } from './dossier'

describe('dossier index', () => {
  it('highlights the case with the largest visible ratio', () => {
    expect(
      pickActiveCase(['hospitality', 'residential', 'villa'], { residential: 0.6, villa: 0.2 }, 'hospitality'),
    ).toBe('residential')
  })

  it('falls back when nothing is intersecting yet', () => {
    expect(pickActiveCase(['hospitality', 'residential', 'villa'], {}, 'hospitality')).toBe('hospitality')
  })

  it('peeks the next case without wrapping', () => {
    const cases = ['a', 'b', 'c']
    expect(nextItem(cases, 0)).toBe('b')
    expect(nextItem(cases, 1)).toBe('c')
    expect(nextItem(cases, 2)).toBeNull()
  })
})
