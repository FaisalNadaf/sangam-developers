import { CLIENTS, entriesForClient } from '@/data/projects'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal } from '@/components/Reveal'
import { LinkButton } from '@/components/Button'
import { LogoLoop } from '@/components/LogoLoop'

/**
 * Clientele, in one strip.
 *
 * The home page only has to answer "who trusts them", so it shows the marks
 * and nothing else — the grouping, the counts and the work per client live on
 * the client page. Most marks are cut from the two profiles' own "Our Valuable
 * Clients" pages; the last two were supplied by the company afterwards.
 *
 * The marks travel on the page's own ground, with no band and no plate behind
 * them. They still ride the same path: it runs a shallow wave rather than a
 * straight rule, because on a site for a company that strings conductor, the
 * sag of a line between two poles is the shape to reach for. The path is now
 * only geometry — it places each mark and is never painted.
 */

export function ClientStrip() {
  // Most-worked clients first, so the rail leads with the repeat business.
  const ordered = [...CLIENTS].sort(
    (a, b) => entriesForClient(b).length - entriesForClient(a).length,
  )

  return (
    <section
      className="ground-paper band-top pt-[clamp(3.5rem,6.5vw,6.5rem)] pb-0"
      aria-labelledby="clients-heading"
    >
      <div className="shell">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeader
              id="clients-heading"
              eyebrow="Clients"
              lines={['Named on the project register.']}
              accent="var(--color-sd-deep)"
              intro={
                <p>
                  Turbine and module manufacturers, independent power producers
                  and state utilities across Maharashtra and Karnataka.
                </p>
              }
            />
          </div>
          <Reveal direction="right" className="lg:col-span-5 lg:justify-self-end">
            <LinkButton to="/clients" variant="outline" size="md">
              See the clients
            </LinkButton>
          </Reveal>
        </div>
      </div>

      {/*
        Full-bleed, so the marks run off both edges and the rail reads as
        continuous rather than as a row that starts and stops.

        Its clearance is set here rather than on the section, and it scales
        with the viewport rather than sitting at a flat 48 px, which stayed as
        tight at 1440 as it was at 768.

        More below than above on purpose: this section closes the page, and
        the space under the rail is all that separates it from the footer.
      */}
      <Reveal className="mt-[clamp(3rem,5vw,4.5rem)] mb-[clamp(3.5rem,6vw,5.5rem)]">
        <LogoLoop
          items={ordered.map((c) => ({ name: c.name, logo: c.logo }))}
          ariaLabel="Client logos"
          ribbon={false}
          speed={58}
        />
      </Reveal>

    </section>
  )
}
