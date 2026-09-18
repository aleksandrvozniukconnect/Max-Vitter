import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LocaleProvider } from './context/LocaleContext'
import { usePathname } from './hooks/usePathname'
import { isProjectsPath } from './lib/routes'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'

function Shell() {
  const pathname = usePathname()
  const projects = isProjectsPath(pathname)

  return (
    <>
      <Header />
      <main>{projects ? <ProjectsPage /> : <HomePage />}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  )
}
