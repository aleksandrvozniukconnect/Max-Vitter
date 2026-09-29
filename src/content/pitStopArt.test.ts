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

  it('leaves the floor crate blank and keeps the other deliver labels', () => {
    const files = [
      resolve('scripts/pit-stop-source/deliver.png'),
      ...localeIds.map((locale) => resolve('public', stepArtFor(locale, 'deliver').slice(1))),
    ]
    for (const file of files) {
      const { width, rgb } = readPngRgb(readFileSync(file))
      const at = (x: number, y: number) => {
        const index = (y * width + x) * 3
        return [rgb[index], rgb[index + 1], rgb[index + 2]] as const
      }
      const ink = (pixel: readonly [number, number, number]) =>
        pixel[0] < 40 && pixel[1] < 30 && pixel[2] < 25

      // Side face of the ROOM-1 floor crate. The EXPORT/AXPORT stencil is gone.
      let floorInk = 0
      for (let y = 704; y < 745; y += 1) {
        for (let x = 798; x < 856; x += 1) {
          if (ink(at(x, y))) floorInk += 1
        }
      }
      expect(floorInk).toBe(0)
      // Large crate still reads EXPORT, and the small ROOF mark is untouched.
      expect(ink(at(880, 572))).toBe(false)
      expect(ink(at(875, 580))).toBe(true)
      expect(ink(at(46, 412))).toBe(true)
    }
  })
})

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft
  const leftDelta = Math.abs(estimate - left)
  const upDelta = Math.abs(estimate - up)
  const upLeftDelta = Math.abs(estimate - upLeft)
  if (leftDelta <= upDelta && leftDelta <= upLeftDelta) return left
  if (upDelta <= upLeftDelta) return up
  return upLeft
}

function readPngRgb(bytes: Uint8Array): { width: number; height: number; rgb: Uint8Array } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 8
  let width = 0
  let height = 0
  const idat: Uint8Array[] = []
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset)
    const type = latin1(bytes.subarray(offset + 4, offset + 8))
    const data = bytes.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = view.getUint32(offset + 8)
      height = view.getUint32(offset + 12)
      if (data[8] !== 8 || data[9] !== 2 || data[12] !== 0) {
        throw new Error(`unsupported png bit=${data[8]} color=${data[9]} interlace=${data[12]}`)
      }
    } else if (type === 'IDAT') {
      idat.push(data)
    } else if (type === 'IEND') {
      break
    }
    offset += 12 + length
  }
  const compressed = new Uint8Array(idat.reduce((sum, chunk) => sum + chunk.length, 0))
  let cursor = 0
  for (const chunk of idat) {
    compressed.set(chunk, cursor)
    cursor += chunk.length
  }
  const raw = inflateSync(compressed)
  const stride = width * 3
  const rgb = new Uint8Array(height * stride)
  let src = 0
  for (let y = 0; y < height; y += 1) {
    const filter = raw[src]
    src += 1
    const row = y * stride
    for (let x = 0; x < stride; x += 1) {
      const value = raw[src]
      src += 1
      const left = x >= 3 ? rgb[row + x - 3] : 0
      const up = y > 0 ? rgb[row - stride + x] : 0
      const upLeft = y > 0 && x >= 3 ? rgb[row - stride + x - 3] : 0
      if (filter === 0) rgb[row + x] = value
      else if (filter === 1) rgb[row + x] = (value + left) & 255
      else if (filter === 2) rgb[row + x] = (value + up) & 255
      else if (filter === 3) rgb[row + x] = (value + Math.floor((left + up) / 2)) & 255
      else if (filter === 4) rgb[row + x] = (value + paeth(left, up, upLeft)) & 255
      else throw new Error(`png filter ${filter}`)
    }
  }
  return { width, height, rgb }
}
