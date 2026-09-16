import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { marketFacts, type MarketFacts, type MarketId } from '../content/site'
import { useLocale } from './LocaleContext'

const STORAGE_KEY = 'design-choice-market'

export type MarketView = MarketFacts & {
  label: string
  city: string
  role: string
  person: string
  heroLine: string
}

type MarketContextValue = {
  marketId: MarketId
  setMarketId: (id: MarketId) => void
  facts: MarketFacts
}

const MarketContext = createContext<MarketContextValue | null>(null)

function readStoredMarket(): MarketId {
  if (typeof window === 'undefined') return 'UA'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'UA' || stored === 'US' || stored === 'ME') return stored
  return 'UA'
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const [marketId, setMarketIdState] = useState<MarketId>(readStoredMarket)

  const setMarketId = useCallback((id: MarketId) => {
    setMarketIdState(id)
    window.localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const value = useMemo(
    () => ({
      marketId,
      setMarketId,
      facts: marketFacts[marketId],
    }),
    [marketId, setMarketId],
  )

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
}

export function useMarket() {
  const ctx = useContext(MarketContext)
  if (!ctx) throw new Error('useMarket must be used within MarketProvider')
  return ctx
}

export function useMarketView(): {
  marketId: MarketId
  setMarketId: (id: MarketId) => void
  market: MarketView
} {
  const { marketId, setMarketId, facts } = useMarket()
  const { copy } = useLocale()
  return {
    marketId,
    setMarketId,
    market: { ...facts, ...copy.markets[marketId] },
  }
}
