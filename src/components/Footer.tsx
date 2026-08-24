import { Link } from 'react-router-dom'
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { COMPANIES, GROUP, OFFICES } from '@/data/group'
import { REGISTER_COUNTS } from '@/data/projects'
import { scrollTo } from '@/hooks/useSmoothScroll'
import { Mark } from './Mark'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import { LinkButton } from './Button'
import { Wordmark } from './Wordmark'

/** Mirrors the primary navigation, plus the two company profiles. */
const SITEMAP = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Team Members', to: '/about#team' },
      { label: 'Certificates', to: '/about#certificates' },
    ],
  },
  {
    heading: 'Work',
    links: [
      { label: 'Projects', to: '/projects' },
      { label: 'Clients', to: '/clients' },
      { label: 'Sangam Developers', to: '/developers' },
      { label: 'Sangam Renewables', to: '/renewables' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="ground-deep">
      {/* ── Closing call to action ────────────────────────────────────── */}
      <div className="shell border-b border-line-inv py-14 md:py-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="t-label text-brand-bright">Start a conversation</p>
            <p className="t-h2 mt-3 max-w-[20ch] text-white">Talk to the people who build it.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/contact" variant="invert" size="lg">
              Let’s talk
            </LinkButton>
            <LinkButton
              href={`tel:${GROUP.phoneHref}`}
              variant="glass"
              size="lg"
              arrow={false}
              icon={<Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
            >
              {GROUP.phone}
            </LinkButton>
          </div>
        </Reveal>
      </div>

      <div className="shell py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ── Identity ────────────────────────────────────────────── */}
          <Reveal direction="left" className="lg:col-span-4">
            <Wordmark className="text-white" muted="text-muted-inv" size="footer" />
            <p className="t-body mt-6 max-w-xs text-body-inv">{GROUP.positioning}</p>

            <div className="mt-7 flex flex-col gap-2.5">
              <a
                href={`tel:${GROUP.phoneHref}`}
                className="group flex items-center gap-3.5 rounded-tile border border-line-inv bg-deep-2 px-4 py-3.5 t-data text-white transition-[transform,background-color,border-color] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-line-inv-2 hover:bg-white/8"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-bright/18 transition-transform duration-400 ease-spring group-hover:scale-110">
                  <Phone className="h-4 w-4 text-brand-bright" strokeWidth={1.75} aria-hidden="true" />
                </span>
                {GROUP.phone}
              </a>
              {GROUP.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3.5 rounded-tile border border-line-inv bg-deep-2 px-4 py-3.5 t-data break-all text-white transition-[transform,background-color,border-color] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-line-inv-2 hover:bg-white/8"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-bright/18 transition-transform duration-400 ease-spring group-hover:scale-110">
                    <Mail className="h-4 w-4 text-brand-bright" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {email}
                </a>
              ))}
            </div>
          </Reveal>

          {/* ── Sitemap ─────────────────────────────────────────────── */}
          {SITEMAP.map((group, i) => (
            <Reveal key={group.heading} delay={0.06 * (i + 1)} className="lg:col-span-2">
              <h2 className="t-label mb-5 text-muted-inv">{group.heading}</h2>
              <Stagger as="ul" className="space-y-1" each={0.05}>
                {group.links.map((item) => (
                  <StaggerItem as="li" key={item.to} direction="left">
                    <Link
                      to={item.to}
                      className="group -ml-3 inline-flex items-center gap-2 rounded-chip px-3 py-1.5 t-small text-body-inv transition-colors duration-300 hover:bg-white/8 hover:text-white"
                    >
                      <span
                        className="h-px w-0 rounded-pill bg-brand-bright transition-all duration-400 ease-out-expo group-hover:w-4"
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          ))}

          {/* ── Addresses ───────────────────────────────────────────── */}
          <Reveal direction="right" delay={0.18} className="lg:col-span-4">
            <h2 className="t-label mb-5 text-muted-inv">Registered addresses</h2>
            <ul className="grid gap-3">
              {OFFICES.filter((o) => !o.note).map((office) => {
                const company = COMPANIES.find((c) => c.key === office.company)
                return (
                  <li
                    key={office.label}
                    className="rounded-tile border border-line-inv bg-deep-2 p-5 transition-colors duration-400 hover:border-line-inv-2"
                    style={{ borderLeftColor: company?.accent, borderLeftWidth: 3 }}
                  >
                    <p
                      className="t-label flex items-center gap-2"
                      style={{ color: company?.accent }}
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {company?.name}
                    </p>
                    <address className="t-small mt-2.5 not-italic text-body-inv">
                      {office.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                    {office.gstin && <p className="t-data mt-2.5 text-muted-inv">GSTIN {office.gstin}</p>}
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>

        {/* ── The two companies, by their own marks ─────────────────── */}
        <Reveal className="mt-14 grid gap-3 border-t border-line-inv pt-10 sm:grid-cols-2">
          {COMPANIES.map((company) => (
            <Link
              key={company.key}
              to={company.path}
              className="group flex items-center gap-5 rounded-card border border-line-inv bg-deep-2 p-5 transition-[transform,background-color,border-color] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-line-inv-2 hover:bg-white/8"
              style={{ borderLeftColor: company.accent, borderLeftWidth: 3 }}
            >
              <span className="flex h-12 w-14 shrink-0 items-center justify-center">
                <Mark
                  name={company.mark}
                  alt={`${company.name} logo`}
                  height={34}
                  optical
                  className="transition-transform duration-500 ease-spring group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="t-h3 block text-white transition-colors duration-300 group-hover:text-brand-bright">
                  {company.name}
                </span>
                <span className="t-small mt-1 block text-muted-inv">
                  Est. {company.established} · {company.base}
                </span>
              </span>
            </Link>
          ))}
        </Reveal>

        {/* ── Baseline ──────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col gap-5 border-t border-line-inv pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-small text-muted-inv">
            © 2026 Sangam Group of Companies. Designed and developed by{' '}
            <a
              href="https://cubiccode.in/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold text-white underline decoration-white/40 underline-offset-4 transition-colors duration-300 hover:text-brand-bright hover:decoration-brand-bright"
            >
              Cubiccode
            </a>
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <p className="t-label text-muted-inv">
              {REGISTER_COUNTS.total} projects · ISO 9001 &amp; 45001
            </p>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-inv bg-deep-2 text-muted-inv transition-[transform,color,border-color,background-color] duration-400 ease-out-expo hover:-translate-y-0.5 hover:border-line-inv-2 hover:bg-white/8 hover:text-white active:translate-y-0 active:scale-95"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
