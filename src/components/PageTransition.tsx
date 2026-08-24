import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { EASE_OUT } from '@/lib/motion'
import { scrollTo } from '@/hooks/useSmoothScroll'

/**
 * Route change.
 *
 * A short fade-and-lift on the incoming page, plus a jump to the top. Anything
 * heavier — a full-screen wipe on every click — costs more than it gives once
 * someone is three pages in.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollTo(0)
      return
    }

    /*
      Wait for the page to stop growing, then scroll once.

      A fixed delay is not enough on a long page: when it fires, the sections
      below still have no boxes and the anchor sits far above where it will
      end up, so the jump lands short. Chasing the anchor instead is worse —
      every reveal on the page is a transform, so its measured top moves on
      every frame of every animation, and re-issuing a 1.1 s tween that often
      means it creeps a few pixels and never arrives.

      Document height is the honest signal. Transforms do not change it, and
      images reserve their boxes from the media registry, so once it holds
      still the layout is final and one scroll is enough. Capped, so a page
      that never settles still goes.
    */
    let frame = 0
    let held = 0
    let lastHeight = -1
    const deadline = performance.now() + 1500

    const settle = () => {
      const height = document.documentElement.scrollHeight
      if (height === lastHeight) held += 1
      else {
        held = 0
        lastHeight = height
      }

      if (held >= 6 || performance.now() > deadline) {
        scrollTo(hash, -90)
        return
      }
      frame = requestAnimationFrame(settle)
    }

    frame = requestAnimationFrame(settle)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {children}
    </motion.main>
  )
}
