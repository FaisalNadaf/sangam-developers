import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MARKS, type MarkKey } from '@/data/logos'
import { opticalHeight } from './Mark'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface LogoLoopItem {
  name: string
  logo?: MarkKey
}

/** Drawing box. Width is fixed; the caller sets how tall the band is. */
const VIEW_W = 1200

/** One full rise and fall of the wave, in drawing units. */
const PERIOD = 640

interface Sample {
  x: number
  y: number
  angle: number
}

interface Track {
  length: number
  spacing: number
  samples: Sample[]
}

/**
 * Client marks travelling along a ribbon, forever.
 *
 * The ribbon runs straight, so the plates sit level and need only their own
 * height across it: 58 inside an 84 ribbon, whose edges land at 10 and 94 in a
 * box of 104.
 *
 * Bending it is one prop, but four numbers move together. Each arc leaves its
 * end at a slope of `amplitude / 80`, which tilts the plates, which makes them
 * stand taller across the ribbon — `plateW · sin θ + plateH · cos θ` rather
 * than `plateH` — which needs the ribbon wider, which needs the box taller,
 * which needs `bandHeight` to keep pace at `viewHeight / 1200` of the width, or
 * the drawing gets scaled by its width instead and clips top and bottom. Raise
 * `amplitude` on its own and the plates will ride out of their own band.
 *
 * A ribbon carries the marks rather than a line of type: each one rides a
 * white plate that follows the curve and tilts with it, so the band reads as
 * one moving object instead of a green stripe with a logo rail bolted under
 * it.
 *
 * The plates are placed by arc length, not by x. A mark stepped along the x
 * axis would bunch up wherever the wave is steep, because the same horizontal
 * step covers more of a slope than it does of a flat — spacing has to be
 * measured along the path itself to come out even.
 *
 * The path runs well past both edges of the drawing box, far enough that one
 * plate per client fits along it, and a plate that reaches the far end
 * reappears at the near one. Both ends sit outside the box and at the same
 * point in the wave, so the jump has nowhere to show.
 *
 * Sixty times a second this has to know where every plate is. `getPointAtLength`
 * is too slow to ask that often, so the curve is sampled once into a table and
 * each frame is two lookups and a lerp.
 */
export function LogoLoop({
  items,
  /** Travel along the path, in drawing units per second. */
  speed = 58,
  direction = 'forward',
  viewHeight = 104,
  /** CSS height of the band. The drawing covers it and crops at the sides. */
  bandHeight = 'max(5.5rem, 8.8vw)',
  ribbon = true,
  ribbonColor = 'var(--color-brand)',
  ribbonWidth = 84,
  /** Peak of the wave off the centre line. Zero runs the ribbon straight. */
  amplitude = 0,
  plateW = 148,
  plateH = 58,
  gap = 28,
  pauseOnHover = true,
  className = '',
  ariaLabel = 'Client logos',
}: {
  items: LogoLoopItem[]
  speed?: number
  direction?: 'forward' | 'reverse'
  viewHeight?: number
  bandHeight?: string
  /**
   * Draw the band and the plate under each mark. Off leaves the marks
   * travelling on the page's own ground: the plate is only there to sit on
   * the ribbon, so the two go together rather than separately.
   */
  ribbon?: boolean
  ribbonColor?: string
  ribbonWidth?: number
  amplitude?: number
  plateW?: number
  plateH?: number
  gap?: number
  pauseOnHover?: boolean
  className?: string
  ariaLabel?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const plateRefs = useRef<(SVGGElement | null)[]>([])
  const trackRef = useRef<Track | null>(null)

  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  const cy = viewHeight / 2
  const count = items.length

  /**
   * Long enough to hold every client at the spacing asked for, rounded up to
   * a whole number of waves so the two ends meet at the same height, and
   * centred on the box so both of them fall outside it.
   */
  const d = useMemo(() => {
    const wanted = Math.max(3 * PERIOD, count * (plateW + gap))
    const span = Math.ceil(wanted / PERIOD) * PERIOD
    const x0 = VIEW_W / 2 - span / 2

    // A chain of flat Béziers is a slow way to write a line, and its tangents
    // are computed from differences that have rounded to nothing.
    if (amplitude <= 0) return `M ${x0} ${cy} L ${x0 + span} ${cy}`

    const half = PERIOD / 2

    // Q sets the first arc, then each T mirrors the one before it, which is
    // what makes the alternation a wave rather than a row of identical humps.
    //
    // The control point goes twice as far out as the peak we want: a quadratic
    // Bézier is pulled only halfway toward its control, so `cy - amplitude`
    // here would draw a wave half the depth it claims to be.
    const reach = amplitude * 2
    let path = `M ${x0} ${cy} Q ${x0 + half / 2} ${cy - reach} ${x0 + half} ${cy}`
    for (let x = x0 + half; x < x0 + span; x += half) {
      path += ` T ${x + half} ${cy}`
    }
    return path
  }, [count, plateW, gap, cy, amplitude])

  // Walk the curve once and write down where it goes. Everything after this
  // is table lookups.
  useLayoutEffect(() => {
    const el = pathRef.current
    if (!el || !count) return

    let length = 0
    try {
      length = el.getTotalLength()
    } catch {
      return
    }
    if (!length) return

    const STEPS = 900
    const samples: Sample[] = []
    for (let i = 0; i <= STEPS; i++) {
      const s = (i / STEPS) * length
      const p = el.getPointAtLength(s)
      const ahead = el.getPointAtLength(Math.min(length, s + 1))
      const behind = el.getPointAtLength(Math.max(0, s - 1))
      samples.push({
        x: p.x,
        y: p.y,
        angle: (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI,
      })
    }

    trackRef.current = { length, spacing: length / count, samples }
    setReady(true)
  }, [d, count])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!ready || !track) return

    const { length, spacing, samples } = track
    const last = samples.length - 1

    const place = (offset: number) => {
      for (let i = 0; i < count; i++) {
        const g = plateRefs.current[i]
        if (!g) continue

        let at = (i * spacing + offset) % length
        if (at < 0) at += length

        const t = (at / length) * last
        const lo = Math.floor(t)
        const frac = t - lo
        const a = samples[lo]
        const b = samples[Math.min(last, lo + 1)]

        const x = a.x + (b.x - a.x) * frac
        const y = a.y + (b.y - a.y) * frac
        // Angles are within a few degrees of each other along this curve, so
        // a plain lerp is safe — no wrap to straddle.
        const angle = a.angle + (b.angle - a.angle) * frac

        g.setAttribute(
          'transform',
          `translate(${x} ${y}) rotate(${angle}) translate(${-plateW / 2} ${-plateH / 2})`,
        )
      }
    }

    place(0)
    if (reduced || !visible || speed <= 0) return

    const state = { offset: 0 }
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      onUpdate: () => place(state.offset),
    })

    const root = rootRef.current
    const pause = () => tween.pause()
    const resume = () => tween.resume()
    if (pauseOnHover && root) {
      root.addEventListener('pointerenter', pause)
      root.addEventListener('pointerleave', resume)
    }

    return () => {
      tween.kill()
      if (pauseOnHover && root) {
        root.removeEventListener('pointerenter', pause)
        root.removeEventListener('pointerleave', resume)
      }
    }
  }, [ready, count, reduced, visible, speed, direction, pauseOnHover, plateW, plateH])

  if (!count) return null

  const pad = 12
  const innerW = plateW - pad * 2
  const innerH = plateH - pad * 2

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={{ height: bandHeight }}
    >
      {/* The marks are the content, so the names are on the page for a reader
          who is not looking at them. The drawing itself is decoration. */}
      <ul className="sr-only" aria-label={ariaLabel}>
        {items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>

      <svg
        className="block h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${viewHeight}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          style={{
            /* The path still carries the geometry every mark is placed along,
               so it stays in the document and only stops being painted. */
            stroke: ribbon ? ribbonColor : 'transparent',
            strokeWidth: ribbonWidth,
            strokeLinecap: 'round',
          }}
        />

        {items.map((item, i) => {
          const mark = item.logo ? MARKS[item.logo] : null
          let w = 0
          let h = 0

          if (mark) {
            const ratio = mark.w / mark.h
            // Balance by ink rather than by height, then let the plate have
            // the final say — a mark six times as wide as it is tall would
            // otherwise run out of both sides of it.
            h = Math.min(opticalHeight(ratio, innerH), innerH)
            w = h * ratio
            if (w > innerW) {
              w = innerW
              h = w / ratio
            }
          }

          return (
            <g
              key={item.name}
              ref={(el) => {
                plateRefs.current[i] = el
              }}
            >
              {ribbon && (
                <rect
                  width={plateW}
                  height={plateH}
                  rx={12}
                  fill="var(--color-paper)"
                  stroke="rgba(16,24,20,0.06)"
                />
              )}
              {mark ? (
                <image
                  href={mark.src}
                  x={(plateW - w) / 2}
                  y={(plateH - h) / 2}
                  width={w}
                  height={h}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                (() => {
                  // A client with no published mark carries its name instead,
                  // and some of those names are three times the length of
                  // others. Size the type to the plate and pin the run to a
                  // width it is known to fit — "Serentica Renewables" set at
                  // the same size as "Dalmia" hangs out of both ends.
                  const size = Math.min(15, innerW / (item.name.length * 0.56))
                  const run = Math.min(innerW, item.name.length * size * 0.56)
                  return (
                    <text
                      x={plateW / 2}
                      y={plateH / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      textLength={run}
                      lengthAdjust="spacingAndGlyphs"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: size,
                        fill: 'var(--color-ink)',
                      }}
                    >
                      {item.name}
                    </text>
                  )
                })()
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default LogoLoop
