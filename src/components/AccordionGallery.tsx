import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface AccordionGalleryItem {
  /** Image URL. Pair with `srcSet` to serve the responsive set. */
  image: string
  srcSet?: string
  /** Dominant colour, held under the panel until the file lands. */
  color?: string
  label?: string
  /** Second caption line — a sentence about the panel, or a short datum. */
  meta?: string
  link?: string
  /** Defaults to empty: the caption already names the panel. */
  alt?: string
}

export interface AccordionGalleryProps {
  items: AccordionGalleryItem[]
  defaultIndex?: number
  accentColor?: string
  overlayColor?: string
  textColor?: string
  /**
   * Height of the row. A number is taken as pixels; a string is used as a CSS
   * length, so a caller can hand it a `clamp()` and let the box scale with the
   * viewport. A column derives its own height from this.
   */
  height?: number | string
  gap?: number
  radius?: number
  /** Fraction of the row the open panel takes, 0.2–0.9. */
  expandRatio?: number
  orientation?: 'horizontal' | 'vertical'
  duration?: number
  ease?: string
  parallax?: number
  /** How far collapsed panels are pushed back into the overlay colour, 0–1. */
  dim?: number
  tilt?: number
  stagger?: number
  trigger?: 'hover' | 'click'
  showLabels?: boolean
  sizes?: string
  className?: string
  /** Fires whenever the open panel changes, so a caller can follow along. */
  onActiveChange?: (index: number) => void
}

/**
 * Expanding image accordion.
 *
 * Adapted from the React Bits component of the same name. Four things changed
 * on the way in, all of them because of how this site is built:
 *
 *   • Items carry a `srcSet`, so panels ship the generated WebP set rather
 *     than one large file each.
 *   • The dim and the desaturation animate real properties — an overlay's
 *     opacity and the media's filter — instead of custom properties read back
 *     through `color-mix`. The original set `--ag-dim` on the media element
 *     and read it from a *sibling* overlay, where it never arrived.
 *   • A narrow screen becomes a real column, sized from the panel count. The
 *     original kept the row's fixed height and only flipped the flex
 *     direction, so anything past four panels overflowed its own box.
 *   • Panels are list items containing a control, rather than controls with a
 *     list role painted over them, and the caption stays in the accessibility
 *     tree while it is visually hidden — so a collapsed panel still announces
 *     what it is.
 */
export function AccordionGallery({
  items,
  defaultIndex = 0,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  dim = 0.42,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  sizes = '(max-width: 640px) 92vw, 46vw',
  className = '',
  onActiveChange,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLUListElement>(null)
  const panelRefs = useRef<(HTMLLIElement | null)[]>([])
  const controlRefs = useRef<(HTMLElement | null)[]>([])
  const mediaRefs = useRef<(HTMLElement | null)[]>([])
  const dimRefs = useRef<(HTMLElement | null)[]>([])
  const spineRefs = useRef<(HTMLElement | null)[]>([])
  const barRefs = useRef<(HTMLElement | null)[]>([])
  const textRefs = useRef<(HTMLElement | null)[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const firstRunRef = useRef(true)
  const mediaSizeRef = useRef(320)

  const reduced = useReducedMotion()
  const count = items.length

  // Below this width a row of six panels is a row of six lines. Lay it out as
  // a column instead — the same accordion, turned ninety degrees.
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 640px)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const vertical = orientation === 'vertical' || narrow
  const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9)

  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), count - 1))

  const select = useCallback((i: number) => setActive(i), [])

  // Reported from an effect rather than from inside the state updater: under
  // StrictMode an updater runs twice, and a caller would hear every change
  // twice with it.
  const onChangeRef = useRef(onActiveChange)
  useEffect(() => {
    onChangeRef.current = onActiveChange
  }, [onActiveChange])
  useEffect(() => {
    onChangeRef.current?.(active)
  }, [active])

  /**
   * A column has to hold every collapsed panel plus the open one, so its
   * height is tied to the count. Sizing it off `height` alone would mean a
   * seventh panel silently squeezes the other six. A caller passing a CSS
   * length has taken that arithmetic on itself, so it is used as given.
   */
  const boxHeight =
    typeof height === 'string' ? height
    : vertical ? `${Math.max(Math.round(height * 1.3), count * 104)}px`
    : `${height}px`

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current
      if (!panels.length) return

      // The open panel is `ratio` of the row, so it needs this much more grow
      // than the collapsed ones sharing what is left of it.
      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1
      const mediaSize = mediaSizeRef.current

      tlRef.current?.kill()
      const dur = animate && !reduced ? duration : 0
      const tl = gsap.timeline()

      panels.forEach((panel, i) => {
        if (!panel) return
        const isActive = i === active
        const media = mediaRefs.current[i]
        const dimmer = dimRefs.current[i]
        const spine = spineRefs.current[i]
        const bar = barRefs.current[i]
        const text = textRefs.current[i]

        // Collapsed panels lean away from the open one, so the row reads as a
        // stack being opened rather than six independent boxes.
        const rot = isActive ? 0 : i < active ? tilt : -tilt
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot }

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0)

        if (media) {
          // The media is a fixed band wider than its panel, drifting as the
          // panel resizes. Without it the image would squash on every frame.
          const drift = Math.max(-1.5, Math.min(1.5, active - i))
          const shift = drift * parallax * mediaSize * 0.06
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              duration: dur,
              ease,
            },
            0,
          )
        }

        if (dimmer) tl.to(dimmer, { opacity: isActive ? 0 : dim, duration: dur, ease }, 0)

        // The closed panel carries its name on its spine and the open one
        // carries it along the bottom, so the two trade places rather than
        // both being present at once.
        if (showLabels && spine) {
          tl.to(
            spine,
            {
              opacity: isActive ? 0 : 1,
              duration: isActive ? dur * 0.45 : dur,
              ease,
            },
            0,
          )
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              { opacity: 1, x: 0, duration: dur, ease, stagger: reduced ? 0 : stagger },
              0,
            )
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0)
          }
        }
      })

      tlRef.current = tl
    },
    [
      active,
      count,
      ratio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      dim,
      showLabels,
      stagger,
      reduced,
    ],
  )

  // The observer cares about the box, not about which panel is open, so it
  // reads the current layout through a ref rather than tearing itself down and
  // rebuilding on every hover.
  const layoutRef = useRef(applyLayout)
  useEffect(() => {
    layoutRef.current = applyLayout
  }, [applyLayout])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const total = vertical ? rect.height : rect.width
      const usable = Math.max(total - gap * (count - 1), 120)
      mediaSizeRef.current = Math.max(140, usable * ratio * 1.22)
      el.style.setProperty('--ag-media-size', `${mediaSizeRef.current}px`)
      layoutRef.current(!firstRunRef.current)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [gap, count, ratio, vertical])

  useEffect(() => {
    applyLayout(!firstRunRef.current)
    firstRunRef.current = false
  }, [applyLayout])

  useEffect(
    () => () => {
      tlRef.current?.kill()
    },
    [],
  )

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    const forward = vertical ? 'ArrowDown' : 'ArrowRight'
    const back = vertical ? 'ArrowUp' : 'ArrowLeft'
    let next: number | null = null

    if (e.key === forward) next = (i + 1) % count
    else if (e.key === back) next = (i - 1 + count) % count
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = count - 1
    if (next === null) return

    e.preventDefault()
    select(next)
    // Focus follows the panel that opened. Leaving it behind means the next
    // Tab lands on a panel that then re-opens itself under the reader.
    controlRefs.current[next]?.focus()
  }

  if (!count) return null

  return (
    <ul
      ref={rootRef}
      className={`flex w-full max-w-full list-none ${vertical ? 'flex-col' : 'flex-row'} ${
        vertical ? 'perspective-[900px]' : 'perspective-[1400px]'
      } ${className}`}
      style={{ gap: `${gap}px`, height: boxHeight }}
    >
      {items.map((item, i) => {
        const isActive = i === active
        const Tag = item.link ? 'a' : 'button'

        return (
          <li
            key={item.image + i}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
            className="relative min-h-0 min-w-0 flex-[1_1_0] origin-center transform-3d"
            style={{ willChange: 'flex-grow, transform' }}
          >
            <Tag
              ref={(el: HTMLElement | null) => {
                controlRefs.current[i] = el
              }}
              type={item.link ? undefined : 'button'}
              href={item.link}
              onClick={() => select(i)}
              onMouseEnter={trigger === 'hover' ? () => select(i) : undefined}
              onFocus={() => select(i)}
              onKeyDown={(e: KeyboardEvent) => handleKeyDown(i, e)}
              aria-expanded={showLabels ? isActive : undefined}
              className="group relative block h-full w-full cursor-pointer overflow-hidden text-left no-underline outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              style={
                {
                  borderRadius: `${radius}px`,
                  backgroundColor: item.color ?? overlayColor,
                  '--tw-ring-color': accentColor,
                } as CSSProperties
              }
            >
              <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
                <span
                  ref={(el: HTMLElement | null) => {
                    mediaRefs.current[i] = el
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: vertical ? '100%' : 'var(--ag-media-size, 320px)',
                    height: vertical ? 'var(--ag-media-size, 320px)' : '100%',
                    willChange: 'transform, filter',
                  }}
                >
                  <img
                    src={item.image}
                    srcSet={item.srcSet}
                    sizes={sizes}
                    alt={item.alt ?? ''}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="block h-full w-full select-none object-cover [-webkit-user-drag:none]"
                  />
                </span>

                {/* Two layers doing two jobs: the gradient is always on, so the
                    caption has ground to sit on, and the dim lifts off the
                    panel that is open. */}
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 42%, ${overlayColor}c4 100%)`,
                  }}
                  aria-hidden="true"
                />
                <span
                  ref={(el: HTMLElement | null) => {
                    dimRefs.current[i] = el
                  }}
                  className="pointer-events-none absolute inset-0"
                  style={{ background: overlayColor, opacity: dim }}
                  aria-hidden="true"
                />
              </span>

              {/*
                  The name of a closed panel, set on its spine. A collapsed
                  plate is a tall sliver, so the label runs up it — turned in a
                  child element, because the wrapper is what the timeline
                  fades and the two transforms would fight over one node. A
                  column layout has the opposite problem, wide and short, so
                  there the label just sits on the left.
              */}
              {showLabels && item.label && (
                <span
                  ref={(el: HTMLElement | null) => {
                    spineRefs.current[i] = el
                  }}
                  className={
                    vertical
                      ? 'pointer-events-none absolute inset-y-0 left-5 z-2 flex items-center'
                      : 'pointer-events-none absolute inset-x-0 bottom-6 z-2 flex justify-center'
                  }
                  aria-hidden="true"
                >
                  <span
                    className="max-h-full overflow-hidden whitespace-nowrap [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]"
                    style={{
                      color: textColor,
                      // Set larger than the open panel's title: a spine has a
                      // whole plate to fill, and at heading size it reads as
                      // an afterthought rather than as the label of the thing.
                      fontFamily: 'var(--font-display, inherit)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.375rem, 2.1vw, 1.875rem)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                      ...(vertical
                        ? null
                        : { writingMode: 'vertical-rl', transform: 'rotate(180deg)' }),
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              )}

              {showLabels && (item.label || item.meta) && (
                <span className="absolute inset-x-5 bottom-5 z-2 flex items-center gap-3">
                  <span
                    ref={(el: HTMLElement | null) => {
                      barRefs.current[i] = el
                    }}
                    className="w-0.75 flex-none self-stretch rounded-full opacity-0"
                    style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
                    aria-hidden="true"
                  />
                  <span
                    ref={(el: HTMLElement | null) => {
                      textRefs.current[i] = el
                    }}
                    className="min-w-0 opacity-0"
                    style={{ color: textColor }}
                  >
                    {item.label && (
                      <span className="t-h3 block truncate [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
                        {item.label}
                      </span>
                    )}
                    {item.meta && (
                      <span className="t-small mt-1.5 block max-w-[46ch] opacity-90 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                        {item.meta}
                      </span>
                    )}
                  </span>
                </span>
              )}
            </Tag>
          </li>
        )
      })}
    </ul>
  )
}

export default AccordionGallery
