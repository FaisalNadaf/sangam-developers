import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { CERTIFICATIONS, type Certification } from '@/data/certifications'
import { COMPANIES } from '@/data/group'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeader } from '@/components/SectionHeader'
import { CertificateLightbox, CertificationCard } from '@/components/CertificationCard'
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal'
import { LinkButton } from '@/components/Button'

/**
 * Quality and safety.
 *
 * Both companies hold both standards, which is the point worth making: the
 * same system governs a 2016 proprietorship and a 2024 LLP.
 *
 * `compact` is the home-page form — four small records rather than four full
 * cards, because the home page only needs to establish that the certificates
 * exist and are checkable. The full records live on /about#certificates.
 */
export function Assurance({ limit, compact = false }: { limit?: number; compact?: boolean }) {
  const [open, setOpen] = useState<Certification | null>(null)
  const certs = limit ? CERTIFICATIONS.slice(0, limit) : CERTIFICATIONS

  return (
    <section className="section-y ground-paper band-top" aria-labelledby="assurance-heading">
      <div className="shell">
        <SectionHeader
          id="assurance-heading"
          eyebrow="Quality & safety"
          lines={['Certified on both sides of the group.']}
        
          
          align="wide"
        />

        {compact ? (
          <>
            <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" each={0.08}>
              {CERTIFICATIONS.map((cert) => {
                const company = COMPANIES.find((c) => c.key === cert.company)!
                return (
                  <StaggerItem as="li" key={cert.id}>
                    <div className="h-full">
                      <div className="card card-interactive group flex h-full flex-col p-6">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
                          style={{
                            background: `color-mix(in srgb, ${company.accent} 12%, transparent)`,
                          }}
                        >
                          <ShieldCheck
                            className="h-5 w-5"
                            style={{ color: company.accentOnBone }}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </span>
                        <Eyebrow accent={company.accent} className="mt-5">
                          {company.name.replace('Sangam ', '')}
                        </Eyebrow>
                        <h3 className="t-h3 mt-3 text-ink">{cert.standard}</h3>
                        <p className="t-small mt-1.5 text-muted">{cert.system}</p>
                        <p className="mt-auto pt-5 t-data text-muted">Valid to {cert.expires}</p>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </Stagger>

            <Reveal className="mt-8">
              <LinkButton to="/about#certificates" size="lg">
                See the certificates
              </LinkButton>
            </Reveal>
          </>
        ) : (
          <>
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6" each={0.1}>
              {certs.map((cert, i) => (
                <StaggerItem key={cert.id} direction={i % 2 === 0 ? 'left' : 'right'}>
                  <CertificationCard cert={cert} onOpen={setOpen} />
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-card bg-canvas px-6 py-6 md:px-8">
              {/* All four carry the same registered scope wording; saying so stops
                  the repetition reading as a mistake. */}
              <p className="t-small max-w-xl text-muted">
                All four certificates are issued against the same registered scope: the
                manufacture of 33 kV overhead transmission line material.
              </p>
              {limit && (
                <LinkButton to="/about#certificates" variant="outline" size="md">
                  See the certificates
                </LinkButton>
              )}
            </Reveal>
          </>
        )}
      </div>

      <CertificateLightbox cert={open} onClose={() => setOpen(null)} />
    </section>
  )
}
