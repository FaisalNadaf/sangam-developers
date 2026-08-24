import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { COMPANIES, type CompanyKey } from '@/data/group'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'
import { Mark } from '@/components/Mark'
import { Media } from '@/components/Media'

/**
 * The two companies, as the group's two halves.
 *
 * A shallow photographic head carrying only the mark, the founding date and
 * the name, then the record on paper beneath it. Nothing that has to be *read*
 * sits on the photograph: a figure set over a picture is always a compromise
 * between seeing the picture and reading the figure, and the readings here —
 * how many jobs, how many certificates, which town — are the reason anyone
 * looks at this section at all.
 *
 * The two panels are deliberately the same shape — they are peers, not a
 * parent and a subsidiary — and differ only in accent and photograph.
 *
 * Both panels carry the registered name, including the one that trades under
 * it unchanged. Printing it only where it differed saved a line on one card
 * and cost a hole on the other: the foot is anchored with `mt-auto` to keep
 * the two buttons on one line, so a shorter body opened as blank card rather
 * than as a tighter block. Same line on both, and the two now stand level
 * without the anchor having to do anything.
 *
 * `mt-auto` stays all the same — it costs nothing when the blocks match and
 * still holds the buttons level if a role line wraps to three at some width.
 *
 * The whole panel is the link. The button is the one real anchor and it
 * stretches an overlay across the card, so there is a single tab stop and a
 * single accessible name rather than a card wrapped in one link with another
 * nested inside it.
 */

const PLATE: Record<CompanyKey, { image: string; alt: string }> = {
  developers: {
    image: 'developers/substation-lattice',
    alt: 'Lattice tower and switchyard gantry at an EHV substation built by Sangam Developers',
  },
  renewables: {
    image: 'renewables/solar-field-wide',
    alt: 'Wide row of ground-mounted solar modules on a Sangam Renewables project site',
  },
}

export function Divisions() {
  return (
    <section className="section-y ground-paper band-bottom" aria-labelledby="divisions-heading">
      <div className="shell">
        <SectionHeader
          id="divisions-heading"
          eyebrow="The group"
          lines={['One group, two companies.']}
        />

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-7">
          {COMPANIES.map((company, i) => {
            const plate = PLATE[company.key]

            return (
              <Reveal key={company.key} direction={i === 0 ? 'left' : 'right'} delay={i * 0.08}>
                <div className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-plate border border-line bg-paper shadow-card transition-[box-shadow,border-color] duration-500 ease-out-expo hover:shadow-lift focus-within:border-line-2 focus-within:shadow-lift">
                    {/* ── Head: the photograph, and only what belongs on it ── */}
                    <div className="relative h-60 shrink-0 overflow-hidden bg-canvas-3 sm:h-64 md:h-80">
                      <Media
                        src={plate.image}
                        alt={plate.alt}
                        sizes="(min-width: 1024px) 46vw, 94vw"
                        className="transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                      />
                      {/*
                        The accent is spent at the foot, where the name is set,
                        and let go by roughly two-thirds up. Carrying it to the
                        top of the frame — which it used to — put a 40% wash of
                        company colour over the whole photograph, and a green
                        switchyard or a blue solar field reads as a colour cast
                        rather than as a site.
                      */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, color-mix(in srgb, ${company.accentOnBone} 55%, #06110c) 0%, color-mix(in srgb, ${company.accentOnBone} 48%, transparent) 26%, color-mix(in srgb, ${company.accentOnBone} 12%, transparent) 44%, transparent 68%)`,
                        }}
                        aria-hidden="true"
                      />
                      {/* A short head scrim so the date pill has ground under
                          it whatever the sky is doing behind it. */}
                      <div
                        className="absolute inset-x-0 top-0 h-28"
                        style={{
                          background:
                            'linear-gradient(to bottom, rgba(6,17,12,0.36) 0%, transparent 100%)',
                        }}
                        aria-hidden="true"
                      />

                      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6">
                        <span className="flex h-13 items-center rounded-tile bg-white/95 px-3 shadow-lift transition-transform duration-500 ease-spring group-hover:scale-105">
                          <Mark
                            name={company.mark}
                            alt={`${company.name} logo`}
                            height={28}
                            optical
                          />
                        </span>
                        <span className="rounded-chip border border-white/25 bg-white/10 px-3.5 py-1.5 t-label text-white/90 backdrop-blur-md">
                          Est. {company.established}
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <p
                          className="t-label"
                          style={{
                            color: `color-mix(in srgb, ${company.accent} 30%, white)`,
                            textShadow: '0 1px 8px rgba(6,17,12,0.55)',
                          }}
                        >
                          {company.tagline}
                        </p>
                        <h3 className="t-h2 mt-2 text-white">{company.name}</h3>
                      </div>
                    </div>

                    {/* ── Record: everything that has to be read, on paper ── */}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <p className="t-data text-muted">
                        {company.legalName}
                        {/*
                          "Sangam Renewables & Electrosystems LLP" already says
                          what it is; "Sangam Developers" does not, and printed
                          alone it only repeats the name on the photograph above
                          it. The form is what makes the line worth its space on
                          both panels.
                        */}
                        {!company.legalName.endsWith('LLP') && (
                          <span> · {company.constitution}</span>
                        )}
                      </p>

                      <p className="t-body mt-3 text-body">{company.role}</p>

                      <div className="mt-auto pt-7">
                        <Link
                          to={company.path}
                          className="inline-flex w-fit items-center gap-2.5 rounded-chip px-5 py-3 font-sans text-[0.9375rem] font-bold text-white shadow-soft transition-[transform,box-shadow,filter] duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:shadow-card group-hover:brightness-110 active:translate-y-0"
                          style={{ background: company.accentOnBone }}
                        >
                          Open {company.name}
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-400 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          {/* Stretches this one anchor over the whole panel. */}
                          <span className="absolute inset-0 rounded-plate" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
