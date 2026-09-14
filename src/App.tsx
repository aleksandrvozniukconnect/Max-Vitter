import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowWeWork } from './components/HowWeWork'
import { Mosaic } from './components/Mosaic'
import { Journey } from './components/Journey'
import { ClosingCta } from './components/ClosingCta'
import { SendProject } from './components/SendProject'
import { Footer } from './components/Footer'
import { MarketProvider } from './context/MarketContext'

export default function App() {
  return (
    <MarketProvider>
      <Header />
      <main>
        <Hero />
        <HowWeWork />
        <Mosaic />
        <Journey />
        <ClosingCta />
        <SendProject />
      </main>
      <Footer />
    </MarketProvider>
  )
}
