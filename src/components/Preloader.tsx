import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { opticalHeight } from './Mark'
import { Wordmark } from './Wordmark'
import { COMPANIES } from '@/data/group'
import { MARKS } from '@/data/logos'

const SEEN_KEY = 'sangam:intro'

/** Long enough for the sequence to land, short enough not to be a toll gate. */
const MIN_MS = 950
/** Hard ceiling. A font that never arrives must not hold the door shut. */
const MAX_MS = 2200

/**
 * The two marks, balanced by ink rather than by height.
 *
 * The SD mark is nearly square and the SR mark nearly two-to-one, so setting
 * both to the same height would make one loom over the other. `opticalHeight`
 * is asked for its answer at a nominal base of 100, which turns a pixel height
 * into a multiplier the stylesheet can apply to one shared unit.
 */
const MARQUE = COMPANIES.map((company) => {
  const mark = MARKS[company.mark]
  return {
    key: company.key,
    name: company.name,
    src: mark.src,
    w: mark.w,
    h: mark.h,
    scale: opticalHeight(mark.w / mark.h, 100) / 100,
  }
})

/**
 * First-visit intro.
 *
 * *Sangam* is a confluence, and that is the whole sequence: the two company
 * marks arrive from opposite sides, meet at a hairline drawn between them, and
 * the group's own wordmark resolves underneath as the thing they make
 * together. No spinner — a spinner says "waiting"; this says who is waiting.
 *
 * It is over as soon as the application is ready rather than after a fixed
 * count. `document.fonts.ready` is the honest signal here: the site is set in
 * two families and the first paint without them is a different-looking page,
 * so the curtain holds until they land, then lifts. `MIN_MS` keeps a sequence
 * that resolved instantly from flashing; `MAX_MS` guarantees the page is never
 * held by a font that never arrives.
 *
 * It runs once per session — a repeat visit within the same session goes
 * straight to the page — and not at all under reduced motion. Any pointer,
 * key or wheel event dismisses it immediately.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  })

  const finish = useCallback(() => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setShow(false)
    onDone?.()
  }, [onDone])

  useEffect(() => {
    if (!show || reduced) {
      if (show) finish()
      else onDone?.()
      return
    }

    document.body.style.overflow = 'hidden'
    const started = performance.now()
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      finish()
    }

    // Ready when the faces have landed, and never later than the ceiling.
    const ready =
      'fonts' in document
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve(undefined)

    let holdTimer = 0
    ready.then(() => {
      const waited = performance.now() - started
      holdTimer = window.setTimeout(done, Math.max(0, MIN_MS - waited))
    })
    const ceiling = window.setTimeout(done, MAX_MS)

    window.addEventListener('pointerdown', done)
    window.addEventListener('keydown', done)
    window.addEventListener('wheel', done, { passive: true })

    return () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(ceiling)
      window.removeEventListener('pointerdown', done)
      window.removeEventListener('keydown', done)
      window.removeEventListener('wheel', done)
      document.body.style.overflow = ''
    }
  }, [show, reduced, finish, onDone])

  useEffect(() => {
    if (!show) document.body.style.overflow = ''
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="ground-deep fixed inset-0 z-90 flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: '-101%' }}
          transition={{ duration: 0.72, ease: EASE_IN_OUT }}
          role="status"
          aria-label="Loading Sangam Ventures"
        >
          <div className="grid-field-inv pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(46% 46% at 50% 46%, color-mix(in srgb, var(--color-brand-bright) 13%, transparent) 0%, transparent 72%)',
            }}
            aria-hidden="true"
          />
          <div className="film-grain pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />

          {/* ── The confluence ───────────────────────────────────────── */}
          <div
            className="relative flex items-center"
            style={{ gap: 'clamp(1.75rem, 6vw, 3.75rem)' }}
          >
            {MARQUE.map((company, i) => (
              <motion.img
                key={company.key}
                src={company.src}
                width={company.w}
                height={company.h}
                alt={`${company.name} logo`}
                className="w-auto object-contain"
                style={{
                  height: `calc(clamp(2.625rem, 8vw, 4.75rem) * ${company.scale.toFixed(3)})`,
                  filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.45))',
                }}
                initial={{ opacity: 0, x: i === 0 ? -64 : 64, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, delay: 0.08, ease: EASE_OUT }}
              />
            ))}

            {/* The join. Drawn last, and drawn outward from the middle, so the
                two marks read as having met rather than as having been placed. */}
            <motion.span
              className="pointer-events-none absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-white/30"
              style={{ height: 'clamp(2rem, 6vw, 3.25rem)' }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
              aria-hidden="true"
            />
          </div>

          {/* ── What the two of them are ─────────────────────────────── */}
          <motion.div
            className="mt-[clamp(1.75rem,4vw,2.75rem)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62, ease: EASE_OUT }}
          >
            <Wordmark className="text-white" muted="text-muted-inv" size="footer" />
          </motion.div>

          {/* ── The rail ─────────────────────────────────────────────
              A line that fills once, in the two house colours, left to right.
              It measures the wait rather than pretending to measure progress. */}
          <div
            className="absolute bottom-[13vh] h-px w-[min(58vw,19rem)] overflow-hidden bg-white/12"
            aria-hidden="true"
          >
            <motion.span
              className="block h-full origin-left"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-sd) 0%, var(--color-sd) 44%, var(--color-sre) 56%, var(--color-sre) 100%)',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.25, ease: EASE_OUT }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
