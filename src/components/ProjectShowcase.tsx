import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { LinkButton } from '@/components/Button'
import { mediaSource } from '@/components/Media'
import { EASE_OUT } from '@/lib/motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface ShowcaseSlide {
  id: string
  /** Key into the media registry. */
  image: string
  eyebrow: string
  /** The one word the slide is about. Set in caps by the design. */
  name: string
  blurb: string
}

interface Geometry {
  thumbW: number
  thumbH: number
  gap: number
  /** Left edge of the first thumbnail. */
  first: number
  /** How many thumbnails the frame has room for. Zero on a phone. */
  thumbs: number
}

const clamp = (min: number, v: number, max: number) => Math.min(Math.max(v, min), max)

/**
 * Full-bleed slide with the queue stacked beside it.
 *
 * One slide fills the frame and carries the words; the next few sit along the
 * right as plates, and the front plate grows into the frame as it takes its
 * turn. The last plate is placed so half of it hangs past the frame's right
 * edge, and the frame deliberately does not clip — so the queue reads as cards
 * lifted out of the plate rather than as a strip cut off at a border. Nothing
 * else needed that clip: every slide carries its own `overflow-hidden` and its
 * own radius, so the filling slide still rounds off on its own. It reads as a deck being dealt rather than a filmstrip being dragged,
 * which suits a register — the next entry is already visible, waiting.
 *
 * Positions are measured rather than written as breakpoints: the frame is told
 * how wide it is and works out how many plates fit, so the same component is a
 * three-plate deck on a desktop and a plain photograph on a phone, where a
 * 190 px plate beside a 340 px slide would leave neither of them legible.
 *
 * Auto-advance pauses on hover, on focus, when the tab is hidden and whenever
 * the reader asks it to, and never starts under reduced motion.
 */
export function ProjectShowcase({
  slides,
  ariaLabel,
  intervalMs = 5200,
  ctaTo = '/projects',
  ctaLabel = 'See the projects',
  className = '',
}: {
  slides: ShowcaseSlide[]
  ariaLabel: string
  intervalMs?: number
  ctaTo?: string
  ctaLabel?: string
  className?: string
}) {
  const frame = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const count = slides.length

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [geo, setGeo] = useState<Geometry>({ thumbW: 190, thumbH: 244, gap: 20, first: 0, thumbs: 0 })

  useEffect(() => {
    const el = frame.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      // Under this width the plates and the words would be fighting over the
      // same 300 px, so the deck collapses to the photograph alone.
      const compact = w < 760
      // Landscape plates, so the queue echoes the frame it is queueing for
      // rather than contradicting it.
      const thumbW = clamp(190, w * 0.24, 340)
      const thumbH = clamp(120, Math.min(thumbW * 0.66, h - 140), 260)
      const gap = w < 1000 ? 14 : 20
      setGeo({
        thumbW,
        thumbH,
        gap,
        // One plate, then half of the one behind it. Anchoring to the right
        // edge rather than to the middle is what fixes the half: the second
        // plate is placed so exactly its own width overhangs.
        first: w - thumbW / 2 - (thumbW + gap),
        thumbs: compact ? 0 : 2,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = useCallback(
    (direction: 1 | -1) => setActive((i) => (i + direction + count) % count),
    [count],
  )

  useEffect(() => {
    if (reduced || paused || count < 2) return
    const id = window.setInterval(() => go(1), intervalMs)
    return () => window.clearInterval(id)
  }, [reduced, paused, count, intervalMs, go])

  // A backgrounded tab should not keep dealing slides.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const current = slides[active]
  const glide = reduced ? '0ms' : '620ms'

  // With no plates beside it the words span most of the frame, so the scrim
  // has to reach the whole way across instead of fading out at the halfway
  // mark where the deck would otherwise have taken over.
  const compact = geo.thumbs === 0
  // Held tight to the text column and cleared early, rather than spread thin
  // across the frame: stronger where a word actually sits, and gone by the
  // halfway mark, so most of the photograph is the photograph.
  const scrim = compact
    ? 'linear-gradient(90deg, rgba(6,14,10,0.78) 0%, rgba(6,14,10,0.62) 58%, rgba(6,14,10,0.34) 100%)'
    : 'linear-gradient(90deg, rgba(6,14,10,0.80) 0%, rgba(6,14,10,0.70) 18%, rgba(6,14,10,0.40) 32%, rgba(6,14,10,0.12) 44%, transparent 56%)'

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={frame}
        className="relative isolate h-[min(clamp(24rem,46vw,44rem),60vh)] w-full rounded-[var(--radius-card)] bg-canvas-3 shadow-[var(--shadow-plate)]"
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        {/*
          The frame's own edge. These photographs are often pale at the top and
          the section under them is pale too, so without a hairline the plate
          loses its upper corners into the page. Held at z-5: above the slide
          it outlines, below the queue plates (z-9/10) that hang over it, so it
          never draws a line across a card.
        */}
        <span
          className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit] ring-1 ring-ink/10 ring-inset"
          aria-hidden="true"
        />

        {slides.map((slide, i) => {
          // Slot 1 is the slide on show and slot 0 the one it covered, which
          // is what keeps the frame from flashing empty mid-deal.
          const slot = (i - active + 1 + count) % count
          const source = mediaSource(slide.image)
          const filling = slot <= 1
          const rank = slot - 2
          const parked = rank >= geo.thumbs

          const style: React.CSSProperties = filling
            ? {
                inset: 0,
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-card)',
                opacity: 1,
                zIndex: slot + 1,
                boxShadow: 'none',
              }
            : {
                left: geo.first + Math.min(rank, geo.thumbs) * (geo.thumbW + geo.gap),
                top: '50%',
                width: geo.thumbW,
                height: geo.thumbH,
                transform: 'translateY(-50%)',
                borderRadius: '1rem',
                opacity: parked ? 0 : 1,
                zIndex: parked ? 0 : 10 - rank,
              }

          return (
            <div
              key={slide.id}
              className={`group absolute overflow-hidden ${
                filling
                  ? ''
                  : 'shadow-[var(--shadow-deck)] transition-shadow duration-500 ease-out-expo hover:shadow-[var(--shadow-deck-lift)]'
              }`}
              style={{
                ...style,
                transitionProperty: 'left, top, width, height, opacity, border-radius, transform',
                transitionDuration: glide,
                transitionTimingFunction: 'var(--ease-out-expo)',
                willChange: 'left, width, height',
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}, ${slide.name}, ${slide.eyebrow}`}
            >
              {source && (
                <img
                  src={source.src}
                  srcSet={source.srcSet}
                  sizes="(max-width: 760px) 94vw, 76vw"
                  alt=""
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`h-full w-full object-cover ${
                    filling ? '' : 'transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]'
                  }`}
                  style={{ backgroundColor: source.color }}
                />
              )}

              {/* The slide on show gets the reading scrim; a plate gets the
                  ground its own label stands on. */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background: filling
                    ? scrim
                    : 'linear-gradient(180deg, rgba(6,14,10,0.02) 28%, rgba(6,14,10,0.46) 66%, rgba(6,14,10,0.82) 100%)',
                  transitionProperty: 'background',
                  transitionDuration: glide,
                }}
                aria-hidden="true"
              />

              {/* A plate is a card lying on a photograph rather than on a page,
                  so it carries its own edge. A drop shadow alone has nothing to
                  fall on when the frame behind it is a sunlit site shot. */}
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/25 ring-inset transition-[opacity,box-shadow] duration-500 ease-out-expo group-hover:ring-white/75"
                style={{ opacity: filling ? 0 : 1 }}
                aria-hidden="true"
              />

              {/* What the plate actually is. Without this the queue is three
                  photographs of nothing in particular, and the reader has no
                  reason to reach for one. */}
              <span
                className="pointer-events-none absolute inset-x-4 bottom-3.5 transition-opacity duration-500"
                style={{ opacity: filling ? 0 : 1 }}
                aria-hidden="true"
              >
                <span className="block truncate font-sans text-[0.95rem] font-bold tracking-[0.06em] text-white uppercase [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                  {slide.name}
                </span>
                <span className="t-label mt-1 block truncate text-white/70 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                  {slide.eyebrow}
                </span>
              </span>

              {/* Clicking a plate deals it. It looked like a control from the
                  first sketch; now it is one. */}
              <button
                type="button"
                onClick={() => setActive(i)}
                tabIndex={filling ? -1 : 0}
                aria-hidden={filling}
                aria-label={`Show ${slide.name}`}
                className="absolute inset-0 cursor-pointer rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
                style={{ pointerEvents: filling ? 'none' : 'auto' }}
              />
            </div>
          )
        })}

        {/*
          The words live above the deck rather than inside the slide they
          describe. Inside, they would be clipped by their own plate while it
          was still growing; out here they simply arrive.
        */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[6] flex w-full items-center">
          <div
            key={current?.id}
            className="pointer-events-auto w-[min(84%,26rem)] pl-[clamp(1.5rem,5.5%,4.5rem)] md:w-[min(46%,30rem)]"
          >
            <Line delay={0} reduced={reduced}>
              {/* The house green lightened for a dark ground. The brand tone
                  itself lands near 3.5:1 over a photograph once the scrim is
                  light enough to see through, which is under the floor for
                  text this small. */}
              <p
                className="t-label [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]"
                style={{ color: '#a8d97a' }}
              >
                {current?.eyebrow}
              </p>
            </Line>

            <Line delay={0.09} reduced={reduced}>
              <h3
                className="mt-3 text-paper uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.875rem, 4.4vw, 3.25rem)',
                  lineHeight: 1.02,
                  letterSpacing: '-0.025em',
                  textShadow: '0 1px 3px rgba(0,0,0,0.45), 0 2px 22px rgba(0,0,0,0.75)',
                }}
              >
                {current?.name}
              </h3>
            </Line>

            <Line delay={0.18} reduced={reduced}>
              <p className="t-small mt-3.5 max-w-[34ch] text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_1px_14px_rgba(0,0,0,0.85)]">
                {current?.blurb}
              </p>
            </Line>

            <Line delay={0.27} reduced={reduced}>
              <div className="mt-6">
                <LinkButton to={ctaTo} variant="invert" size="sm">
                  {ctaLabel}
                </LinkButton>
              </div>
            </Line>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2.5">
          <Step onClick={() => go(-1)} label="Previous project">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Step>
          <Step onClick={() => go(1)} label="Next project">
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Step>
        </div>
      </div>
    </div>
  )
}

/**
 * One line of the caption, arriving out of focus.
 *
 * Remounted with the slide — the key is on the wrapper above — so the entrance
 * plays again for every slide rather than only for the first.
 */
function Line({
  children,
  delay,
  reduced,
}: {
  children: React.ReactNode
  delay: number
  reduced: boolean
}) {
  if (reduced) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.72, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

function Step({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/75 text-ink backdrop-blur-md transition-[transform,background-color,border-color] duration-400 ease-out-expo hover:scale-105 hover:border-white hover:bg-white active:scale-95"
    >
      {children}
    </button>
  )
}
