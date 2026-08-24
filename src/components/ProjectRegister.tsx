import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PROJECTS, DISCIPLINES, type Discipline, type Project } from '@/data/projects'
import { COMPANIES, companyByKey, type CompanyKey } from '@/data/group'
import { EASE_OUT } from '@/lib/motion'
import { useReveal } from '@/hooks/useReveal'
import { Media } from './Media'

type Filter = 'all' | CompanyKey

/**
 * The project register.
 *
 * Both source profiles present their work as a numbered schedule —
 * description, client, duration, value, status — so the site does too. A
 * schedule is the format the people who commission this work already read,
 * and it puts the evidence in front of the claim rather than behind a card.
 *
 * On desktop it is a real table inside a single raised panel. On small
 * screens it becomes a stack of spec cards, because a seven-column table on a
 * phone is a table nobody reads.
 *
 * Pass `rows` when the page already owns the filtering — the projects page
 * does, and two filter bars stacked on one screen is worse than none.
 */
export function ProjectRegister({
  company,
  showCompanyFilter = true,
  rows: given,
}: {
  /** Lock the register to one company and hide the company filter. */
  company?: CompanyKey
  showCompanyFilter?: boolean
  /** Pre-filtered rows. Supplying these hides the internal filter bar. */
  rows?: Project[]
}) {
  const [filter, setFilter] = useState<Filter>(company ?? 'all')
  const [discipline, setDiscipline] = useState<Discipline | 'all'>('all')

  const rows = useMemo(() => {
    if (given) return [...given].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id))
    const base = company ? PROJECTS.filter((p) => p.company === company) : PROJECTS
    return base
      .filter((p) => (filter === 'all' ? true : p.company === filter))
      .filter((p) => (discipline === 'all' ? true : p.discipline === discipline))
      .sort((a, b) => b.year - a.year || a.id.localeCompare(b.id))
  }, [company, filter, discipline, given])

  const total = company ? PROJECTS.filter((p) => p.company === company).length : PROJECTS.length

  return (
    <div>
      {/* Filters — omitted when the page above already owns them */}
      <div
        className={`flex-col gap-6 rounded-card border border-line bg-paper p-5 shadow-soft md:p-6 lg:flex-row lg:items-end lg:justify-between ${
          given ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex flex-wrap gap-x-9 gap-y-5">
          {showCompanyFilter && !company && (
            <FilterGroup label="Company">
              <Chip on={filter === 'all'} onClick={() => setFilter('all')}>
                All
              </Chip>
              {COMPANIES.map((c) => (
                <Chip
                  key={c.key}
                  on={filter === c.key}
                  accent={c.accentOnBone}
                  onClick={() => setFilter(c.key)}
                >
                  {c.name.replace('Sangam ', '')}
                </Chip>
              ))}
            </FilterGroup>
          )}

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

        <p
          className="t-data shrink-0 rounded-chip bg-canvas-2 px-4 py-2 text-muted"
          role="status"
          aria-live="polite"
        >
          {rows.length} of {total} entries
        </p>
      </div>

      {/* Desktop: schedule */}
      <div className="hidden mt-5 overflow-hidden rounded-card border border-line bg-paper shadow-soft lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Project register with description, client, scale, contract value, duration and status
          </caption>
          <thead>
            <tr className="border-b border-line bg-canvas-2">
              <Th className="w-28 pl-6">Ref</Th>
              <Th>Description</Th>
              <Th className="w-56">Client</Th>
              <Th className="w-36">Scale</Th>
              <Th className="w-28">Value</Th>
              <Th className="w-40">Duration</Th>
              <Th className="w-40 pr-6">Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((project, i) => (
              <Row key={project.id} project={project} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Small screens: spec cards */}
      <ul className="mt-5 grid gap-4 lg:hidden">
        {rows.map((project, i) => (
          <SpecCard key={project.id} project={project} index={i} />
        ))}
      </ul>

      {rows.length === 0 && (
        <p className="t-body mt-5 rounded-card border border-line bg-paper py-16 text-center text-muted">
          No entries match that combination. Clear a filter to see more.
        </p>
      )}
    </div>
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
        on ? 'text-white shadow-soft' : 'border-line bg-canvas text-muted hover:border-line-2 hover:text-ink'
      }`}
      style={on ? { background: accent, borderColor: accent } : undefined}
    >
      {children}
    </button>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th scope="col" className={`py-4 pr-5 t-label align-bottom text-muted ${className}`}>
      {children}
    </th>
  )
}

function Row({ project, index }: { project: Project; index: number }) {
  const company = companyByKey(project.company)
  const reveal = useReveal({ opacity: 0, y: 14 })

  return (
    <motion.tr
      className="group border-b border-line align-top transition-colors duration-300 last:border-0 hover:bg-canvas-2"
      {...reveal}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.035, ease: EASE_OUT }}
    >
      <td className="py-5 pr-5 pl-6">
        <span
          className="t-data rounded-chip px-2.5 py-1 whitespace-nowrap"
          style={{
            color: company.accentOnBone,
            background: `color-mix(in srgb, ${company.accent} 11%, transparent)`,
          }}
        >
          {project.id}
        </span>
      </td>
      <td className="py-5 pr-5">
        <div className="flex gap-4">
          {/* The slot is always reserved, so descriptions stay on one axis
              whether or not a site photograph exists for that entry. */}
          <span
            className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-tile bg-canvas-3 xl:block"
            style={
              project.image
                ? undefined
                : { background: 'transparent', border: '1px solid var(--color-line)' }
            }
          >
            {project.image ? (
              <Media
                src={project.image}
                sizes="56px"
                alt=""
                className="transition-transform duration-700 ease-out-expo group-hover:scale-110"
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center t-label text-muted"
                aria-hidden="true"
              >
                {project.id}
              </span>
            )}
          </span>
          <span className="min-w-0">
            <span className="t-body block font-bold text-ink">{project.title}</span>
            <span className="t-small mt-1 block text-muted">
              {project.discipline}
              {project.location ? ` · ${project.location}` : ''}
            </span>
          </span>
        </div>
      </td>
      <td className="py-5 pr-5 t-small text-body">{project.client}</td>
      <td className="py-5 pr-5 t-data text-ink">{project.scale ?? 'Not recorded'}</td>
      <td className="py-5 pr-5 t-data text-ink">{project.value ?? 'Not recorded'}</td>
      <td className="py-5 pr-5 t-data text-muted">{project.duration}</td>
      <td className="py-5 pr-6">
        <StatusTag project={project} />
      </td>
    </motion.tr>
  )
}

function SpecCard({ project, index }: { project: Project; index: number }) {
  const company = companyByKey(project.company)
  const reveal = useReveal({ opacity: 0, y: 26 })

  return (
    <motion.li
      className="card card-interactive p-5 md:p-6"
      {...reveal}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: EASE_OUT }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="t-data rounded-chip px-2.5 py-1"
          style={{
            color: company.accentOnBone,
            background: `color-mix(in srgb, ${company.accent} 11%, transparent)`,
          }}
        >
          {project.id}
        </span>
        <StatusTag project={project} />
      </div>

      <h3 className="t-h3 mt-4 text-ink">{project.title}</h3>
      <p className="t-small mt-1.5 text-muted">
        {project.discipline}
        {project.location ? ` · ${project.location}` : ''}
      </p>

      {/* Two columns on a phone, six across on a tablet — a wide card with a
          two-column list leaves half the row empty. */}
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 rounded-tile bg-canvas p-4 sm:grid-cols-6">
        <Spec label="Client" value={project.client} span />
        <Spec label="Scale" value={project.scale ?? 'Not recorded'} />
        <Spec label="Value" value={project.value ?? 'Not recorded'} />
        <Spec label="Duration" value={project.duration} />
        <Spec label="Company" value={company.name} span />
      </dl>
    </motion.li>
  )
}

function Spec({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : 'sm:col-span-1'}>
      <dt className="t-label text-muted">{label}</dt>
      <dd className="t-data mt-1.5 text-ink">{value}</dd>
    </div>
  )
}

/** Delivered work reads in the company accent; live work in the site-earth orange. */
function StatusTag({ project }: { project: Project }) {
  const done = project.status === 'Commissioned' || project.status === 'Completed'
  const color = done ? companyByKey(project.company).accentOnBone : 'var(--color-laterite)'

  return (
    <span
      className="inline-flex items-center gap-2 t-label whitespace-nowrap"
      style={{ color }}
    >
      <span
        className="block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
      {project.status}
    </span>
  )
}
