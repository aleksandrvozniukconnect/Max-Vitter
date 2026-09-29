import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const localeMod = await server.ssrLoadModule('/src/i18n/locale.ts')
const siteMod = await server.ssrLoadModule('/src/content/site.ts')
const artMod = await server.ssrLoadModule('/src/content/pitStopArt.ts')

const captions = {}
for (const locale of localeMod.localeIds) {
  captions[locale] = {}
  for (const key of siteMod.stepKeys) {
    captions[locale][key] = artMod.pitStopCaption(locale, key)
  }
}

await server.close()

const jsonPath = '/tmp/pit-stop-captions.json'
writeFileSync(jsonPath, JSON.stringify(captions, null, 2))

const script = new URL('./localize-pit-stop.py', import.meta.url)
const child = spawn('python3', [script.pathname, jsonPath], { stdio: 'inherit' })
child.on('exit', (code) => {
  process.exit(code ?? 1)
})
