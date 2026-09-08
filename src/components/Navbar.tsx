import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { GROUP } from '@/data/group'
import { EASE_IN_OUT, EASE_OUT } from '@/lib/motion'
import { Wordmark } from './Wordmark'

/**
 * Primary navigation.
 *
 * Seven destinations, flat. About used to be a dropdown holding the group, its
 * partners and its certificates; those are one page now, so the branch went
 * with them — a menu that opens onto a single destination is a stile, not a
 * signpost.
 *
 * Seven items and two of them are two words long, so the full bar needs more
 * width than `lg` gives it — but less than the `xl` it used to ask for. The
 * bar, the wordmark and the call to action measure about 930 px together, and
 * `wide` (1120 px) leaves roughly a hundred spare; below that the sheet is
 * used, a cramped bar that wraps being worse than a good sheet.
 *
 * That stop is also what keeps a desktop monitor at 125 % browser zoom on the
 * desktop bar instead of dropping it to a hamburger — see
 * `--breakpoint-wide` in the design system for why 70 rem and not 80.
 *
 * Labels are set in the body sans at sentence case, not in the mono label
 * style the rest of the site uses for eyebrows and data. Tracked-out uppercase
 * is a fine way to letter a two-word marker; it is a poor way to letter seven
 * destinations you want someone to scan in one pass — it costs about a third
 * more width per label and flattens the word shapes that make scanning fast.
 *
 * The active destination is marked with a rule under it rather than a filled
 * capsule, which matches the section markers and keeps one filled shape on the
 * bar — the call to action, which is the only thing there that is a button.
 */
interface NavItem {
  label: string
  to: string
}

const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Sangam Developers', to: '/developers' },
  { label: 'Sangam Renewables', to: '/renewables' },
  { label: 'Projects', to: '/projects' },
  { label: 'Client', to: '/clients' },
  { label: 'Contact', to: '/contact' },
]

/** Routes whose first screen is a dark band. See `overHero` below. */
const DARK_OPENERS = new Set(NAV.map((item) => item.to))

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Every destination in the bar now opens on a dark band — the home hero's
  // footage, or the masthead every inner page shares — so the bar starts
  // transparent on all of them and only takes a ground once the reader has
  // scrolled off it. Anything not in the bar (the 404) opens on paper, where a
  // transparent bar would leave the wordmark invisible.
  const overHero = DARK_OPENERS.has(pathname)
  const solid = scrolled || open || !overHero

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A route change always closes the sheet, so back/forward never strands it open.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const idle = solid ? 'text-body hover:text-ink' : 'text-white/80 hover:text-white'
  const navItemClass =
    'group relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-sans text-[0.9375rem] font-normal tracking-[0.012em] transition-colors duration-300'

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-chip focus:bg-brand focus:px-5 focus:py-3 focus:text-white focus:t-label"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out-expo ${
          solid
            ? 'border-b border-line bg-paper/85 shadow-soft backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          className="shell relative flex h-16 items-center justify-between gap-6 md:h-18"
          aria-label="Primary"
        >
          <Link
            to="/"
            className={`group flex shrink-0 items-center gap-3 transition-colors duration-500 ${
              solid ? 'text-ink' : 'text-white'
            }`}
            aria-label={`${GROUP.fullName}, home`}
          >
            <Wordmark
              className="origin-left transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
              muted={solid ? undefined : 'text-white/70'}
            />
          </Link>

          <ul className="hidden items-center gap-0.5 wide:flex">
            {NAV.map((nav) => (
              <li key={nav.label}>
                <NavLink
                  to={nav.to}
                  end={nav.to === '/'}
                  className={({ isActive }) =>
                    `${navItemClass} ${isActive ? (solid ? 'text-brand' : 'text-white') : idle}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-pill ${
                            solid ? 'bg-brand' : 'bg-white'
                          }`}
                          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-pill opacity-60 transition-transform duration-300 ease-out-expo group-hover:scale-x-100 ${
                          solid ? 'bg-line-2' : 'bg-white/50'
                        }`}
                        aria-hidden="true"
                      />
                      {nav.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className={`hidden shrink-0 items-center gap-2.5 rounded-chip px-5 py-2.5 font-sans text-[0.875rem] font-bold whitespace-nowrap transition-[transform,box-shadow,background-color,color] duration-400 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] md:inline-flex ${
              solid
                ? 'bg-brand text-white shadow-soft hover:shadow-lift'
                : 'bg-white text-ink shadow-lift hover:bg-white/90'
            }`}
          >
            Let’s talk
          </Link>

          <button
            type="button"
            className={`ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-soft transition-[transform,background-color,color,border-color] duration-300 active:scale-95 wide:hidden ${
              solid
                ? 'border-line bg-paper text-ink'
                : 'border-white/25 bg-white/12 text-white backdrop-blur-md'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="flex"
              >
                {open ? (
                  <X className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={1.75} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

      
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/**
 * Mobile navigation.
 *
 * Its own layout rather than a shrunken desktop bar: full height, one large
 * tap target per line, and nothing hidden behind a second tap.
 */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col bg-canvas pt-16 md:pt-18 wide:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.45, ease: EASE_IN_OUT }}
        >
          <nav className="shell flex-1 overflow-y-auto py-7" aria-label="Mobile">
            <ul className="overflow-hidden rounded-card border border-line bg-paper shadow-soft">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  className="border-b border-line last:border-0"
                  initial={{ opacity: 0, x: -22 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14 + i * 0.05, duration: 0.4, ease: EASE_OUT }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-baseline gap-4 px-6 py-4 font-display text-[1.5rem] font-bold tracking-[-0.02em] transition-colors duration-300 ${
                        isActive ? 'bg-brand-tint text-brand' : 'text-ink active:bg-canvas-2'
                      }`
                    }
                  >
                    <span className="t-label text-muted">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.4, ease: EASE_OUT }}
            >
              <Link
                to="/contact"
                onClick={onClose}
                className="mt-6 flex items-center justify-center rounded-chip bg-brand px-6 py-4 t-label text-white shadow-card transition-transform duration-300 active:scale-[0.98]"
              >
                Let’s talk
              </Link>
              {GROUP.phones.map((line) => (
                <a
                  key={line.href}
                  href={`tel:${line.href}`}
                  className="mt-3 flex items-center justify-center rounded-chip border border-line bg-paper px-6 py-4 t-data text-ink shadow-soft"
                >
                  {line.display}
                </a>
              ))}
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
