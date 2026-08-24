import { motion } from 'framer-motion'
import { Mail, Phone } from 'lucide-react'
import { GROUP } from '@/data/group'
import { EASE_IN_OUT, EASE_OUT, VIEWPORT } from '@/lib/motion'
import { LinkButton } from '@/components/Button'
import { useReveal } from '@/hooks/useReveal'
import { Eyebrow } from '@/components/Eyebrow'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { Media } from '@/components/Media'

/**
 * The close.
 *
 * The one place the site goes dark, and it does it inside a rounded plate
 * rather than by flooding the viewport — so it reads as a card the page is
 * holding up rather than as a different website. One primary action, and the
 * two direct channels the companies actually publish. No form promises are
 * made here that the group has not already made in its own profiles.
 */
export function CallToAction({
  eyebrow = 'Start a conversation',
  lines = ['Tell us about', 'the site.'],
  body = 'Send the location, the scope and the programme. Whatever the work, one of the two companies has built it before.',
  accent = 'var(--color-brand-bright)',
  image = 'renewables/solar-wind-sunset',
}: {
  eyebrow?: string
  lines?: string[]
  body?: string
  accent?: string
  image?: string
}) {
  const plateIn = useReveal(
    { opacity: 0, y: 48, scale: 0.97 },
    { duration: 0.9, ease: EASE_OUT },
  )

  return (
    <section className="ground-canvas pt-4 pb-16 md:pb-24" aria-labelledby="cta-heading">
      <div className="shell">
        <motion.div
          className="relative overflow-hidden rounded-plate shadow-plate"
          {...plateIn}
        >
          <div className="absolute inset-0">
            <Media src={image} sizes="100vw" alt="" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(95deg, var(--color-deep) 4%, color-mix(in srgb, var(--color-deep) 92%, transparent) 36%, color-mix(in srgb, var(--color-deep) 62%, transparent) 74%, color-mix(in srgb, var(--color-deep) 38%, transparent) 100%)',
              }}
            />
          </div>

          <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
            <motion.div
              className="h-px w-full origin-left"
              style={{ background: `color-mix(in srgb, ${accent} 55%, transparent)` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.1, ease: EASE_IN_OUT }}
            />

            <div className="grid gap-x-12 gap-y-12 pt-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Reveal direction="left">
                  <Eyebrow accent={accent} tone="dark" className="mb-6">
                    {eyebrow}
                  </Eyebrow>
                </Reveal>

                <h2 id="cta-heading" className="t-display text-white">
                  <MaskedLines lines={lines} />
                </h2>

                <Reveal direction="left" delay={0.14}>
                  <p className="t-lead mt-7 max-w-xl text-white/72">{body}</p>
                </Reveal>

                <Reveal delay={0.24} className="mt-10">
                  <LinkButton to="/contact" variant="invert" size="lg" accent={accent} magnetic>
                    Contact the group
                  </LinkButton>
                </Reveal>
              </div>

              <Reveal direction="right" delay={0.18} className="lg:col-span-5">
                <ul className="grid gap-3">
                  <li>
                    <a
                      href={`tel:${GROUP.phoneHref}`}
                      className="group flex items-center gap-5 rounded-card border border-white/12 bg-white/8 p-5 backdrop-blur-md transition-[background-color,border-color,transform] duration-400 ease-out-expo hover:-translate-y-1 hover:border-white/25 hover:bg-white/14"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/12 transition-transform duration-400 ease-spring group-hover:scale-110">
                        <Phone className="h-5 w-5 text-white" strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="t-label block text-white/60">Direct line</span>
                        <span className="t-h3 mt-1 block text-white">{GROUP.phone}</span>
                      </span>
                    </a>
                  </li>
                  {GROUP.emails.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className="group flex items-center gap-5 rounded-card border border-white/12 bg-white/8 p-5 backdrop-blur-md transition-[background-color,border-color,transform] duration-400 ease-out-expo hover:-translate-y-1 hover:border-white/25 hover:bg-white/14"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/12 transition-transform duration-400 ease-spring group-hover:scale-110">
                          <Mail className="h-5 w-5 text-white" strokeWidth={1.6} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="t-label block text-white/60">
                            {email.includes('renewables') ? 'Sangam Renewables' : 'Sangam Developers'}
                          </span>
                          <span className="t-data mt-1 block break-all text-white">{email}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
