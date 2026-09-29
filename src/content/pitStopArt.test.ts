import { inflateSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { dictionaries } from '../i18n/dictionaries'
import { localeIds, type LocaleId } from '../i18n/locale'
import { stepKeys, type StepKey } from './site'
import { pitStopCaption, stepArtFor } from './pitStopArt'

function latin1(bytes: Uint8Array): string {
  return new TextDecoder('latin1').decode(bytes)
}

function readPngItxt(bytes: Uint8Array, keyword: string): string | null {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let i = 0; i < signature.length; i += 1) {
    expect(bytes[i]).toBe(signature[i])
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 8
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset)
    const type = latin1(bytes.subarray(offset + 4, offset + 8))
    const data = bytes.subarray(offset + 8, offset + 8 + length)
    if (type === 'iTXt') {
      const keywordEnd = data.indexOf(0)
      const key = latin1(data.subarray(0, keywordEnd))
      if (key === keyword) {
        const compressed = data[keywordEnd + 1] === 1
        let cursor = keywordEnd + 3
        while (data[cursor] !== 0) cursor += 1
        cursor += 1
        while (data[cursor] !== 0) cursor += 1
        cursor += 1
        const text = data.subarray(cursor)
        const decoded = compressed ? inflateSync(text) : text
        return new TextDecoder().decode(decoded)
      }
    }
    if (type === 'IEND') break
    offset += 12 + length
  }
  return null
}

function artFile(locale: LocaleId, key: StepKey): Uint8Array {
  return readFileSync(resolve('public', stepArtFor(locale, key).slice(1)))
}

describe('pit-stop storyboard art', () => {
  it('points each station at a locale folder', () => {
    const paths = localeIds.flatMap((locale) => stepKeys.map((key) => stepArtFor(locale, key)))
    expect(new Set(paths).size).toBe(localeIds.length * stepKeys.length)
    for (const locale of localeIds) {
      for (const key of stepKeys) {
        expect(stepArtFor(locale, key)).toBe(`/images/pit-stop/${locale}/${key}.png`)
      }
    }
  })

  it('builds each banner from that locale’s stage title and body', () => {
    expect(pitStopCaption('en', 'consult')).toEqual({
      title: 'STAGE 1 • ANALYSIS',
      body: 'WE STUDY THE DRAWINGS, SPECIFICATIONS AND MEASUREMENTS, THEN ESTIMATE',
    })
    expect(pitStopCaption('uk', 'consult').title).toBe('ЕТАП 1 • АНАЛІЗ')
    expect(pitStopCaption('ru', 'manufacture').title).toBe('ЭТАП 4 • ПРОИЗВОДСТВО')
    expect(pitStopCaption('en', 'support').title).toBe('STAGE 6 • INSTALLATION')

    for (const locale of localeIds) {
      for (const [index, key] of stepKeys.entries()) {
        const caption = pitStopCaption(locale, key)
        const step = dictionaries[locale].steps[key]
        const lang = locale === 'en' ? 'en' : locale
        expect(caption.title).toContain(String(index + 1))
        expect(caption.title).toContain(step.title.toLocaleUpperCase(lang))
        expect(caption.body).toBe(step.body.replace(/\.+$/u, '').toLocaleUpperCase(lang))
        expect(caption.title).not.toContain('—')
        expect(caption.body).not.toContain('—')
      }
    }

    expect(pitStopCaption('en', 'consult').body).not.toBe(pitStopCaption('uk', 'consult').body)
    expect(pitStopCaption('uk', 'design').body).not.toBe(pitStopCaption('ru', 'design').body)
  })

  it('ships a PNG per locale whose caption matches the dictionary', () => {
    for (const locale of localeIds) {
      for (const key of stepKeys) {
        const bytes = artFile(locale, key)
        const caption = pitStopCaption(locale, key)
        expect(readPngItxt(bytes, 'pit-stop-caption')).toBe(`${caption.title}\n${caption.body}`)
      }
    }

    const en = Buffer.from(artFile('en', 'consult'))
    const uk = Buffer.from(artFile('uk', 'consult'))
    const ru = Buffer.from(artFile('ru', 'consult'))
    expect(en.equals(uk)).toBe(false)
    expect(en.equals(ru)).toBe(false)
    expect(uk.equals(ru)).toBe(false)
  })
})
