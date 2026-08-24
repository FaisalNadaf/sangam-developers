import { Link } from 'react-router-dom'
import { ArrowUpRight, HardHat, Layers, MapPin, ShieldCheck, Users } from 'lucide-react'
import { COMPANIES } from '@/data/group'
import { DISCIPLINES, REGISTER_COUNTS, projectsFor } from '@/data/projects'
import { CERTIFICATIONS } from '@/data/certifications'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { useCountUp } from '@/hooks/useCountUp'

/**
 * The register, in numbers.
 *
 * Every figure is a live tally of `data/projects.ts`, `data/certifications.ts`
 * or `data/group.ts`, so none of them can drift away from the records they
 * summarise — add a project and this section counts it.
 *
 * The composition is deliberately not four equal boxes. The register total is
 * the number that answers "how big are they", so it gets its own panel and
 * carries the delivered-versus-live split as a bar; the rest are supporting
 * readings and are sized like it. Four identical tiles gave a 35-project firm
 * and a 4-certificate fact the same visual weight, which is not what either
 * of them means.
 */

const SUPPORTING = [
  {
    value: REGISTER_COUNTS.clients,
    label: 'Named clients',
    detail: 'Manufacturers, IPPs and state utilities',
    icon: <Users className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />,
    accent: 'var(--color-sd-deep)',
  },
  {
    value: DISCIPLINES.length,
    label: 'Disciplines',
    detail: 'Land through to energisation, under one contract',
    icon: <Layers className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />,
    accent: 'var(--color-sre-deep)',
  },
  {
    value: CERTIFICATIONS.length,
    label: 'ISO certificates',
    detail: '9001 and 45001, current on both companies',
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />,
    accent: 'var(--color-brand)',
  },
  {
    value: COMPANIES.length,
    label: 'Companies',
    detail: 'Either side of the Maharashtra–Karnataka border',
    icon: <MapPin className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />,
    accent: 'var(--color-laterite)',
  },
]

export function Stats() {
  const { total, delivered, active, earliestYear } = REGISTER_COUNTS
  const deliveredPct = Math.round((delivered / total) * 100)

  return (
    <section className="section-y ground-paper band-bottom" aria-labelledby="stats-heading">
      <div className="shell">
        <h2 id="stats-heading" className="sr-only">
          Sangam Group by the numbers
        </h2>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* ── The register total ──────────────────────────────────── */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="h-full">
              <Link
                to="/projects"
                className="card card-interactive group relative flex h-full flex-col overflow-hidden p-7 md:p-9"
              >
                <span
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-70 blur-3xl transition-transform duration-1000 ease-out-expo group-hover:scale-125"
                  style={{
                    background:
                      'radial-gradient(circle, color-mix(in srgb, var(--color-brand-bright) 22%, transparent), transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                <div className="relative">
                  <span
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
                    style={{
                      background: 'color-mix(in srgb, var(--color-brand) 12%, transparent)',
                      color: 'var(--color-brand)',
                    }}
                  >
                    <HardHat className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
                  </span>

                  <p className="t-figure text-7xl text-ink md:text-8xl">
                    <Counter target={total} />
                  </p>
                  <p className="t-h3 mt-4 text-ink">Projects on the register</p>
                  <p className="t-body mt-2.5 max-w-sm text-muted">
                    Every job both companies have taken since {earliestYear}, published with its
                    client, scale, value and status.
                  </p>
                </div>

                {/* How the register divides between the two companies. This
                    is the space the big figure would otherwise leave empty,
                    and the split is the one thing a reader asks next. */}
                <ul className="relative mt-7 grid gap-2.5">
                  {COMPANIES.map((c) => {
                    const n = projectsFor(c.key).length
                    return (
                      <li key={c.key} className="flex items-center gap-3.5">
                        <span className="t-label w-40 shrink-0 truncate text-muted">{c.name}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-canvas-3">
                          <span
                            className="block h-full rounded-pill"
                            style={{ width: `${(n / total) * 100}%`, background: c.accent }}
                          />
                        </span>
                        <span className="t-data w-6 shrink-0 text-right text-ink">{n}</span>
                      </li>
                    )
                  })}
                </ul>

                {/* Delivered against live, drawn from the same tally. */}
                <div className="relative mt-auto pt-7">
                  <div
                    className="flex h-2 w-full overflow-hidden rounded-pill bg-canvas-3"
                    role="img"
                    aria-label={`${delivered} of ${total} entries delivered, ${active} live or in hand`}
                  >
                    <span
                      className="h-full rounded-pill transition-[width] duration-1000 ease-out-expo"
                      style={{ width: `${deliveredPct}%`, background: 'var(--color-brand)' }}
                    />
                    <span
                      className="h-full flex-1 rounded-pill"
                      style={{ background: 'var(--color-laterite)' }}
                    />
                  </div>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2.5">
                    <span className="t-label flex items-center gap-2 text-muted">
                      <span
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--color-brand)' }}
                        aria-hidden="true"
                      />
                      {delivered} delivered
                    </span>
                    <span className="t-label flex items-center gap-2 text-muted">
                      <span
                        className="block h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--color-laterite)' }}
                        aria-hidden="true"
                      />
                      {active} live or in hand
                    </span>
                    <span className="t-label inline-flex items-center gap-1.5 text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                      Open the register
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </Reveal>

          {/* ── Supporting readings ─────────────────────────────────── */}
          <Stagger
            className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5"
            each={0.08}
            delayChildren={0.1}
          >
            {SUPPORTING.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="h-full">
                  <div className="card card-interactive group flex h-full flex-col p-6 md:p-7">
                    <span
                      className="mb-5 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
                      style={{
                        background: `color-mix(in srgb, ${stat.accent} 12%, transparent)`,
                        color: stat.accent,
                      }}
                    >
                      {stat.icon}
                    </span>
                    <div>
                      <p className="t-figure text-5xl text-ink">
                        <Counter target={stat.value} />
                      </p>
                      <p className="t-h3 mt-3 text-ink">{stat.label}</p>
                      <p className="t-small mt-2 text-muted">{stat.detail}</p>
                    </div>
                    <span
                      className="mt-auto block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.4]"
                      style={{ background: stat.accent, marginTop: '1.5rem' }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
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
  const { ref, value } = useCountUp(target, 1500)
  return <span ref={ref}>{value}</span>
}
