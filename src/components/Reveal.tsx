import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  blurIn,
  fade,
  riseMasked,
  scaleIn,
  slide,
  stagger,
  STEP,
  VIEWPORT,
  type Direction,
} from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Scroll reveals — the single place viewport animation is defined.
 *
 * When motion is turned off these render as plain elements with no hidden
 * state and no observer: content is simply there. That is stronger than
 * animating instantly, because it removes any path where a reveal could fail
 * to fire and leave text stranded at zero opacity.
 */

type Tag = 'div' | 'section' | 'li' | 'span' | 'p' | 'figure' | 'header' | 'article' | 'aside'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: Tag
  /** Which way the content travels in from. Defaults to up. */
  direction?: Direction
  /** Overrides the shared duration for this one element. */
  duration?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  direction = 'up',
  duration,
}: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={slide(direction, duration)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

/**
 * Left- and right-hand content of a two-column block, converging on the
 * centre. Sugar over `<Reveal direction>` so call sites read as layout.
 */
export function SlideIn(props: Omit<RevealProps, 'direction'> & { from: 'left' | 'right' }) {
  const { from, ...rest } = props
  return <Reveal {...rest} direction={from} />
}

/** Opacity-only reveal, for large images and full-bleed panels. */
export function FadeIn({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

/** Settles in from slightly small — plates, photographs, feature cards. */
export function ScaleIn({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

/** Blur-to-clear. Short strings only — see the note in `lib/motion`. */
export function BlurIn({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={blurIn}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  /** Seconds between children. Defaults to the shared `STEP`. */
  each?: number
  delayChildren?: number
  as?: 'div' | 'ul' | 'ol' | 'dl' | 'section'
}

/** Wraps a list so its `StaggerItem` children arrive in sequence. */
export function Stagger({
  children,
  className,
  each = STEP,
  delayChildren = 0,
  as = 'div',
}: StaggerProps) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      variants={stagger(each, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  )
}

/** A single item inside a `Stagger`. Inherits the parent's timing. */
export function StaggerItem({
  children,
  className,
  as = 'div',
  direction = 'up',
  style,
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'tr' | 'span' | 'figure' | 'article'
  direction?: Direction
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Plain = as
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag className={className} style={style} variants={slide(direction)}>
      {children}
    </Tag>
  )
}

/**
 * Line-by-line heading reveal.
 *
 * Each line sits in its own overflow-hidden box and slides up from beneath
 * it, so the type appears to be uncovered rather than to fly in. Pass the
 * heading already broken into the lines you want.
 */
export function MaskedLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  each = 0.09,
}: {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  each?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <span className={className}>
        {lines.map((line) => (
          <span key={line} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </span>
    )
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(each, delay)}
    >
      {lines.map((line, i) => (
        <span key={i} className={`mask-line ${lineClassName}`}>
          <motion.span className="block" variants={riseMasked}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/**
 * Word-by-word reveal for a single sentence of lead copy.
 *
 * Words, not characters: a character-level reveal on a paragraph is a
 * legibility problem pretending to be a flourish. Whitespace is preserved by
 * rendering the space inside each word span.
 */
export function Words({
  text,
  className = '',
  each = 0.028,
  delay = 0,
}: {
  text: string
  className?: string
  each?: number
  delay?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) return <span className={className}>{text}</span>

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(each, delay)}
      aria-label={text}
    >
      {text.split(' ').map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: '0.42em' },
            show: { opacity: 1, y: '0em', transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}
          {i < text.split(' ').length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  )
}
