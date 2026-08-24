import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * The hero backdrop.
 *
 * A looping, silent clip with a still of its own first second behind it. The
 * still is what actually paints first — it is a 40 kB WebP against a 2.9 MB
 * MP4 — so the hero is complete and readable before a single frame of video
 * has arrived, and the video fades over it once it can play.
 *
 * It is deliberately *not* loaded in three cases:
 *
 *   • under `prefers-reduced-motion`, where a seven-second loop of moving
 *     footage is precisely what the preference is asking not to see
 *   • below 1024 px, where it would be nearly three megabytes of mobile data
 *     for a backdrop the visitor did not ask for
 *   • while the tab is hidden, where it is paused rather than decoding
 *     frames nobody is looking at
 *
 * In all three the still simply stays, which is why the still is a real
 * composition rather than a black frame.
 */
export function HeroVideo({
  src,
  poster,
  posterSrcSet,
  className = '',
}: {
  src: string
  poster: string
  posterSrcSet: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [wanted, setWanted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) return
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWanted(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [reduced])

  // Decoding frames for a tab nobody is looking at is pure battery cost.
  useEffect(() => {
    if (!wanted) return
    const onVisibility = () => {
      const el = ref.current
      if (!el) return
      if (document.hidden) el.pause()
      else void el.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [wanted])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={poster}
        srcSet={posterSrcSet}
        sizes="100vw"
        alt="Rows of ground-mounted solar modules on a hillside site at dusk"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover"
      />

      {wanted && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
