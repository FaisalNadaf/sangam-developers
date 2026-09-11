import { PageTransition } from '@/components/PageTransition'
import { Seo, SITE, breadcrumb } from '@/components/Seo'
import { PageHeader } from '@/components/PageHeader'
import { Stagger, StaggerItem } from '@/components/Reveal'
import { Mark } from '@/components/Mark'
import { LinkButton } from '@/components/Button'
import { CLIENTS, REGISTER_COUNTS } from '@/data/projects'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: `${SITE}/clients`,
  name: 'Clients: Sangam Ventures',
  description:
    'The turbine and module manufacturers, independent power producers and state utilities named on the Sangam Ventures project register.',
}

/**
 * The clients, as a wall of marks.
 *
 * Cut back to the masthead and the marks. What went with the rest was a
 * scrolling logo rail, a six-frame carousel of work by client, the same
 * fourteen clients again as sector-grouped cards with project tallies and
 * company dots, a "why the work lands here" panel and a closing enquiry
 * plate — five sections to say what a wall of fourteen recognisable marks
 * says at a glance, and two of them said it with the very same logos.
 *
 * Five to a row on desktop, which is the width that lets a 6:1 wordmark run
 * nearly the full cell. `optical` on each mark is what keeps the row even:
 * set to one pixel height, the Siemens Gamesa lockup would be 300 px wide
 * beside a 60 px HESCOM roundel and the roundel would read as a fifth the
 * size of its neighbour. See `opticalHeight` for the arithmetic.
 */

export default function Clientele() {
  return (
    <PageTransition>
      <Seo
        title="Clients: Sangam Ventures"
        description={`The ${REGISTER_COUNTS.clients} clients on the Sangam Ventures register: turbine and module makers, independent power producers, state utilities and industry.`}
        path="/clients"
        image="/media/renewables/engineers-panels-1280.webp"
        schema={[schema, breadcrumb([{ name: 'Clients', path: '/clients' }])]}
      />

      <PageHeader
        eyebrow="Clients"
        lines={['Who commissions the work.']}
        intro={`${REGISTER_COUNTS.clients} organisations across manufacturing, power generation and state distribution, each named on the companies’ own project registers.`}
        image="renewables/engineers-panels"
        imageAlt="Engineers walking a row of ground-mounted solar modules on a client project"
      >
        <div className="flex flex-wrap gap-3">
          <LinkButton to="/projects" variant="invert" size="md">
            See the projects
          </LinkButton>
          <LinkButton to="/contact" variant="glass" size="md" arrow={false}>
            Become a client
          </LinkButton>
        </div>
      </PageHeader>

      {/*
        No section heading. The masthead above already names the set and counts
        it, and a second heading over a bare grid of logos would be the page
        introducing itself twice.
      */}
      <section
        className="section-y ground-paper"
        aria-label={`${REGISTER_COUNTS.clients} client organisations`}
      >
        <div className="shell">
          <Stagger
            as="ul"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5"
            each={0.05}
          >
            {CLIENTS.map((client) => (
              <StaggerItem as="li" key={client.name}>
                <div className="h-full">
                  {/* Tight padding on purpose. The mark is the only content,
                      and at five columns the widest wordmarks are bound by the
                      cell's width rather than by the well's height — so every
                      pixel of padding comes straight off the logo. */}
                  <div className="card-frame group flex h-full items-center justify-center p-5 md:p-6">
                    {/*
                      A fixed well, so every mark is centred on the same line
                      whatever its own proportions are.
                    */}
                    <div className="flex h-24 w-full items-center justify-center">
                      {client.logo ? (
                        <Mark
                          name={client.logo}
                          alt={`${client.name} logo`}
                          height={56}
                          optical
                          className="transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
                        />
                      ) : (
                        /*
                          Two clients on the register published no mark to cut,
                          so the name is set as type in the plate instead. That
                          is already what the home rail does for the same two;
                          the monogram this replaces was the only place on the
                          site that rendered a client as initials, and "SR" and
                          "D" told a reader nothing the name would not.
                        */
                        <span className="t-h3 text-balance px-2 text-center text-muted transition-colors duration-500 ease-out-expo group-hover:text-ink">
                          {client.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </PageTransition>
  )
}
