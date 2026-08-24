import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import type { MarkKey } from '@/data/logos'
import { Eyebrow } from './Eyebrow'
import { Mark } from './Mark'
import { Media } from './Media'

interface PageHeaderProps {
  eyebrow: string
  /**
   * Heading, split into the lines you want revealed. One entry is the norm —
   * each entry is held to a single line from `lg` up.
   */
  lines: string[]
  /** Standfirst. Aim for ~150 characters; the block reserves three lines. */
  intro?: string
  image: string
  /** Alt text for the plate; pass '' when the image is purely decorative. */
  imageAlt?: string
  accent?: string
  /** Company mark, for the two pages that belong to one company. */
  mark?: MarkKey
  markAlt?: string
  /** Buttons or chips sitting under the intro. */
  children?: ReactNode
}

/**
 * The opener every inner page shares.
 *
 * **One band, one composition, at every width.** What it replaces was two
 * boxes sitting next to each other — a pale copy panel on the left, a
 * photograph starting abruptly on the right — and no amount of feathering the
 * photograph's left edge fixed that, because the two halves were still
 * different *grounds*. A reader's eye finds the seam between two grounds long
 * before it finds a soft edge.
 *
 * So there is only one ground now: the group's dark. The photograph is a layer
 * inside it rather than a half of it, and three things make it belong there:
 *
 *   1. **The mask.** The image's own alpha ramps out to the left, so it
 *      dissolves rather than stopping. A mask has no seam on any ground at any
 *      width; a scrim painted in the page colour always leaves a faint edge
 *      where the two meet.
 *   2. **The grade.** A wash in the same dark is laid *over* the photograph
 *      and carried the whole way across it, heaviest at the left and never
 *      quite reaching zero at the right. This is the part that does the real
 *      work: it means even the fully visible end of the frame is the same
 *      colour temperature as the panel, so the two read as one exposure
 *      rather than as a picture pasted onto a background.
 *   3. **The horizon.** The image is anchored off-centre so its own dark mass
 *      — ground, silhouette, foliage — falls on the side the copy comes from,
 *      and the sky falls where the frame is left open.
 *
 * Below `lg` nothing stacks. The photograph simply fills the whole band and
 * the grade is dialled up until the copy is safe on it, which is the same
 * composition seen closer rather than a different one.
 *
 * The band is a fixed height on desktop so moving between About, Projects and
 * the two company pages no longer makes the masthead jump. Two rules keep the
 * copy inside it identical from page to page:
 *
 *   - **One line of heading.** Every page's title is a single line from `lg`
 *     up, so the masthead is always one struck phrase rather than a two-line
 *     stack on one page and a one-line strike on the next. Narrower than `lg`
 *     the line is allowed to wrap, balanced, because nothing else will fit.
 *   - **A reserved intro.** The standfirst is set to one measure and holds
 *     three lines of height whether or not it fills them, so the heading and
 *     the buttons under it land on the same baseline on all six pages. Write
 *     intros to roughly 150 characters and they fill the space exactly.
 */
export function PageHeader({
  eyebrow,
  lines,
  intro,
  image,
  imageAlt,
  accent = 'var(--color-brand-bright)',
  mark,
  markAlt,
  children,
}: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-deep">
      {/* ── The photograph ───────────────────────────────────────────────
          Full-bleed and masked, not a column. On desktop the mask keeps the
          right two-thirds and dissolves everything left of it; on phones it
          holds the whole frame and only softens the very top, under the bar. */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      >
        <div
          className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,#000_38%)] lg:[mask-image:linear-gradient(to_right,transparent_2%,rgba(0,0,0,0.18)_20%,rgba(0,0,0,0.72)_40%,#000_58%)]"
          aria-hidden={imageAlt === '' || undefined}
        >
          <Media
            src={image}
            alt={imageAlt}
            priority
            sizes="100vw"
            className="object-[62%_45%] lg:object-[70%_50%]"
          />
        </div>
      </motion.div>

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, var(--color-deep) 0%, var(--color-deep) 26%, color-mix(in srgb, var(--color-deep) 82%, transparent) 44%, color-mix(in srgb, var(--color-deep) 46%, transparent) 62%, color-mix(in srgb, var(--color-deep) 22%, transparent) 82%, color-mix(in srgb, var(--color-deep) 12%, transparent) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 lg:hidden"
        style={{ background: 'color-mix(in srgb, var(--color-deep) 46%, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(64% 70% at 16% 52%, color-mix(in srgb, var(--color-deep) 55%, transparent) 0%, transparent 72%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-32"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-deep) 0%, color-mix(in srgb, var(--color-deep) 40%, transparent) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-24"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--color-deep) 72%, transparent), transparent)',
        }}
        aria-hidden="true"
      />

      {/* The drafting grid, kept from the light version but cut for the dark.
          It gives the open left third something to be rather than emptiness. */}
      <div
        className="grid-field-inv pointer-events-none absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_right,#000_0%,transparent_58%)]"
        aria-hidden="true"
      />
      <div className="film-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />

      {/* Clearance for the fixed bar. */}
      <div className="h-16 md:h-18" aria-hidden="true" />

      <div className="shell flex flex-col justify-center pt-12 pb-14 md:pt-16 md:pb-20 lg:h-[clamp(21rem,42vh,27rem)] lg:py-0">
        <motion.div
          className="mb-5 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: EASE_OUT }}
        >
          {mark && (
            <span className="rounded-chip bg-white/92 px-2.5 py-1.5 shadow-soft">
              <Mark name={mark} alt={markAlt ?? ''} height={26} optical loading="eager" />
            </span>
          )}
          <Eyebrow accent={accent} tone="dark">
            {eyebrow}
          </Eyebrow>
        </motion.div>

        <h1
          className="t-page-title max-w-[18ch] text-balance text-white sm:max-w-[24ch] lg:max-w-none"
          style={{ textShadow: '0 1px 2px rgba(6,12,10,0.3), 0 14px 40px rgba(6,12,10,0.4)' }}
        >
          {lines.map((line, i) => (
            <span key={line} className="mask-line lg:whitespace-nowrap">
              <motion.span
                className="block"
                initial={{ y: '112%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, delay: 0.2 + i * 0.09, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {intro && (
          <motion.p
            className="t-body mt-5 max-w-[34ch] text-pretty text-body-inv sm:max-w-[46ch] lg:min-h-[5.1em] lg:max-w-[48ch]"
            style={{ textShadow: '0 1px 2px rgba(6,12,10,0.45)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: EASE_OUT }}
          >
            {intro}
          </motion.p>
        )}

        {children && (
          <motion.div
            className="mt-7"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.56, ease: EASE_OUT }}
          >
            {children}
          </motion.div>
        )}
      </div>

      {/* The accent, struck along the foot of the band. It is the one place a
          page announces which company it belongs to before a word is read. */}
      <span
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(to right, ${accent} 0%, ${accent} 34%, transparent 88%)` }}
        aria-hidden="true"
      />
    </section>
  )
}
