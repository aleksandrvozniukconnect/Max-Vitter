import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type SiteCopy } from '../i18n/dictionaries'
import {
  persistLocale,
  resolveBrowserLocale,
  applyDocumentLocale,
  localeFromSearch,
  STORAGE_KEY,
  type LocaleId,
} from '../i18n/locale'

type LocaleContextValue = {
  locale: LocaleId
  setLocale: (id: LocaleId) => void
  copy: SiteCopy
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleId>(resolveBrowserLocale)

  useEffect(() => {
    const copy = dictionaries[locale]
    applyDocumentLocale(locale, copy.meta)
    if (localeFromSearch(window.location.search)) {
      window.localStorage.setItem(STORAGE_KEY, locale)
    }
  }, [locale])

  const setLocale = useCallback((id: LocaleId) => {
    setLocaleState(id)
    persistLocale(id)
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      copy: dictionaries[locale],
    }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
