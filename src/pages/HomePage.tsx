import { useLayoutEffect } from 'react'
import { scrollToHash } from '../lib/navigate'
import { Hero } from '../components/Hero'
import { Audiences } from '../components/Audiences'
import { HowWeWork } from '../components/HowWeWork'
import { Plant } from '../components/Plant'
import { Capabilities } from '../components/Capabilities'
import { Projects } from '../components/Projects'
import { OnTheGround } from '../components/OnTheGround'
import { ClosingCta } from '../components/ClosingCta'
import { SendProject } from '../components/SendProject'

export function HomePage() {
  useLayoutEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash)
  }, [])

  return (
    <>
      <Hero />
      <Audiences />
      <HowWeWork />
      <Plant />
      <Capabilities />
      <Projects />
      <OnTheGround />
      <ClosingCta />
      <SendProject />
    </>
  )
}
