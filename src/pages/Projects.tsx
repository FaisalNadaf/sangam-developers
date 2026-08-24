import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, Rows3, Search, X } from 'lucide-react'
import { PageTransition } from '@/components/PageTransition'
import { Seo, breadcrumb } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { SectionHeader } from '@/components/SectionHeader'
import { ProjectRegister } from '@/components/ProjectRegister'
import { ProjectCard } from '@/components/cards'
import { Reveal } from '@/components/Reveal'
import { LinkButton } from '@/components/Button'
import { CallToAction } from '@/sections/CallToAction'
import { COMPANIES, type CompanyKey } from '@/data/group'
import { DISCIPLINES, PROJECTS, REGISTER_COUNTS, type Discipline } from '@/data/projects'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Sangam Group project register',
  numberOfItems: PROJECTS.length,
  itemListElement: PROJECTS.map((project, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CreativeWork',
      name: project.title,
      about: project.discipline,
      dateCreated: String(project.year),
      locationCreated: project.location
        ? { '@type': 'Place', name: project.location }
        : undefined,
      provider: {
        '@type': 'Organization',
        name: COMPANIES.find((c) => c.key === project.company)!.legalName,
      },
    },
  })),
}

type View = 'gallery' | 'schedule'
type Filter = 'all' | CompanyKey

/** `?company=developers` and `?company=renewables` open the page pre-filtered. */
const companyFromUrl = (value: string | null): Filter =>
  COMPANIES.some((c) => c.key === value) ? (value as CompanyKey) : 'all'

export default function Projects() {
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<View>('gallery')

  /*
    The company pages link straight here with their own register showing, so
    the filter starts from the URL rather than always from 'all'. It is read
    once, as the initial value: after that the chips own it, and a reader who
    clears the filter should not have it put back by the address bar.
  */
  const [company, setCompany] = useState<Filter>(() => companyFromUrl(params.get('company')))
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all')
  const [query, setQuery] = useState('')

  /* Chips drive the URL as well as the state, so a filtered view can be
     shared or reloaded and comes back the same. `replace` keeps the back
     button pointing at the page the reader arrived from, not at every filter
     they tried on the way. */
  const pickCompany = (next: Filter) => {
    setCompany(next)
    const q = new URLSearchParams(params)
    if (next === 'all') q.delete('company')
    else q.set('company', next)
    setParams(q, { replace: true })
  }

  // The gallery leads with the entries that carry a photograph, because a
  // card with no picture is the weakest thing on the page.
  const cards = useMemo(() => {
    // Search the fields a reader would actually type into it: the title, the
    // register description as printed, the client, the place and the scale.
    const needle = query.trim().toLowerCase()
    const matches = (p: (typeof PROJECTS)[number]) =>
      !needle ||
      [p.title, p.source, p.client, p.location, p.scale, p.discipline, p.status]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle))

    return PROJECTS.filter((p) => (company === 'all' ? true : p.company === company))
      .filter((p) => (discipline === 'all' ? true : p.discipline === discipline))
      .filter(matches)
      .sort(
        (a, b) =>
          Number(Boolean(b.image)) - Number(Boolean(a.image)) ||
          b.year - a.year ||
          a.id.localeCompare(b.id),
      )
  }, [company, discipline, query])

  return (
    <PageTransition>
      <Seo
        title="Projects: Sangam Group of Companies"
        description={`All ${REGISTER_COUNTS.total} Sangam Group projects with client, scale, contract value, duration and status, from ${REGISTER_COUNTS.earliestYear} onward.`}
        path="/projects"
        image="/media/developers/conductor-stringing-1280.webp"
        schema={[schema, breadcrumb([{ name: 'Projects', path: '/projects' }])]}
      />

      <PageHeader
        eyebrow="Projects"
        lines={['Everything on the books.']}
        intro={`${REGISTER_COUNTS.total} entries with client, scale, contract value, duration and status, exactly as the two companies recorded them.`}
        image="developers/tower-erection"
        imageAlt="Crane erecting a steel transmission structure on a Sangam Developers project"
      >
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {[
            { value: REGISTER_COUNTS.delivered, label: 'Delivered' },
            { value: REGISTER_COUNTS.active, label: 'Live or in hand' },
            { value: REGISTER_COUNTS.clients, label: 'Clients' },
          ].map((fact) => (
            <span key={fact.label} className="flex items-baseline gap-2">
              <span className="t-figure text-2xl text-white">
                {fact.value}
              </span>
              <span className="t-label text-muted-inv">{fact.label}</span>
            </span>
          ))}
        </div>
      </PageHeader>

      {/* ── Gallery / schedule ────────────────────────────────────────── */}
      <section className="section-y ground-paper" aria-labelledby="register-heading">
        <div className="shell">
          <SectionHeader
            id="register-heading"
            eyebrow="The register"
            lines={['Search, or filter the register.']}
            intro={
              <p>
                {REGISTER_COUNTS.developers} entries from Sangam Developers and{' '}
                {REGISTER_COUNTS.renewables} from Sangam Renewables &amp;
                Electrosystems LLP. Contract values are printed as recorded, in lakh
                and crore, and are never totalled.
              </p>
            }
            align="wide"
          />

          {/* Controls */}
          <Reveal className="mt-10">
            <div className="flex flex-col gap-6 rounded-card border border-line bg-paper p-5 shadow-soft md:p-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-wrap gap-x-9 gap-y-5">
                <FilterGroup label="Company">
                  <Chip on={company === 'all'} onClick={() => pickCompany('all')}>
                    All
                  </Chip>
                  {COMPANIES.map((c) => (
                    <Chip
                      key={c.key}
                      on={company === c.key}
                      accent={c.accentOnBone}
                      onClick={() => pickCompany(c.key)}
                    >
                      {c.name.replace('Sangam ', '')}
                    </Chip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Discipline">
                  <Chip on={discipline === 'all'} onClick={() => setDiscipline('all')}>
                    All
                  </Chip>
                  {DISCIPLINES.map((d) => (
                    <Chip key={d} on={discipline === d} onClick={() => setDiscipline(d)}>
                      {d}
                    </Chip>
                  ))}
                </FilterGroup>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative min-w-56 flex-1 lg:min-w-64">
                  <label htmlFor="project-search" className="sr-only">
                    Search the register
                  </label>
                  <Search
                    className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <input
                    id="project-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Client, place, kV, MW…"
                    className="w-full rounded-chip border border-line bg-canvas py-2.5 pr-10 pl-11 t-small text-ink transition-[border-color,background-color] duration-300 placeholder:text-muted focus:border-brand focus:bg-paper focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:bg-canvas-2 hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  )}
                </div>
                <p
                  className="t-data shrink-0 rounded-chip bg-canvas-2 px-4 py-2 text-muted"
                  role="status"
                  aria-live="polite"
                >
                  {cards.length} of {REGISTER_COUNTS.total}
                </p>
                <div
                  className="flex shrink-0 gap-1 rounded-chip border border-line bg-canvas p-1"
                  role="group"
                  aria-label="View"
                >
                  <ViewButton
                    on={view === 'gallery'}
                    onClick={() => setView('gallery')}
                    label="Gallery view"
                    icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.75} />}
                  />
                  <ViewButton
                    on={view === 'schedule'}
                    onClick={() => setView('schedule')}
                    label="Schedule view"
                    icon={<Rows3 className="h-4 w-4" strokeWidth={1.75} />}
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {view === 'gallery' ? (
            <>
              <ul
                key={`${company}-${discipline}-${query}`}
                className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {cards.map((project, i) => (
                  <Reveal as="li" key={project.id} delay={(i % 3) * 0.08}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </ul>

              {cards.length === 0 && (
                <p className="mt-8 rounded-card border border-line bg-paper py-16 text-center t-body text-muted">
                  No entries match that {query ? 'search' : 'combination'}. Clear a filter or the
                  search to see more.
                </p>
              )}
            </>
          ) : (
            <div className="mt-8">
              {/* The schedule is the format the people who commission this work
                  already read, so it stays available alongside the gallery. */}
              <ProjectRegister showCompanyFilter={false} rows={cards} />
            </div>
          )}

          <Reveal className="mt-10 rounded-card bg-canvas-2 px-6 py-6 md:px-8">
            <p className="t-small max-w-3xl text-muted">
              Statuses are as published: <em className="not-italic text-ink">Commissioned</em> and{' '}
              <em className="not-italic text-ink">Completed</em> mark delivered work;{' '}
              <em className="not-italic text-ink">In Progress</em>,{' '}
              <em className="not-italic text-ink">90% Completed</em> and{' '}
              <em className="not-italic text-ink">In Hand</em> mark work that is live or awarded.
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/developers" variant="outline" size="md" accent="var(--color-sd-deep)">
              Sangam Developers scope
            </LinkButton>
            <LinkButton to="/renewables" variant="outline" size="md" accent="var(--color-sre-deep)">
              Sangam Renewables scope
            </LinkButton>
          </Reveal>
        </div>
      </section>

      <CallToAction
        eyebrow="Next project"
        lines={['Add one to the register.']}
        body="Send the site and the scope. We will come back with the nearest comparable job on this list."
        image="developers/row-corridor"
      />
    </PageTransition>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="t-label mb-3 text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  children,
  on,
  onClick,
  accent = 'var(--color-brand)',
}: {
  children: React.ReactNode
  on: boolean
  onClick: () => void
  accent?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-chip border px-4 py-2 t-label transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
        on
          ? 'text-white shadow-soft'
          : 'border-line bg-canvas text-muted hover:border-line-2 hover:text-ink'
      }`}
      style={on ? { background: accent, borderColor: accent } : undefined}
    >
      {children}
    </button>
  )
}

function ViewButton({
  on,
  onClick,
  label,
  icon,
}: {
  on: boolean
  onClick: () => void
  label: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${
        on ? 'bg-brand text-white' : 'text-muted hover:bg-canvas-2 hover:text-ink'
      }`}
    >
      {icon}
    </button>
  )
}
