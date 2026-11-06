// After `vite build`: write one HTML shell per language and page
// (/en, /uk, /ru and their /projects) with the right <html lang>, title,
// description, canonical, hreflang and Open Graph tags, so crawlers and link
// previews see the correct language without running JavaScript.
import { rolldown } from 'rolldown'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://designchoice.work'
const locales = ['en', 'uk', 'ru']

const bundle = await rolldown({ input: join(root, 'src/i18n/dictionaries.ts'), logLevel: 'silent' })
const { output } = await bundle.generate({ format: 'esm' })
const code = output[0].code
const { dictionaries } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)

const base = await readFile(join(dist, 'index.html'), 'utf8')
const esc = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const url = (locale, page) => `${SITE}/${locale}${page}`

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: tag not found ${pattern}`)
  return html.replace(pattern, replacement)
}

for (const locale of locales) {
  for (const page of ['', '/projects']) {
    const { title, description } = dictionaries[locale].meta
    const here = url(locale, page)
    let html = base
    html = setTag(html, /<html lang="[^"]*"/, `<html lang="${locale}"`)
    html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    html = setTag(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`)
    html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    html = setTag(html, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`)
    html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    html = setTag(html, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`)
    html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${here}$2`)
    html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${here}$2`)
    const alternates = locales
      .map((l) => `    <link rel="alternate" hreflang="${l}" href="${url(l, page)}" />`)
      .concat(`    <link rel="alternate" hreflang="x-default" href="${SITE}${page || '/'}" />`)
      .join('\n')
    html = setTag(html, /(<!-- hreflang -->\n)[\s\S]*?(\n    <!-- JSON-LD -->)/, `$1${alternates}$2`)
    const out = join(dist, locale, page)
    await mkdir(out, { recursive: true })
    await writeFile(join(out, 'index.html'), html)
  }
}
console.log('prerender-meta: wrote', locales.length * 2, 'pages')
