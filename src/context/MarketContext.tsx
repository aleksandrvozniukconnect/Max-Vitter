import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { markets, type MarketId } from '../content/site'

const STORAGE_KEY = 'design-choice-market'

type MarketContextValue = {
  marketId: MarketId
  setMarketId: (id: MarketId) => void
  market: (typeof markets)[MarketId]
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
      market: markets[marketId],
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
