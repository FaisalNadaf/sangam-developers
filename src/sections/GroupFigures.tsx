import { COMPANIES } from '@/data/group'
import { REGISTER_COUNTS, REGISTER_TOTALS } from '@/data/projects'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeader } from '@/components/SectionHeader'
import { Stagger, StaggerItem } from '@/components/Reveal'
import { useCountUp } from '@/hooks/useCountUp'

/**
 * The four readings, directly under the hero.
 *
 * Set on the tinted band rather than on a dark one. A second dark section
 * under a dark hero reads as the hero not having ended, and the page's own
 * rhythm is paper — the drafting tint is where this site puts a rail of
 * figures already, so this is the same band the company pages use for theirs.
 *
 * The four are picked to be four different units — a span of years, a sum of
 * money, a quantity of power, an area of land. Four counts of the same kind
 * of thing say much less than they appear to: the reader learns one fact four
 * times. How long, how much, how big and how much ground each answer a
 * different question about the same company.
 *
 * They are also picked to be figures worth setting at this size. An earlier
 * cut ran 35 projects and 14 named clients, which are true, are the register
 * exactly, and are the two weakest numbers on the page — a two-digit figure
 * at 80px reads as a company being modest about itself. Both facts survive as
 * the order book's own detail line, where they qualify the ₹ figure instead of
 * competing with it.
 *
 * There are no icons on these cards. An icon beside a figure has to stand for
 * a unit no pictogram actually carries — a plug is not a crore — so what sits
 * above each reading is the site’s own marker instead: the accent tick and
 * tracked label the `Eyebrow` draws everywhere else. It names the card,
 * carries its colour, and is the device the company profiles use themselves.
 *
 * Every value but the first is a live tally of `data/projects.ts`, so none of
 * them can drift away from the register they summarise — add a project and
 * this rail counts it, and counts its value. The first counts from the year
 * the older of the two companies was founded, so it advances on its own and
 * cannot go stale in the way a typed "10+" would.
 */

/** March 2016 — Sangam Developers, the older of the two. */
const FOUNDED = Math.min(...COMPANIES.map((c) => c.establishedYear))

interface Figure {
  /** Names the card, above the reading. Set in the accent. */
  category: string
  value: number
  /** Set hard against the front of the figure - the rupee on the order book. */
  prefix?: string
  /** Set hard against the end of it. Only the years reading carries one. */
  suffix?: string
  unit?: string
  label: string
  detail: string
  /**
   * The tick, the rule and the hover wash. `Eyebrow` darkens its own label
   * with `onTint`, so a light accent still clears AA on the tinted ground
   * without the value having to be pre-mixed here.
   */
  accent: string
}

/**
 * The currency mark.
 *
 * A rupee set at the figure’s own size and weight is not a prefix, it is a
 * fifth digit: Merriweather draws it full height, at 800, with a double bar
 * that carries as much ink as the 2 beside it. Half the size and back to a
 * regular weight puts it where a currency mark belongs — present, and
 * plainly not part of the number.
 *
 * `letterSpacing` is reset because `t-stat` runs at -0.045em to close up its
 * digits, and that tracking applies just as happily to the gap after the
 * mark, jamming it into the first figure. The margin then opens a real word
 * space that scales with the reading.
 */
const PREFIX_MARK: React.CSSProperties = {
  fontSize: '0.5em',
  fontWeight: 400,
  letterSpacing: '0',
  marginRight: '0.1em',
}
const FIGURES: Figure[] = [
  {
    category: 'Standing',
    value: new Date().getFullYear() - FOUNDED,
    suffix: '+',
    unit: 'years',
    label: 'Years in business',
    detail: `Sangam Developers opened in March ${FOUNDED}, and has worked every season since.`,
    accent: 'var(--color-brand)',
  },
  {
    category: 'Order book',
    value: REGISTER_TOTALS.contractCr,
    prefix: '₹',
    unit: 'Cr',
    label: 'Contracted to date',
    detail: `Across ${REGISTER_COUNTS.total} contracts for ${REGISTER_COUNTS.clients} named clients on the two registers.`,
    accent: 'var(--color-laterite)',
  },
  {
    category: 'Capacity',
    value: REGISTER_TOTALS.capacityMw,
    unit: 'MW',
    label: 'Renewable plant served',
    detail:
      'Solar and wind capacity our ground, civil and grid scopes have carried, delivered and in hand.',
    accent: 'var(--color-sre-deep)',
  },
  {
    category: 'Land',
    value: REGISTER_TOTALS.landAcres,
    unit: 'acres',
    label: 'Land developed',
    detail: 'Aggregated, levelled and NA-converted at the Kanamadi solar site.',
    accent: 'var(--color-ink)',
  },
]

export function GroupFigures() {
  return (
    <section className="section-y ground-tint band-bottom" aria-labelledby="figures-heading">
      <div className="shell">
        <SectionHeader
          id="figures-heading"
          eyebrow="The record so far"
          lines={['What the register adds up to.']}
        />

        <Stagger
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5 xl:grid-cols-4"
          each={0.09}
          delayChildren={0.05}
        >
          {FIGURES.map((figure) => (
            <StaggerItem key={figure.label}>
              <div className="h-full">
                <div className="card card-interactive group relative flex h-full flex-col overflow-hidden p-6 md:p-7">
                  {/* The card's own light. Off the pointer and behind the
                      content, so it never costs a click. */}
                  <span
                    className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 ease-out-expo group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle, color-mix(in srgb, ${figure.accent} 20%, transparent), transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative">
                    <Eyebrow accent={figure.accent}>{figure.category}</Eyebrow>

                    {/* A step above the shared `t-stat`, which is cut for the
                        company pages' narrower rail rather than for this one. */}
                    <p
                      className="t-stat mt-6 text-ink"
                      style={{ fontSize: 'clamp(4rem, 2.6vw + 2.2rem, 5.5rem)' }}
                    >
                      {/*
                        The reading is announced once, whole. The visible
                        figure changes many times a second while it counts,
                        and a screen reader following that is noise.
                      */}
                      <span className="sr-only">
                        {figure.prefix ?? ''}
                        {figure.value}
                        {figure.suffix ?? ''} {figure.unit ?? ''}
                      </span>
                      <span aria-hidden="true">
                        {figure.prefix && (
                          <span style={PREFIX_MARK}>{figure.prefix}</span>
                        )}
                        <Counter target={figure.value} />
                        {figure.suffix}
                      </span>
                      {figure.unit && (
                        <span className="t-label ml-2 text-muted" aria-hidden="true">
                          {figure.unit}
                        </span>
                      )}
                    </p>

                    {/* Rule between the reading and what it is a reading of.
                        The register prints its figures against a rule; so
                        does this. */}
                    <span className="mt-6 block h-px w-full bg-line" aria-hidden="true" />

                    <p className="t-h3 mt-6 text-ink">{figure.label}</p>
                    <p className="t-small mt-2 text-muted">{figure.detail}</p>
                  </div>

                  {/* Pinned to the foot so the rules line up across the
                      row whatever length the detail lines run to. */}
                  <div className="relative mt-auto pt-7">
                    <span
                      className="block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.4]"
                      style={{ background: figure.accent }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/**
 * A figure that counts up on first sight.
 *
 * `useCountUp` renders the final value immediately under reduced motion, so
 * the number is never withheld from anyone who asked for less movement.
 */
function Counter({ target }: { target: number }) {
  const { ref, value } = useCountUp(target, 1600)
  return <span ref={ref}>{value}</span>
}
