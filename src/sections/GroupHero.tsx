import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion'
import { Eyebrow } from '@/components/Eyebrow'
import { HeroVideo } from '@/components/HeroVideo'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const HEADLINE = ['We Build, You Secure',]

/**
 * The home hero.
 *
 * A full viewport of moving footage with the copy set into it — the plant
 * itself, not a picture of the plant sitting in a card beside the text.
 *
 * The grade is built to be *seen through*. The temptation with type over video
 * is to keep adding scrim until the words are safe, and the cost of that is
 * the clip: past roughly three-quarters opacity a photograph stops being a
 * photograph and becomes a grey card with a heading on it. So the darkening
 * here is spent where it earns something — a soft pool under the copy column —
 * and the rest of the frame is left near enough untouched that the rows of
 * modules, the ridge line and the dusk sky all still read.
 *
 * What holds the contrast instead of brute opacity is the pairing of that
 * local pool with a small amount of shadow carried on the type itself, which
 * costs the image nothing and travels with the words wherever the clip happens
 * to be bright behind them.
 */
export function GroupHero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const plateY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.1])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-10%'])
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0.05])

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-deep"
      aria-labelledby="hero-heading"
    >
      {/* ── Full-bleed plate ──────────────────────────────────────────────
          A small lift on the footage itself. The clip is shot at dusk, and
          under a light grade an unlifted dusk frame reads as underexposed
          rather than as evening — that correction belongs on the image, not on
          another layer of scrim. */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: plateY,
          scale: plateScale,
          filter: 'saturate(1.06) contrast(1.04) brightness(1.1)',
        }}
      >
        <HeroVideo
          src="/media/hero/hero.mp4"
          poster="/media/hero/hero-poster-1920.webp"
          posterSrcSet="/media/hero/hero-poster-640.webp 640w, /media/hero/hero-poster-1280.webp 1280w, /media/hero/hero-poster-1920.webp 1920w"
        />
      </motion.div>

      {/*
        The grade. Five passes, none of them opaque and none of them doing
        more than one job.

          ramp  — a shallow left-to-right fall, topping out at 58%. It sets the
                  left third a stop or so down; it does not black it out
          pool  — a soft ellipse centred on the copy, which is the only part of
                  the frame that has to carry small white type
          head  — a short scrim so the bar always has something under it,
                  whatever the clip happens to be doing at the top of frame
          tint  — a trace of the group green, so the dark reads as this brand's
                  dark rather than as neutral grey
          grain — dithers the gradients; 8-bit colour bands badly over a large
                  slow ramp, and that banding is most of why video heroes look
                  muddy
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(95deg, color-mix(in srgb, var(--color-deep) 58%, transparent) 0%, color-mix(in srgb, var(--color-deep) 44%, transparent) 24%, color-mix(in srgb, var(--color-deep) 18%, transparent) 50%, color-mix(in srgb, var(--color-deep) 4%, transparent) 76%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 56% at 20% 48%, color-mix(in srgb, var(--color-deep) 38%, transparent) 0%, color-mix(in srgb, var(--color-deep) 20%, transparent) 46%, transparent 78%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in srgb, var(--color-deep) 52%, transparent) 0%, color-mix(in srgb, var(--color-deep) 24%, transparent) 45%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ background: 'var(--color-brand-deep-wash)', mixBlendMode: 'multiply' }}
        aria-hidden="true"
      />
      <div className="film-grain absolute inset-0 opacity-[0.045]" aria-hidden="true" />

      {/* ── Copy ─────────────────────────────────────────────────────── */}
      <motion.div
        className="shell relative z-10 flex flex-1 flex-col justify-center pt-24 pb-12 md:pt-32 md:pb-16"
        style={{ y: copyY, opacity: copyFade }}
      >
        <motion.div
          className="mb-5 md:mb-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
        >
          <Eyebrow accent="var(--color-brand-bright)" tone="dark">
            Sangam Group of Companies
          </Eyebrow>
        </motion.div>

        <h1
          id="hero-heading"
          className="t-hero max-w-[17ch] text-white"
          style={{ textShadow: '0 1px 1px rgba(14,21,18,0.24), 0 18px 44px rgba(14,21,18,0.34)' }}
        >
          {HEADLINE.map((line, i) => (
            <span key={line} className="mask-line">
              <motion.span
                className="block"
                initial={{ y: '112%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.05, delay: 0.2 + i * 0.11, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="t-lead mt-5 max-w-2xl text-white/90 md:mt-7"
          style={{ textShadow: '0 1px 2px rgba(14,21,18,0.38), 0 2px 20px rgba(14,21,18,0.55)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT }}
        >
          The groundwork that takes a wind or solar plant from raw parcels to the
          grid, across Maharashtra and Karnataka.
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap items-center gap-3 md:mt-9"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.74, ease: EASE_OUT }}
        >
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 rounded-chip bg-white px-7 py-3.5 font-sans text-[0.9375rem] font-bold text-ink shadow-lift transition-[transform,box-shadow] duration-400 ease-out-expo hover:-translate-y-0.5 hover:shadow-plate active:translate-y-0 active:scale-[0.98]"
          >
            See the projects
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
          {/*
            The glass pill leans on the frame behind it for its edge, so it is
            cut a little firmer than it was: under the old near-solid scrim a
            35% border was plenty, and against open footage it is not.
          */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-chip border border-white/45 bg-white/12 px-7 py-3.5 font-sans text-[0.9375rem] font-bold text-white shadow-soft backdrop-blur-lg transition-[transform,background-color,border-color] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/22 active:translate-y-0 active:scale-[0.98]"
          >
            Let’s talk
          </Link>
        </motion.div>


      </motion.div>
    </section>
  )
}
