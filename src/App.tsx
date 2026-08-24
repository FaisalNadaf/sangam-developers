import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Preloader } from '@/components/Preloader'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import Home from '@/pages/Home'

// The home page ships in the main bundle; everything else is split so the
// first paint carries only what the landing view needs.
const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const Clientele = lazy(() => import('@/pages/Clientele'))
const Contact = lazy(() => import('@/pages/Contact'))
const Developers = lazy(() => import('@/pages/Developers'))
const Renewables = lazy(() => import('@/pages/Renewables'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Holds the layout height while a split chunk arrives, so nothing jumps. */
function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />
}

export default function App() {
  const location = useLocation()
  useSmoothScroll()

  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <Navbar />

      <AnimatePresence mode="wait">
        <Suspense key={location.pathname} fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clientele />} />
            <Route path="/contact" element={<Contact />} />

            {/* Both companies sit in the primary nav, and carry the detailed
                scope, delivery sequence and per-company register. */}
            <Route path="/developers" element={<Developers />} />
            <Route path="/renewables" element={<Renewables />} />

            {/* Earlier paths, kept so existing links do not 404. The team and
                certificate pages are sections of /about now, so they land on
                the anchor rather than at the top of it. None of these aliases
                is in the sitemap. */}
            <Route path="/team" element={<Navigate to="/about#team" replace />} />
            <Route path="/certificates" element={<Navigate to="/about#certificates" replace />} />
            <Route path="/certifications" element={<Navigate to="/about#certificates" replace />} />
            <Route path="/clientele" element={<Navigate to="/clients" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      <Footer />
    </MotionConfig>
  )
}
