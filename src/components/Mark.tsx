import { MARKS, type MarkKey } from '@/data/logos'

/**
 * Optical height for a mark of a given aspect ratio.
 *
 * Setting every logo to the same pixel height is the obvious thing and the
 * wrong one: at 38 px tall, the Siemens Gamesa lockup is 236 px wide and the
 * HESCOM roundel is 38 px square, so the roundel reads as a fifth the size of
 * its neighbour even though both are "the same height".
 *
 * Damping height by the ratio evens the ink out. A pure area match
 * (`h / sqrt(ratio)`) over-corrects and makes roundels loom, so the exponent
 * is 0.35 — most of the correction, none of the looming. `base` is the height
 * a 4:1 wordmark gets; everything else is measured against that.
 */
export function opticalHeight(ratio: number, base: number) {
  return Math.round((base * Math.pow(4, 0.35)) / Math.pow(ratio, 0.35))
}

/**
 * A logo.
 *
 * The intrinsic size comes from the manifest, so the element reserves its own
 * box before the file arrives and nothing shifts on load.
 */
export function Mark({
  name,
  alt,
  height = 44,
  optical = false,
  className = '',
  loading = 'lazy',
}: {
  name: MarkKey
  alt: string
  /** Rendered height in px. Width follows the file's own ratio. */
  height?: number
  /** Balance by ink rather than by height — see `opticalHeight`. */
  optical?: boolean
  className?: string
  loading?: 'lazy' | 'eager'
}) {
  const m = MARKS[name]
  const h = optical ? opticalHeight(m.w / m.h, height) : height

  return (
    <img
      src={m.src}
      alt={alt}
      width={m.w}
      height={m.h}
      loading={loading}
      decoding="async"
      className={`w-auto object-contain ${className}`}
      style={{ height: h, maxWidth: '100%' }}
    />
  )
}
