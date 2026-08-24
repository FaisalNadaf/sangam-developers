import type { Transition, Variants } from 'framer-motion'

/**
 * One motion language for the whole site.
 *
 * Four gestures, and everything on the page is expressed with one of them:
 *
 *   • rise    — content arrives from below (headings, cards, list rows)
 *   • slide   — content arrives from the side it belongs to, so a two-column
 *               block converges on its own centre rather than all drifting up
 *   • scale   — plates and images settle in from slightly small
 *   • draw    — a rule extends left to right (section openers, the span rule)
 *
 * Distances are deliberately large enough to be seen. A 6 px nudge over
 * 300 ms is invisible on a laptop and reads as a rendering glitch on a phone;
 * these travel 44–72 px over 0.6–0.8 s, which registers as an arrival without
 * ever becoming the thing the reader is watching.
 *
 * The easing is quintic rather than exponential. Expo is 90% done in the
 * first third of its duration, which is why an expo reveal at any sensible
 * length still reads as a jump; quint keeps enough of the travel in the
 * visible part of the curve to be seen as movement, and still lands soft.
 */

export const EASE_OUT: Transition['ease'] = [0.22, 1, 0.36, 1]
/** The old exponential curve, kept for the two places that want a snap. */
export const EASE_EXPO: Transition['ease'] = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT: Transition['ease'] = [0.76, 0, 0.24, 1]
export const EASE_SPRING: Transition['ease'] = [0.34, 1.4, 0.5, 1]

export const DUR = {
  fast: 0.4,
  base: 0.62,
  slow: 0.78,
  reveal: 0.9,
} as const

/** One stagger step, shared by every list on the site. */
export const STEP = 0.1

/**
 * Viewport trigger shared by every scroll reveal, so sections fire alike.
 *
 * `amount: 'some'` rather than a fraction, because a fraction is a trap here:
 * a stagger container wrapping the whole projects gallery is ~9000 px tall,
 * and 15% of that is 1350 px — more than a 900 px viewport can ever show, so
 * the threshold is never met and every card in it stays at zero opacity.
 * Any-pixel plus a bottom margin fires reliably at every element size.
 */
export const VIEWPORT = { once: true, amount: 'some', margin: '0px 0px -15% 0px' } as const

/** Same trigger for things that must fire the moment an edge appears. */
export const VIEWPORT_EARLY = { once: true, amount: 0.02, margin: '0px 0px -2% 0px' } as const

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 46 },
  down: { x: 0, y: -46 },
  left: { x: -72, y: 0 },
  right: { x: 72, y: 0 },
  none: { x: 0, y: 0 },
}

/** Builds a directional reveal variant. Used by every `<Reveal>` on the site. */
export const slide = (direction: Direction = 'up', duration: number = DUR.base): Variants => {
  const { x, y } = OFFSET[direction]
  return {
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE_OUT },
    },
  }
}

export const rise: Variants = slide('up')

/** Heading lines, uncovered from behind their own mask. */
export const riseMasked: Variants = {
  hidden: { y: '112%' },
  show: {
    y: '0%',
    transition: { duration: DUR.reveal, ease: EASE_OUT },
  },
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_OUT } },
}

/** Plates, photographs and any surface that should settle rather than travel. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.955, y: 34 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
}

/**
 * Blur-to-clear. Reserved for short strings — eyebrows, figures, single
 * words — because animating `filter` on a large surface costs a repaint per
 * frame and the effect is not worth that on a full card.
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 22 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
}

/** Stagger container. `delayChildren` lets a heading land before its list. */
export const stagger = (each = STEP, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: each, delayChildren },
  },
})
