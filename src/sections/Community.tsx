import { SectionHeader } from '@/components/SectionHeader'
import { Media } from '@/components/Media'
import { ScaleIn } from '@/components/Reveal'

/**
 * CSR, shown as photographs rather than claims.
 *
 * Both profiles carry a CSR section, and neither describes the programmes in
 * words — so neither does this. The pictures are the record: a village school
 * receiving computers, site workforces, community handovers.
 *
 * The scrim covers the whole frame rather than grading out of the bottom
 * edge, so the four photographs read as one set at one exposure — a graded
 * scrim leaves each frame as bright at the top as its own source file
 * happened to be, and these were shot on four different days. It also holds
 * at rest instead of waiting for a cursor, which is what puts the captions on
 * screen for a touch device at all, and deepens rather than appears on hover.
 */
const FRAMES = [
  { src: 'developers/csr-school', span: 'md:col-span-7', caption: 'Equipment handover, village school' },
  { src: 'renewables/csr-group', span: 'md:col-span-5', caption: 'Community programme' },
  { src: 'developers/csr-handover', span: 'md:col-span-5', caption: 'Felicitation' },
  { src: 'developers/site-team', span: 'md:col-span-7', caption: 'Site workforce' },
]

export function Community() {
  return (
    <section className="section-y ground-paper band-top" aria-labelledby="community-heading">
      <div className="shell">
        <SectionHeader
          id="community-heading"
          eyebrow="Community"
          lines={['Work leaves more than a line.']}
          align="wide"
        />

        {/*
          Fixed row height rather than an aspect ratio: the columns are 7/5, so
          a shared ratio would give the two frames in a row different heights.
        */}
        <div className="mt-14 grid auto-rows-56 gap-4 md:auto-rows-76 md:grid-cols-12 md:gap-5 lg:auto-rows-92 lg:gap-6">
          {FRAMES.map((frame, i) => (
            <ScaleIn key={frame.src} className={`${frame.span} h-full`} delay={i * 0.09}>
              <figure className="group relative h-full overflow-hidden rounded-panel bg-canvas-3 shadow-card transition-shadow duration-500 ease-out-quint hover:shadow-lift">
                <Media
                  src={frame.src}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-1200 ease-out-expo group-hover:scale-108"
                />

                {/* The scrim, over the whole frame and held at rest. `deep`
                    rather than black, so what the photographs grade toward is
                    the group's green-black and not neutral grey. */}
                <div
                  className="pointer-events-none absolute inset-0 bg-deep/45 transition-colors duration-600 ease-out-quint group-hover:bg-deep/65"
                  aria-hidden="true"
                />

                {/* An inner light edge, which a darkened frame needs to keep a
                    definite boundary against the white ground behind it. */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-panel ring-1 ring-white/12 ring-inset"
                  aria-hidden="true"
                />

              </figure>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  )
}
