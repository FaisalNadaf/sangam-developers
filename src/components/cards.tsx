import { ArrowUpRight, MapPin } from 'lucide-react'
import type { Project } from '@/data/projects'
import { companyByKey, type Person } from '@/data/group'
import type { MarkKey } from '@/data/logos'
import { Mark } from './Mark'
import { Media } from './Media'

/**
 * The card family.
 *
 * One surface recipe (`card` + `card-interactive`), one hover language — lift,
 * deepen the shadow, zoom the photograph, step the arrow — reused for every
 * kind of record the site publishes. Keeping them in one file is what stops
 * the pages drifting apart.
 */

/* ── Project ──────────────────────────────────────────────────────────── */

export function ProjectCard({ project }: { project: Project }) {
  const company = companyByKey(project.company)
  const done = project.status === 'Commissioned' || project.status === 'Completed'

  return (
    <div className="h-full">
      <article className="card card-interactive group flex h-full flex-col overflow-hidden">
        <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-canvas-3">
          {project.image ? (
            <Media
              src={project.image}
              alt={`${project.title}, ${project.discipline} work for ${project.client}`}
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 88vw"
              className="transition-transform duration-1000 ease-out-expo group-hover:scale-108"
            />
          ) : (
            // No photograph on the register for this entry, so the slot carries
            // the reference instead of an empty grey box.
            <div className="grid-field flex h-full w-full items-center justify-center bg-canvas-2">
              <span className="t-figure text-4xl text-line-2">{project.id}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-deep/85 via-deep/15 to-deep/45" />

          {/* Reference and status, set as type on the photograph. Read against
              the scrim above, with a shadow for the frames that are bright at
              the top — a filled capsule for each would put two stickers on
              every card in a 35-card grid. */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <span className="t-label text-white/85 [text-shadow:0_1px_6px_rgba(5,16,11,0.6)]">
              {project.id}
            </span>
            <span className="inline-flex items-center gap-2 t-label text-white [text-shadow:0_1px_6px_rgba(5,16,11,0.6)]">
              <span
                className="block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: done ? company.accent : 'var(--color-laterite)' }}
                aria-hidden="true"
              />
              {project.status}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p
              className="t-label"
              style={{ color: `color-mix(in srgb, ${company.accent} 65%, white)` }}
            >
              {project.discipline}
            </p>
            <h3 className="t-h3 mt-2 text-white">{project.title}</h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          {project.location && (
            <p className="t-small flex items-center gap-1.5 text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {project.location}
            </p>
          )}

          <p className="t-small mt-3 line-clamp-3 text-body">{project.source}</p>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <Spec label="Client" value={project.client} />
            <Spec label="Scale" value={project.scale ?? 'Not recorded'} />
            <Spec label="Value" value={project.value ?? 'Not recorded'} />
          </dl>

          <p className="mt-auto pt-5 t-label" style={{ color: company.accentOnBone }}>
            {company.name} · {project.duration}
          </p>
        </div>
      </article>
    </div>
  )
}

/**
 * One cell of the three-up spec row.
 *
 * Values wrap rather than truncate. Some clients are registered under long
 * names — "JSW Renew Energy Nine Limited" — and an ellipsis in the client
 * column of a project card hides exactly the fact the column exists to state.
 */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="t-label text-muted">{label}</dt>
      <dd className="t-data mt-1 text-ink [overflow-wrap:anywhere]">{value}</dd>
    </div>
  )
}

/* ── Statistic ────────────────────────────────────────────────────────── */

export function StatCard({
  value,
  label,
  detail,
  icon,
  accent = 'var(--color-brand)',
}: {
  value: React.ReactNode
  label: string
  detail?: string
  icon?: React.ReactNode
  accent?: string
}) {
  return (
    <div className="h-full">
      <div className="card card-interactive group flex h-full flex-col p-6 md:p-7">
        {icon && (
          <span
            className="mb-5 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
            style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}
          >
            {icon}
          </span>
        )}
        <div>
          <p className="t-figure text-4xl text-ink md:text-5xl">
            {value}
          </p>
          <p className="t-label mt-3 text-muted">{label}</p>
          {detail && <p className="t-small mt-2.5 text-muted">{detail}</p>}
        </div>
        <span
          className="mt-auto block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.4]"
          style={{ background: accent, marginTop: '1.5rem' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

/* ── Client ───────────────────────────────────────────────────────────── */

/** Initials, for the two clients whose profiles published no mark to cut. */
const monogram = (name: string) =>
  name
    .replace(/\(.*\)/, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/**
 * A client, as a card.
 *
 * The mark leads, because that is what a visitor scanning for a name they
 * recognise is actually looking for. Marks sit in a fixed-height well so a
 * 6:1 wordmark and a square roundel carry the same optical weight, and they
 * are held at reduced saturation until hover so a wall of twelve different
 * brand palettes does not fight the page.
 */
export function ClientCard({
  name,
  logo,
  companies,
  projectCount,
}: {
  name: string
  logo?: MarkKey
  companies: { name: string; accent: string; accentOnBone: string }[]
  projectCount: number
}) {
  return (
    <div className="h-full">
      <div className="card card-interactive group flex h-full flex-col p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-16 min-w-13 items-center justify-start">
            {logo ? (
              <Mark
                name={logo}
                alt={`${name} logo`}
                height={38}
                optical
                className="max-w-[10rem] transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
              />
            ) : (
              <span
                className="flex h-13 w-13 items-center justify-center rounded-tile bg-canvas-2 font-display text-lg font-bold text-ink transition-[background-color,color,transform] duration-500 ease-spring group-hover:scale-105 group-hover:bg-brand-tint group-hover:text-brand"
                aria-hidden="true"
              >
                {monogram(name)}
              </span>
            )}
          </span>
          <span className="flex shrink-0 gap-1.5 pt-1.5">
            {companies.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="block h-2.5 w-2.5 rounded-full transition-transform duration-400 ease-spring group-hover:scale-125"
                style={{ background: c.accent }}
              />
            ))}
          </span>
        </div>

        <h3 className="t-h3 mt-5 mb-4 text-ink">{name}</h3>

        {/*
          Some clients are named in the profiles' own client pages without
          being the contracting party on any register row. Printing "0" for
          those would contradict the page they sit on.
        */}
        <p className="mt-auto border-t border-line pt-4 t-data text-muted">
          {projectCount > 0
            ? `${projectCount} ${projectCount === 1 ? 'entry' : 'entries'} on the register`
            : 'Named in the client register'}
        </p>
      </div>
    </div>
  )
}

/* ── Team member ──────────────────────────────────────────────────────── */

/**
 * A partner, presented as a mounted print.
 *
 * The section this sits in is a white ground, and a white card on white paper
 * is only as good as its rule — so this one is built around the rule rather
 * than around a shadow. The portrait is inset from the card's edge, which
 * gives that rule something to hold, and the rule takes the person's own
 * company colour on hover, through `--frame`.
 *
 * The colour key under the portrait is the load-bearing part: the man who
 * holds a role in both companies carries two segments where everyone else
 * carries one, so the group's connective tissue is visible in the grid before
 * anyone reads a word of it.
 */
export function TeamCard({
  person,
  companies,
}: {
  person: Person
  companies: { key: string; name: string; accent: string; accentOnBone: string }[]
}) {
  const roles = person.roles.map((role) => ({
    title: role.title,
    company: companies.find((c) => c.key === role.company)!,
  }))

  /** First and last initial — what stands in for a portrait that is not in yet. */
  const parts = person.name.split(' ').filter(Boolean)
  const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ''))
    .toUpperCase()

  return (
    <div className="h-full">
      <figure
        className="card-frame group flex h-full flex-col p-3.5 md:p-4"
        style={{ '--frame': roles[0].company.accent } as React.CSSProperties}
      >
        <div className="relative aspect-4/5 overflow-hidden rounded-chip bg-canvas-3">
          {person.photo ? (
            <Media
              src={person.photo}
              alt={`${person.name}, ${person.roles.map((r) => r.title).join(' and ')}`}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 84vw"
              className="transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
            />
          ) : (
            // No portrait on file for this member yet, so the frame carries the
            // monogram in the person's own company colour rather than sitting
            // empty. Same shape and crop as a photograph, so the row stays in
            // register and dropping a real one in later changes nothing else.
            <div
              className="grid-field flex h-full w-full items-center justify-center bg-canvas-2"
              aria-hidden="true"
            >
              <span
                className="t-figure text-5xl transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
                style={{ color: roles[0].company.accentOnBone, opacity: 0.45 }}
              >
                {initials}
              </span>
            </div>
          )}
          <div
            className="absolute inset-0 bg-linear-to-t from-deep/45 via-transparent to-transparent opacity-0 transition-opacity duration-600 group-hover:opacity-100"
            aria-hidden="true"
          />
          {/* The print's own edge. Several of these photographs are pale at the
              border and would otherwise bleed into the white card around them. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-chip ring-1 ring-ink/10 ring-inset"
            aria-hidden="true"
          />


        </div>

        {/* The colour key — one segment per company the person holds a role in. */}
        <div className="mt-3.5 flex h-[3px] gap-1" aria-hidden="true">
          {roles.map(({ company }) => (
            <span
              key={company.key}
              className="flex-1 rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-y-[1.6]"
              style={{ background: company.accent }}
            />
          ))}
        </div>

        <figcaption className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5">
          <h3 className="t-h3 text-ink">{person.name}</h3>

          {/*
            Following the name, not pinned to the card's foot.

            Pinning them was meant to line the role blocks up across a row
            whose cards carry one role and two — and it does line up the
            *last* block, but at the cost of opening 80 px of blank card
            between the name and the roles on the three people who hold one
            role. It also never aligned the man who holds two: his first block
            still sat a block higher than everyone else's only block, so the
            row was not even in register. Reading order wins instead: the name
            and what the person does are one thought and now sit together, and
            the slack a shorter card leaves falls at its foot, where it reads
            as margin.

            Title over company, because the title is the fact and the company
            is where to file it.
          */}
          <ul className="mt-4 space-y-2.5">
            {roles.map(({ title, company }) => (
              <li key={company.key} className="flex gap-3">
                <span
                  className="w-0.5 shrink-0 self-stretch rounded-pill"
                  style={{ background: company.accent }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block t-data text-ink">{title}</span>
                  <span
                    className="mt-0.5 block t-label"
                    style={{ color: company.accentOnBone }}
                  >
                    {company.name}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>
    </div>
  )
}

/* ── Generic feature card, for the "what we do" style grids ───────────── */

export function FeatureCard({
  index,
  title,
  detail,
  accent = 'var(--color-brand)',
  to,
}: {
  index?: number
  title: string
  detail: string
  accent?: string
  to?: string
}) {
  const Wrapper = to ? 'a' : 'div'
  return (
    <div className="h-full">
      <Wrapper
        {...(to ? { href: to } : {})}
        className="card card-interactive group relative flex h-full flex-col overflow-hidden p-6 md:p-7"
      >
        {index !== undefined && (
          <span
            className="pointer-events-none absolute top-2 right-4 t-figure text-[4.5rem] text-canvas-2 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1"
            aria-hidden="true"
          >
            {String(index).padStart(2, '0')}
          </span>
        )}
        <div className="relative">
          <h3 className="t-h3 text-ink">{title}</h3>
          <p className="t-small mt-3 text-muted">{detail}</p>
        </div>
        {to ? (
          <ArrowUpRight
            className="relative mt-auto h-5 w-5 transition-transform duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            style={{ color: accent, marginTop: '1.5rem' }}
            strokeWidth={1.75}
            aria-hidden="true"
          />
        ) : (
          <span
            className="relative mt-auto block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.2]"
            style={{ background: accent, marginTop: '1.5rem' }}
            aria-hidden="true"
          />
        )}
      </Wrapper>
    </div>
  )
}
