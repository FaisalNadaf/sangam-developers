import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/PageTransition'
import { Seo } from '@/components/Seo'
import { LinkButton } from '@/components/Button'
import { EASE_OUT } from '@/lib/motion'
import { COMPANIES } from '@/data/group'

const ELSEWHERE = [
  { label: 'About Us', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Clients', to: '/clients' },
  { label: 'Certificates', to: '/about#certificates' },
  { label: 'Contact', to: '/contact' },
]

export default function NotFound() {
  return (
    <PageTransition>
      <Seo
        title="Page not found: Sangam Group"
        description="That page is not on this site. Head to the group overview, the project register, or the certificates."
        path="/404"
      />

      <section className="relative flex min-h-[86svh] items-center overflow-hidden bg-canvas pt-32 pb-20">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-40 -right-32 h-160 w-160 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-laterite) 16%, transparent) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />

        <div className="shell relative z-10">
          <motion.p
            className="t-label mb-7 inline-flex items-center gap-3 rounded-chip border border-line bg-paper px-4 py-2 text-laterite shadow-soft"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-laterite" aria-hidden="true" />
            Error 404
          </motion.p>

          <h1 className="t-hero max-w-[14ch] text-ink">
            <span className="mask-line">
              <motion.span
                className="block"
                initial={{ y: '112%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1, delay: 0.14, ease: EASE_OUT }}
              >
                Open circuit.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="t-lead mt-7 max-w-lg text-muted"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: EASE_OUT }}
          >
            That page is not on this site. Everything the group publishes is one of
            the links below.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease: EASE_OUT }}
          >
            <LinkButton to="/" size="lg" magnetic>
              Back to the group
            </LinkButton>
            <LinkButton to="/projects" variant="outline" size="lg" arrow={false}>
              Project register
            </LinkButton>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.68 } } }}
          >
            {COMPANIES.map((company) => (
              <motion.div
                key={company.key}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
                }}
              >
                <div className="h-full">
                  <Link
                    to={company.path}
                    className="card card-interactive group flex h-full flex-col justify-between p-6 md:p-7"
                  >
                    <span className="t-label" style={{ color: company.accentOnBone }}>
                      est. {company.establishedYear}
                    </span>
                    <span className="t-h3 mt-6 block text-ink">{company.name}</span>
                    <span
                      className="mt-4 block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.4]"
                      style={{ background: company.accent }}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
              }}
            >
              <div className="card h-full p-6 md:p-7">
                <p className="t-label text-muted">Elsewhere on the site</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ELSEWHERE.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-chip border border-line bg-canvas px-4 py-2 t-label text-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
