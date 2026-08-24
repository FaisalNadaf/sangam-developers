import { motion } from 'framer-motion'
import { PROJECTS } from '@/data/projects'
import { COMPANIES } from '@/data/group'
import { onTint } from '@/lib/color'
import { EASE_OUT } from '@/lib/motion'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'
import { useDraw, useReveal } from '@/hooks/useReveal'

/**
 * The group's journey.
 *
 * Every entry is anchored to a date that appears in the source documents —
 * a company formation date, a certificate issue date, or the first year of a
 * project on the register. The project count beside each period is counted
 * from the register rather than stated, so the timeline cannot drift from the
 * data it summarises.
 */
interface Milestone {
  year: string
  company?: 'developers' | 'renewables' | 'both'
  title: string
  detail: string
  /** Register years counted into this period. */
  years?: number[]
}

const MILESTONES: Milestone[] = [
  {
    year: '2016',
    company: 'developers',
    title: 'Sangam Developers established',
    detail:
      'Founded in March 2016 as a proprietorship under Mr. Ravikumar Bagali, B.E. (ECE), based at Morbagi, Dist. Sangli, Maharashtra.',
  },
  {
    year: '2017',
    company: 'developers',
    title: 'First solar and transmission contracts',
    detail:
      'A 50 MW solar PV project for Wardha Solar under Adani Power, a 30 MW project for Snider Electric, and a first 33 kV Panther line, 15 km for Suzlon at Ilkal.',
    years: [2017],
  },
  {
    year: '2018–19',
    company: 'developers',
    title: 'The Gamesa programme',
    detail:
      'MMS piling, inverter rooms, MV cable works, WTG foundations, 25 DP yards and 50 km of 33 kV line at Lohara and Kavaldhara.',
    years: [2018, 2019],
  },
  {
    year: '2020–21',
    company: 'developers',
    title: 'Substations and utility work',
    detail:
      'Shed foundations and substation works at the Dalmia cement plant, a 110 kV line at Vijayapura for KPTCL, and road maintenance at Kanamadi for Acciona.',
    years: [2020, 2021],
  },
  {
    year: '2022–23',
    company: 'developers',
    title: 'Land aggregation at scale',
    detail:
      'Land aggregation and development at Gadag for ReNew Power, then 55 km of 33 kV line at RTC1 Gadag and platform works for WTG erection.',
    years: [2022, 2023],
  },
  {
    year: '2024',
    company: 'both',
    title: 'Sangam Renewables & Electrosystems LLP incorporated',
    detail:
      'Headquartered in Karnataka from 24 June 2024, to take on land development, NA conversion and solar and wind solutions alongside the existing business.',
    years: [2024],
  },
  {
    year: '2025',
    company: 'developers',
    title: 'ISO 9001 and ISO 45001 certified',
    detail:
      'Sangam Developers certified for quality management and occupational health and safety on 10 September 2025, valid to September 2028.',
    years: [2025],
  },
  {
    year: '2026',
    company: 'renewables',
    title: 'Certification across the group',
    detail:
      'Sangam Renewables & Electrosystems LLP certified to the same two standards on 10 April 2026, valid to April 2029, so both companies now work to one system.',
    years: [2026],
  },
]

const countIn = (years?: number[]) =>
  years ? PROJECTS.filter((p) => years.includes(p.year)).length : 0

export function Journey() {
  const reveal = useReveal({ opacity: 0, x: 44 }, { duration: 0.6, ease: EASE_OUT })
  const draw = useDraw({ duration: 1.5, ease: EASE_OUT })

  return (
    <section className="section-y ground-tint" aria-labelledby="journey-heading">
      <div className="shell">
        <SectionHeader
          id="journey-heading"
          eyebrow="Journey"
          lines={['One proprietorship, then two companies.']}
          intro={
            <p>
              Every date below comes from a company formation record, a
              certificate, or the first year of a project on the register. The
              count beside each period is taken from the register itself.
            </p>
          }
          align="wide"
        />

        <ol className="relative mt-16 md:mt-20">
          {/* The datum the milestones hang from */}
          <motion.div
            className="absolute top-3 bottom-3 left-[11px] w-0.5 origin-top rounded-pill bg-line md:left-[calc(9rem+11px)]"
            {...(Object.keys(draw).length
              ? {
                  initial: { scaleY: 0 },
                  whileInView: { scaleY: 1 },
                  viewport: { once: true, amount: 0.02 },
                  transition: { duration: 1.5, ease: EASE_OUT },
                }
              : {})}
            aria-hidden="true"
          />

          {MILESTONES.map((milestone, i) => {
            const accent =
              milestone.company === 'renewables'
                ? COMPANIES[1].accentOnBone
                : milestone.company === 'both'
                  ? 'var(--color-brand)'
                  : COMPANIES[0].accentOnBone
            const count = countIn(milestone.years)

            return (
              <motion.li
                key={milestone.year}
                className="group relative flex gap-6 pb-5 last:pb-0 md:gap-10"
                {...reveal}
                transition={{ duration: 0.6, delay: Math.min(i, 4) * 0.07, ease: EASE_OUT }}
              >
                <span className="hidden w-36 shrink-0 pt-6 text-right md:block">
                  <span className="t-data" style={{ color: onTint(accent) }}>
                    {milestone.year}
                  </span>
                </span>

                {/* Node on the datum */}
                <span className="relative mt-6 flex h-6 w-6 shrink-0 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{ background: `color-mix(in srgb, ${accent} 18%, transparent)` }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative block h-3 w-3 rotate-45 rounded-[3px] border-2 bg-canvas transition-transform duration-400 ease-spring group-hover:scale-125"
                    style={{ borderColor: accent }}
                    aria-hidden="true"
                  />
                </span>

                <div className="card card-interactive min-w-0 flex-1 p-6 md:p-7">
                  <span
                    className="t-data mb-2 block md:hidden"
                    style={{ color: onTint(accent) }}
                  >
                    {milestone.year}
                  </span>
                  <h3 className="t-h3 text-ink">{milestone.title}</h3>
                  <p className="t-body mt-3 max-w-2xl text-muted">{milestone.detail}</p>
                  {count > 0 && (
                    <p className="t-label mt-4" style={{ color: onTint(accent) }}>
                      {count} {count === 1 ? 'entry' : 'entries'} on the register
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>

        <Reveal className="mt-10 rounded-card bg-canvas-2 px-6 py-6 md:px-8">
          <p className="t-small max-w-2xl text-muted">
            Several projects run across more than one period; each is counted
            once, against the first year recorded for it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
