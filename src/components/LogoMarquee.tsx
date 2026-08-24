import { useEffect, useRef, useState } from 'react'
import { MARKS, type MarkKey } from '@/data/logos'
import { opticalHeight } from './Mark'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface MarqueeItem {
  name: string
  logo?: MarkKey
}

/**
 * A continuously drifting rail of client marks.
 *
 * The row is rendered twice and translated by exactly half its width, so the
 * seam never shows and the loop needs no measurement or JavaScript per frame.
 * Movement is one composited `transform` — no layout, no paint, no timer.
 *
 * It stops when it is not being looked at:
 *   • off screen        — an observer pauses the animation outright
 *   • pointer over it   — so a reader can settle on a mark
 *   • reduced motion    — the rail is replaced by a static wrapped row, since
 *                         a marquee is exactly the kind of perpetual movement
 *                         the preference exists to switch off
 *
 * Marks are duplicated for the loop, so the copy is hidden from assistive
 * technology and the accessible list is the first pass only.
 */
export function LogoMarquee({
  items,
  speedSeconds = 46,
  height = 40,
  className = '',
}: {
  items: MarqueeItem[]
  /** Seconds for one full cycle. Longer = slower. */
  speedSeconds?: number
  height?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  // Hover pause is state rather than a `group-hover:` class, because the play
  // state is already set inline for the off-screen pause and an inline style
  // always beats a class.
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '80px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  if (reduced) {
    return (
      <ul
        className={`flex flex-wrap items-center justify-center gap-x-12 gap-y-8 px-5 md:px-10 ${className}`}
      >
        {items.map((item) => (
          <li key={item.name}>
            <LogoCell item={item} height={height} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHeld(false)}
      style={
        {
          maskImage:
            'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)',
        } as React.CSSProperties
      }
    >
      <div
        className="flex w-max animate-[marquee_linear_infinite]"
        style={{
          animationDuration: `${speedSeconds}s`,
          animationPlayState: visible && !held ? 'running' : 'paused',
        }}
      >
        {[0, 1].map((pass) => (
          <ul
            key={pass}
            className="flex shrink-0 items-center gap-x-14 pr-14 sm:gap-x-20 sm:pr-20"
            aria-hidden={pass === 1 || undefined}
          >
            {items.map((item) => (
              <li key={item.name} className="shrink-0">
                <LogoCell item={item} height={height} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function LogoCell({ item, height }: { item: MarqueeItem; height: number }) {
  if (!item.logo) {
    return (
      <span
        className="flex items-center font-display font-bold text-muted transition-colors duration-500 hover:text-ink"
        style={{ height, fontSize: height * 0.44 }}
      >
        {item.name}
      </span>
    )
  }
  const m = MARKS[item.logo]
  const h = opticalHeight(m.w / m.h, height)
  return (
    <img
      src={m.src}
      alt={`${item.name} logo`}
      width={m.w}
      height={m.h}
      loading="lazy"
      decoding="async"
      className="w-auto object-contain transition-transform duration-600 ease-out-expo hover:scale-105"
      style={{ height: h }}
    />
  )
}
