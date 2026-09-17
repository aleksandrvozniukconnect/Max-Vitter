import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Audiences } from './components/Audiences'
import { HowWeWork } from './components/HowWeWork'
import { Plant } from './components/Plant'
import { Capabilities } from './components/Capabilities'
import { Projects } from './components/Projects'
import { OnTheGround } from './components/OnTheGround'
import { ClosingCta } from './components/ClosingCta'
import { SendProject } from './components/SendProject'
import { Footer } from './components/Footer'
import { LocaleProvider } from './context/LocaleContext'

export default function App() {
  return (
    <LocaleProvider>
      <Header />
      <main>
        <Hero />
        <Audiences />
        <HowWeWork />
        <Plant />
        <Capabilities />
        <Projects />
        <OnTheGround />
        <ClosingCta />
        <SendProject />
      </main>
      <Footer />
    </LocaleProvider>
  )
}
