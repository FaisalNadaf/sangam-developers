import type { Transition, TargetAndTransition } from 'framer-motion'
import { VIEWPORT } from '@/lib/motion'
import { useReducedMotion } from './useReducedMotion'

/**
 * Props for a one-off scroll reveal, for the places a `<Reveal>` wrapper would
 * add a pointless extra element — table rows, list items, grid children.
 *
 * When motion is off it returns nothing at all: no hidden initial state, no
 * observer. Content is simply present. That removes every path where a reveal
 * could fail to fire and strand text at zero opacity, which matters most for
 * exactly the people who asked for less motion.
 */
export function useReveal(
  from: TargetAndTransition = { opacity: 0, y: 20 },
  transition: Transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
) {
  const reduced = useReducedMotion()
  if (reduced) return {}
  return {
    initial: from,
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, filter: 'blur(0px)' },
    viewport: VIEWPORT,
    transition,
  } as const
}

/**
 * Same idea for a rule that draws itself. Under reduced motion the rule is
 * already at full width rather than animating to it.
 */
export function useDraw(transition: Transition = { duration: 1, ease: [0.76, 0, 0.24, 1] }) {
  const reduced = useReducedMotion()
  if (reduced) return {}
  return {
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: VIEWPORT,
    transition,
  } as const
}
