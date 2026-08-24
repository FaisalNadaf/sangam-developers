import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Auto-advancing carousel.
 *
 * Built on a native overflow-x scroller with scroll snapping rather than a
 * transform track, which buys three things for free: real touch and trackpad
 * swiping, keyboard scrolling, and correct behaviour when a card is focused
 * by tabbing into it. Auto-advance is just a `scrollTo` on a timer.
 *
 * It pauses on hover, on focus within, when the tab is hidden, and while the
 * reader is dragging — and it never starts at all under reduced motion, where
 * an unrequested moving element is exactly what was opted out of.
 */
export function Carousel({
  children,
  ariaLabel,
  itemClassName = 'w-[82vw] sm:w-[58vw] lg:w-[38vw] xl:w-[30vw]',
  intervalMs = 4800,
  className = '',
  edge = 'shell',
  loop = false,
  cta,
}: {
  children: ReactNode
  ariaLabel: string
  /** Width of a single slide at each breakpoint. */
  itemClassName?: string
  intervalMs?: number
  className?: string
  /** `shell` lines slides up with the page margin; `flush` runs edge to edge. */
  edge?: 'shell' | 'flush'
  /**
   * Run the rail as a ring rather than a strip: the slides are laid out three
   * times over and the scroll position is folded back into the middle copy
   * whenever it crosses into an outer one. The reader can keep going in either
   * direction and never reaches an end.
   */
  loop?: boolean
  /** Sits at the right of the control row. */
  cta?: ReactNode
}) {
  const rail = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const slides = Children.toArray(children)
  // Three copies: one to scroll out of, one to sit in, one to scroll into.
  const looping = loop && slides.length > 1
  const rendered = looping ? [...slides, ...slides, ...slides] : slides

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /** Width of one full pass of the slides, in scroll pixels. */
  const copyWidth = useCallback(() => {
    const el = rail.current
    if (!el) return 0
    const card = el.querySelector<HTMLElement>('[data-slide]')
    if (!card) return 0
    return (card.offsetWidth + 24) * slides.length
  }, [slides.length])

  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-slide]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth

    if (looping) {
      /*
        Fold back before reading the position, and do it with smooth scrolling
        switched off so the correction is a jump rather than a journey. The
        distance is exactly one copy, so every slide lands on the same snap
        point it was already on and nothing moves on screen.
      */
      const copy = copyWidth()
      if (copy > 0) {
        if (el.scrollLeft >= copy * 2 - 1 || el.scrollLeft <= 1) {
          const behavior = el.style.scrollBehavior
          el.style.scrollBehavior = 'auto'
          el.scrollLeft += el.scrollLeft <= 1 ? copy : -copy
          el.style.scrollBehavior = behavior
        }
      }
      setIndex(Math.round(el.scrollLeft / step) % slides.length)
      return
    }

    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft < 8)
    setAtEnd(max - el.scrollLeft < 8)
    setIndex(Math.round(el.scrollLeft / step))
  }, [looping, copyWidth, slides.length])

  // Open on the middle copy, so the very first swipe left has somewhere to go.
  useEffect(() => {
    const el = rail.current
    if (!el || !looping) return
    const settle = window.setTimeout(() => {
      const copy = copyWidth()
      if (copy <= 0) return
      const behavior = el.style.scrollBehavior
      el.style.scrollBehavior = 'auto'
      el.scrollLeft = copy
      el.style.scrollBehavior = behavior
    }, 0)
    return () => window.clearTimeout(settle)
  }, [looping, copyWidth])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const goTo = useCallback(
    (i: number) => {
      const el = rail.current
      if (!el) return
      const card = el.querySelector<HTMLElement>('[data-slide]')
      const step = card ? card.offsetWidth + 24 : el.clientWidth
      // Aim at the middle copy, so a dot never lands the reader on an edge.
      el.scrollTo({ left: (looping ? i + slides.length : i) * step, behavior: 'smooth' })
    },
    [looping, slides.length],
  )

  const step = useCallback((direction: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-slide]')
    const distance = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }, [])

  // Auto-advance. Wraps back to the first slide once the rail runs out.
  useEffect(() => {
    if (reduced || paused || slides.length < 2) return
    const id = window.setInterval(() => {
      const el = rail.current
      if (!el) return
      if (!looping && el.scrollWidth - el.clientWidth - el.scrollLeft < 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        step(1)
      }
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [reduced, paused, intervalMs, slides.length, step, looping])

  /*
    Drag to scroll, for a mouse.

    Touch and pen already pan the rail natively and do it better than any
    handler would, so only a mouse is intercepted. The delta is applied
    incrementally rather than against the position the drag started from: on a
    looping rail the scroll position is folded back by a whole copy mid-gesture,
    and a remembered origin would be stale the moment that happened.
  */
  const drag = useRef<{ startX: number; lastX: number; moved: boolean } | null>(null)
  const swallowClick = useRef(false)
  const [dragging, setDragging] = useState(false)

  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = rail.current
    if (!el) return
    drag.current = { startX: e.clientX, lastX: e.clientX, moved: false }
    setDragging(true)
    // Snap would fight every pixel of the drag, and smooth scrolling would
    // animate toward each new position instead of following the hand.
    el.style.scrollSnapType = 'none'
    el.style.scrollBehavior = 'auto'
  }, [])

  const onDragMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current
    const el = rail.current
    if (!d || !el) return
    if (!d.moved && Math.abs(e.clientX - d.startX) > 4) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
    }
    if (d.moved) el.scrollLeft -= e.clientX - d.lastX
    d.lastX = e.clientX
  }, [])

  const onDragEnd = useCallback((e: React.PointerEvent) => {
    const d = drag.current
    const el = rail.current
    if (!d || !el) return
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    // Back to the stylesheet, which lets the rail settle onto its snap point.
    el.style.scrollSnapType = ''
    el.style.scrollBehavior = ''
    swallowClick.current = d.moved
    drag.current = null
    setDragging(false)
  }, [])

  // A backgrounded tab should not keep scrolling.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const gutter =
    edge === 'shell'
      ? 'px-5 scroll-pl-5 md:px-10 md:scroll-pl-10 xl:px-16 xl:scroll-pl-16'
      : 'px-0 scroll-pl-0'

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      <div
        ref={rail}
        className={`no-bar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-2 pb-6 ${gutter} ${
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        onDragStart={(e) => e.preventDefault()}
        /* A drag that ends on a card must not also count as a click on it. */
        onClickCapture={(e) => {
          if (!swallowClick.current) return
          swallowClick.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {rendered.map((slide, i) => (
          <div
            key={i}
            data-slide
            className={`shrink-0 snap-start ${itemClassName}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${(i % slides.length) + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
        <div className="w-1 shrink-0 md:w-6" aria-hidden="true" />
      </div>

      {/* Controls */}
      <div className="shell mt-6 flex flex-wrap items-center gap-x-5 gap-y-4">
        <div className="flex gap-2.5">
          <RailButton
            onClick={() => step(-1)}
            disabled={!looping && atStart}
            label="Previous slide"
            icon={<ArrowLeft className="h-4 w-4" strokeWidth={2} />}
          />
          <RailButton
            onClick={() => step(1)}
            disabled={!looping && atEnd}
            label="Next slide"
            icon={<ArrowRight className="h-4 w-4" strokeWidth={2} />}
          />
        </div>

        {/* Dots double as the position readout and as direct navigation. */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-pill transition-[width,background-color] duration-400 ease-out-expo ${
                i === index ? 'w-8 bg-brand' : 'w-4 bg-line-2 hover:bg-faint'
              }`}
            />
          ))}
        </div>

        {cta}
      </div>
    </div>
  )
}

function RailButton({
  onClick,
  disabled,
  label,
  icon,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  icon: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-soft transition-[transform,box-shadow,border-color,color] duration-400 ease-out-expo enabled:hover:-translate-y-0.5 enabled:hover:border-brand/40 enabled:hover:text-brand enabled:hover:shadow-card enabled:active:translate-y-0 enabled:active:scale-95 disabled:opacity-35"
    >
      {icon}
    </button>
  )
}
