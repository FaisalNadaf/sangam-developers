import { MapPin } from 'lucide-react'
import type { Project } from '@/data/projects'
import type { CompanyKey } from '@/data/group'
import { Carousel } from './Carousel'
import { Media } from './Media'
import { SectionHeader } from './SectionHeader'
import { LinkButton } from './Button'

/**
 * The register, as a rail of photographs.
 *
 * The company pages used to print the whole schedule as a table — twenty-six
 * rows on one page, nine on the other — which is the right form for
 * `/projects`, where a reader has come to compare and filter, and the wrong
 * one for a company page, where they have come to see what the work looks
 * like. So the table stays where it belongs and this shows the entries that
 * carry a site photograph, full-bleed, with the reading printed on the frame.
 *
 * `Carousel` underneath is a native scroll-snap rail, which is what buys the
 * touch swiping, the trackpad gesture, the keyboard scrolling and the correct
 * behaviour when a card is tabbed into — none of which a transform track
 * gives you for free. It also pauses on hover, on focus and on a hidden tab,
 * and never auto-advances under reduced motion.
 *
 * Only entries with a photograph are shown; the count and the link below the
 * rail say so, because a carousel that silently drops two thirds of a register
 * reads as the whole register.
 */
export function ProjectCarousel({
  id,
  eyebrow,
  lines,
  accent,
  projects,
  company,
}: {
  id: string
  eyebrow: string
  lines: string[]
  /** Ink cut of the company colour. */
  accent: string
  projects: Project[]
  /** Which company's register the link should open filtered to. */
  company: CompanyKey
}) {
  return (
    /*
      Its own block padding rather than `section-y`. This is the one section
      carrying a fixed-height object — the rail — and on the shared rhythm it
      is the only one on either page that runs past a 900 px viewport. Tighter
      here, rather than tighter everywhere.
    */
    <section
      className="ground-canvas band-top py-[clamp(3rem,5vw,4.5rem)]"
      aria-labelledby={id}
    >
      <div className="shell">
        <SectionHeader
          id={id}
          eyebrow={eyebrow}
          lines={lines}
          accent={accent}
          align="wide"
          intro={
            <p>
              Client, scale and status exactly as they appear on the register.
              The remaining entries carry no site photograph.
            </p>
          }
        />
      </div>

      <Carousel
        className="mt-8 lg:mt-10"
        ariaLabel={`${eyebrow} project rail`}
        itemClassName="w-[80vw] sm:w-[52vw] lg:w-[34vw] xl:w-[27vw]"
        intervalMs={5200}
        loop
        cta={
          <LinkButton
            to={`/projects?company=${company}`}
            variant="outline"
            size="md"
            accent={accent}
          >
            See all projects
          </LinkButton>
        }
      >
        {projects.map((project) => (
          <ProjectSlide key={project.id} project={project} accent={accent} />
        ))}
      </Carousel>


    </section>
  )
}

/**
 * One entry.
 *
 * A fixed height rather than an aspect ratio, so a rail of slides is one
 * unbroken band whatever each photograph's own proportions are — and so the
 * section's height is settled by the slide rather than by whichever card
 * happens to carry the longest title.
 */
function ProjectSlide({ project, accent }: { project: Project; accent: string }) {
  const live =
    project.status === 'In Progress' ||
    project.status === 'In Hand' ||
    project.status === '90% Completed'

  return (
    <article className="group relative h-80 overflow-hidden rounded-panel bg-canvas-3 shadow-card transition-shadow duration-500 ease-out-quint md:h-88 lg:h-96 hover:shadow-lift">
      <Media
        src={project.image!}
        alt={`${project.title}, ${project.discipline} for ${project.client}`}
        sizes="(min-width: 1280px) 27vw, (min-width: 1024px) 34vw, (min-width: 640px) 52vw, 80vw"
        className="transition-transform duration-1000 ease-out-expo group-hover:scale-105"
      />

      {/* Heavy at the foot where the type sits, and never fully clear at the
          top, so a rail of frames shot on different days reads as one set. */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-deep/92 via-deep/45 to-deep/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-panel ring-1 ring-white/12 ring-inset"
        aria-hidden="true"
      />

      {/* Reference and status, set as type rather than as two filled capsules —
          a rail of stickered cards is a dashboard, not a portfolio. */}
      {/* Status only. The register reference used to sit opposite it, and on a
          rail of photographs it read as a sticker: a code no reader outside
          the company can do anything with. It is still on every row of the
          register itself, which is where someone looking one up would be. */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-end gap-3 p-5">
        <span className="inline-flex items-center gap-2 t-label text-white [text-shadow:0_1px_6px_rgba(5,16,11,0.6)]">
          <span
            className="block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: live ? 'var(--color-laterite)' : accent }}
            aria-hidden="true"
          />
          {project.status}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <p
          className="t-label"
          style={{ color: `color-mix(in srgb, ${accent} 45%, white)` }}
        >
          {project.discipline}
        </p>
        <h3 className="t-h3 mt-2.5 text-white [text-shadow:0_1px_10px_rgba(5,16,11,0.55)]">
          {project.title}
        </h3>

        {/* Scale and location only. Client and contract value are on the
            register, which is one click away and is where they can be read
            against every other entry rather than in isolation. */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/20 pt-4">
          {project.scale && (
            <span className="t-data text-white/90">{project.scale}</span>
          )}
          {project.location && (
            <span className="inline-flex items-center gap-1.5 t-data text-white/65">
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {project.location}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
