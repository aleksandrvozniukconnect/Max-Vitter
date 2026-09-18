import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useLocale } from '../context/LocaleContext'
import { navigate, withLang } from '../lib/navigate'
import { isInternalHref } from '../lib/routes'

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { href, onClick, children, ...props },
  ref,
) {
  const { locale } = useLocale()
  const resolved = isInternalHref(href) ? withLang(href, locale) : href

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (!isInternalHref(href)) return
    if (props.target === '_blank' || props.download) return
    if (isModifiedClick(event)) return
    event.preventDefault()
    navigate(resolved)
  }

  return (
    <a {...props} ref={ref} href={resolved} onClick={handleClick}>
      {children}
    </a>
  )
})
