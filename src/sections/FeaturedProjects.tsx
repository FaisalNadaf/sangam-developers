import { PROJECTS, type Project } from '@/data/projects'
import { SectionHeader } from '@/components/SectionHeader'
import { ProjectShowcase, type ShowcaseSlide } from '@/components/ProjectShowcase'
import { mediaSource } from '@/components/Media'
import { Reveal } from '@/components/Reveal'

/**
 * Selected works.
 *
 * The register entries that photograph well in a banner, newest first — the
 * work itself rather than a description of it. Eight is enough to show range
 * without turning the home page into the register; the full schedule is one
 * click on.
 */

/**
 * A slide is a wide frame, and a wide frame crops a tall photograph to a
 * band. The register's photography runs from 2.2:1 down to 0.56:1, and the
 * portrait half of it arrives with three quarters of the picture cut away —
 * a lineman with no pole, a tower with no sky. Below this ratio an entry
 * keeps its place on the register page and stays out of the banner.
 */
const BANNER_RATIO = 1.4

/** "Ilkal, Karnataka" → "Ilkal". The district is the headline, not the state. */
const place = (p: Project) => (p.location ?? '').split(',')[0].trim()

/**
 * The register titles end with the place they were built in, which the slide
 * has already said in 48 pt above. Drop that clause and the title becomes the
 * short line the design wants, with nothing invented to get there.
 */
function work(p: Project): string {
  const cut = p.title.lastIndexOf(',')
  if (cut < 0) return p.title
  const tail = p.title.slice(cut + 1)
  return tail.includes(place(p)) ? p.title.slice(0, cut) : p.title
}

/**
 * The legal form is not what identifies a client on a photograph. It stays
 * intact everywhere the register is quoted; here it comes off, because
 * "Private Limited" is eleven characters of a line that has room for sixty.
 */
function client(p: Project): string {
  return p.client
    .replace(/\s+(?:Pvt\.?|Private)\s+(?:Ltd\.?|Limited)/gi, '')
    .replace(/\s+(?:Ltd\.?|Limited)(?=\s|$)/gi, '')
    .trim()
}

/**
 * Newest first, one slide per place. Two entries from the same district would
 * put the same word in 48 pt twice in one rotation, which reads as a bug
 * rather than as a second project.
 */
const FEATURED: Project[] = (() => {
  const seen = new Set<string>()
  return PROJECTS.filter((p) => {
    if (!p.image || !p.location) return false
    const source = mediaSource(p.image)
    return !!source && source.ratio >= BANNER_RATIO
  })
    .sort((a, b) => b.year - a.year)
    .filter((p) => {
      const key = place(p).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 8)
})()

const SLIDES: ShowcaseSlide[] = FEATURED.map((p) => ({
  id: p.id,
  image: p.image as string,
  eyebrow: `${p.discipline} · ${p.year}`,
  name: place(p),
  blurb: `${work(p)} for ${client(p)}.`,
}))

export function FeaturedProjects() {
  return (
    <section className="section-y-lg ground-canvas" aria-labelledby="works-heading">
      <div className="shell">
        <SectionHeader
          id="works-heading"
          eyebrow="Selected works"
          accent="var(--color-brand)"
          lines={['Built, strung and energised.']}
          intro={
            <p>
              Each entry is on the group’s register with its client, scale and
              contract value as recorded. Photography is from the companies’ own
              site records.
            </p>
          }
          align="wide"
        />

        {/*
          The plate keeps the shell's width. Only the queue leaves it: the last
          plate is placed to hang past the plate's right edge, and the frame no
          longer clips, so the cards read as lifted out of the composition
          rather than as a strip cut off at a border.
        */}
        <Reveal className="mt-12 lg:mt-16">
          <ProjectShowcase slides={SLIDES} ariaLabel="Selected projects" intervalMs={5200} />
        </Reveal>
      </div>
    </section>
  )
}
