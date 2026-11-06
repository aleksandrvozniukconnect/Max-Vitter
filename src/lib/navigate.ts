import { NAVIGATE_EVENT, normalizePathname, stripLocalePrefix } from './routes'

export function withLang(href: string, lang: string | null | undefined): string {
  const url = new URL(href.startsWith('#') ? `/${href}` : href, 'https://designchoice.work')
  const path = stripLocalePrefix(url.pathname)
  const prefixed = lang ? `/${lang}${path === '/' ? '' : path}` : path
  return `${prefixed}${url.search}${url.hash}`
}

export function scrollToHash(hash: string) {
  if (!hash || hash === '#') return
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const node = document.getElementById(id)
  if (node) {
    node.scrollIntoView({ block: 'start' })
    return
  }
  document.querySelector(hash)?.scrollIntoView({ block: 'start' })
}

export function navigate(to: string) {
  const next = new URL(to, window.location.origin)
  const current = new URL(window.location.href)
  const nextHref = `${next.pathname}${next.search}${next.hash}`
  const samePath = normalizePathname(current.pathname) === normalizePathname(next.pathname)
  const sameHref =
    samePath && current.search === next.search && current.hash === next.hash

  if (!sameHref) {
    window.history.pushState({}, '', nextHref)
    window.dispatchEvent(new Event(NAVIGATE_EVENT))
  }

  if (next.hash) {
    requestAnimationFrame(() => scrollToHash(next.hash))
    window.setTimeout(() => scrollToHash(next.hash), 60)
    return
  }

  if (!samePath || !sameHref) window.scrollTo(0, 0)
}
