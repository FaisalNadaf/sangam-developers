import { SectionHeader } from '@/components/SectionHeader'
import { Stagger, StaggerItem } from '@/components/Reveal'
import { TeamCard } from '@/components/cards'
import { COMPANIES, LEADERSHIP } from '@/data/group'

/**
 * Who signs the work off.
 *
 * Lifted out of the former `/team` page when the About branch was folded into
 * one page. The formation record that used to sit under it — proprietorship in
 * March 2016, LLP incorporated in June 2024, one managing partner across both
 * — went with the timeline above, which already carries both dates in order.
 * Saying it twice on one page made it read as two different facts.
 */

/** The employee list, for the About page's `AboutPage` schema. */
export const leadershipSchema = LEADERSHIP.map((person) => ({
  '@type': 'Person',
  name: person.name,
  jobTitle: person.roles.map((r) => r.title).join(', '),
}))

export function Leadership() {
  return (
    <section
      id="team"
      className="section-y ground-paper scroll-mt-24"
      aria-labelledby="partners-heading"
    >
      <div className="shell">
        <SectionHeader
          id="partners-heading"
          eyebrow="Team members"
          lines={['The people who sign the work off.']}
   
          align="wide"
        />

        <Stagger
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6"
          each={0.09}
        >
          {LEADERSHIP.map((person) => (
            <StaggerItem key={person.name}>
              <TeamCard person={person} companies={COMPANIES} />
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  )
}
