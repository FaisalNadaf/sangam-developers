import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

let lenis: Lenis | null = null

/** Scroll to an element or the top, going through Lenis when it is running. */
export function scrollTo(target: string | number, offset = 0) {
  if (lenis) {
    /*
      Re-measure before aiming.

      Lenis caches the scroll limit when it starts and on its own resize
      events, and a route change replaces the document underneath it without
      firing one. Anything past the stale limit is then clamped to it — which
      is every anchor on a long page landing on the same pixel, whether it
      sits at 4,000 or at 11,000.
    */
    lenis.resize()
    lenis.scrollTo(target, { offset, duration: 1.1 })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'auto' })
    return
  }
  document.querySelector(target)?.scrollIntoView({ block: 'start' })
}

/**
 * Momentum scrolling for the whole document.
 *
 * Disabled entirely when the user prefers reduced motion — smoothing is itself
 * motion, and native scrolling is the honest fallback.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      lenis?.destroy()
      lenis = null
      return
    }

    const instance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Native touch scrolling is better than any emulation on phones.
      syncTouch: false,
    })
    lenis = instance

    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [reduced])
}
