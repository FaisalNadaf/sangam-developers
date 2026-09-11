import { motion } from 'framer-motion'
import { EASE_IN_OUT, EASE_OUT, VIEWPORT } from '@/lib/motion'

/**
 * The span rule — this site's signature.
 *
 * Sangam Ventures' work is linear: kilometres of 33 kV line, right-of-way
 * corridors, internal roads, land parcels strung across a landscape. A
 * transmission line profile is drawn on a survey sheet as a horizontal datum
 * with a tick at every structure. That is exactly what this is: the rule
 * extends left to right, then the structures land on it in sequence, the way
 * a span is actually built.
 */
export function SpanRule({
  ticks = 7,
  accent = 'var(--color-brand)',
  className = '',
  label,
}: {
  ticks?: number
  accent?: string
  className?: string
  /** Optional reading printed at the right-hand end of the datum. */
  label?: string
  /** Retained for call-site compatibility; the site is one ground now. */
  tone?: 'ink' | 'bone'
}) {
  return (
    <div className={`relative w-full select-none ${className}`} aria-hidden="true">
      <motion.div
        className="h-px origin-left bg-line-2"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.1, ease: EASE_IN_OUT }}
      />
      <div className="absolute inset-x-0 top-0 flex justify-between">
        {Array.from({ length: ticks }).map((_, i) => (
          <motion.span
            key={i}
            className="block w-px origin-top"
            style={{
              height: i === 0 || i === ticks - 1 ? 12 : 6,
              background: i === 0 ? accent : 'var(--color-line-2)',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.4,
              ease: EASE_OUT,
              delay: 0.35 + i * 0.055,
            }}
          />
        ))}
      </div>
      {label && (
        <motion.span
          className="t-label absolute top-4 right-0 text-muted"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, delay: 0.35 + ticks * 0.055, ease: EASE_OUT }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
