import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { onTint } from '@/lib/color'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Buttons.
 *
 * Three levels of emphasis and nothing between them, so a view never has two
 * things competing to be the obvious next action:
 *
 *   solid    — the one primary action on a view
 *   outline  — a real alternative, given equal room but less weight
 *   ghost    — tertiary; navigation dressed as a button
 *
 * `invert` is the same primary weight in reverse, for the dark plates: paper
 * ground, ink type, so the contrast holds either way round. `glass` is its
 * partner — the secondary action on a dark ground, which cannot use `outline`
 * because that variant fills itself with paper and would punch a white slab
 * into the middle of a photograph.
 *
 * All three share the pill, the padding scale and the arrow, so they read as
 * one family. Every one of them lifts on hover and presses on click, because
 * a control that does not respond does not look clickable.
 */

type Variant = 'solid' | 'outline' | 'ghost' | 'invert' | 'glass'
type Size = 'sm' | 'md' | 'lg'

const SIZE: Record<Size, string> = {
  sm: 'px-4.5 py-2.5 gap-2 text-[0.875rem]',
  md: 'px-6 py-3 gap-2.5',
  lg: 'px-7 py-3.5 gap-3',
}

/*
  Actions are lettered in the body sans, not the mono label style. Mono is the
  site's voice for *data* — kV, ₹Cr, certificate numbers, section markers — and
  borrowing it for buttons made every call to action read like a field in a
  schedule. Sans also sets the same words about a third narrower, which is what
  keeps a two-button row on one line at 375 px.
*/
const BASE =
  'group relative isolate inline-flex items-center justify-center overflow-hidden rounded-chip whitespace-nowrap ' +
  'font-sans text-[0.9375rem] font-bold tracking-[0.01em] ' +
  'transition-[transform,box-shadow,background-color,border-color,color] duration-400 ease-out-expo ' +
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Recolours the button to a company mark. Defaults to the group accent. */
  accent?: string
  className?: string
  /** Adds the arrow that steps forward on hover. */
  arrow?: boolean
  /** Replaces the arrow with something else — a phone or mail glyph. */
  icon?: ReactNode
}

function Inner({ children, arrow, icon }: Pick<BaseProps, 'children' | 'arrow' | 'icon'>) {
  return (
    <>
      {icon && (
        <span className="relative z-10 shrink-0 transition-transform duration-300 ease-out group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {arrow && !icon && (
        <ArrowRight
          className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </>
  )
}

/** Per-variant surface, plus the wash that fades in underneath on hover. */
function surface(variant: Variant, accent: string) {
  if (variant === 'solid') {
    return {
      style: {
        background: accent,
        color: '#fff',
        boxShadow: `0 1px 2px rgba(16,24,20,0.06), 0 14px 30px -16px color-mix(in srgb, ${accent} 65%, transparent)`,
      },
      className: 'hover:shadow-lift',
      wash: 'rgba(255,255,255,0.18)',
    }
  }
  if (variant === 'invert') {
    return {
      style: {
        background: 'var(--color-paper)',
        color: 'var(--color-ink)',
        boxShadow: '0 1px 2px rgba(16,24,20,0.10), 0 18px 40px -18px rgba(0,0,0,0.55)',
      },
      className: 'hover:shadow-lift',
      wash: `color-mix(in srgb, ${accent} 22%, transparent)`,
    }
  }
  if (variant === 'glass') {
    return {
      style: {
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.34)',
        background: 'rgba(255,255,255,0.08)',
      },
      className: 'border backdrop-blur-md hover:border-white/60 hover:bg-white/16',
      wash: '',
    }
  }
  if (variant === 'outline') {
    return {
      style: {
        color: accent,
        borderColor: `color-mix(in srgb, ${accent} 42%, var(--color-line-2))`,
        background: 'transparent',
      },
      className: 'border hover:shadow-soft',
      wash: `color-mix(in srgb, ${accent} 10%, transparent)`,
    }
  }
  return {
    style: { color: accent, background: 'transparent' },
    className: 'hover:bg-canvas-2',
    wash: '',
  }
}

/**
 * Magnetic pull.
 *
 * Reserved for primary calls to action — one per view. The pull is small
 * (14 px at the edge) so it reads as weight rather than as a toy, and it is
 * skipped entirely for coarse pointers and reduced motion.
 */
function useMagnet(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  const active = enabled && !reduced

  const onMove = (e: React.MouseEvent) => {
    if (!active || !ref.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    setOffset({
      x: ((e.clientX - (r.left + r.width / 2)) / r.width) * 14,
      y: ((e.clientY - (r.top + r.height / 2)) / r.height) * 10,
    })
  }

  const onLeave = () => setOffset({ x: 0, y: 0 })

  return { ref, offset, onMove, onLeave }
}

interface LinkButtonProps extends BaseProps {
  to?: string
  href?: string
  magnetic?: boolean
  onClick?: () => void
  'aria-label'?: string
}

export function LinkButton({
  children,
  to,
  href,
  variant = 'solid',
  size = 'md',
  accent = 'var(--color-brand)',
  className = '',
  arrow = true,
  icon,
  magnetic = false,
  onClick,
  ...rest
}: LinkButtonProps) {
  const { ref, offset, onMove, onLeave } = useMagnet(magnetic)
  const { style, className: variantClass, wash } = surface(variant, accent)

  const cls = `${BASE} ${SIZE[size]} ${variantClass} ${className}`

  const body = (
    <>
      {wash && (
        <span
          className="absolute inset-0 z-0 origin-left scale-x-0 rounded-chip opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-hover:scale-x-100 group-hover:opacity-100"
          style={{ background: wash }}
          aria-hidden="true"
        />
      )}
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </>
  )

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.4 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {to ? (
        <Link to={to} className={cls} style={style} onClick={onClick} {...rest}>
          {body}
        </Link>
      ) : (
        <a
          href={href}
          className={cls}
          style={style}
          onClick={onClick}
          {...(href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          {...rest}
        >
          {body}
        </a>
      )}
    </motion.div>
  )
}

/** Text link with a rule that wipes in from the left on hover. */
export function TextLink({
  children,
  to,
  href,
  accent = 'var(--color-brand)',
  className = '',
}: {
  children: ReactNode
  to?: string
  href?: string
  accent?: string
  className?: string
}) {
  const cls = `group relative inline-flex items-center gap-2 font-sans text-[0.9375rem] font-bold transition-colors duration-300 ${className}`
  const body = (
    <>
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-400 ease-in-out-quart group-hover:origin-left group-hover:scale-x-100"
          style={{ background: accent }}
          aria-hidden="true"
        />
      </span>
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full transition-[background-color,transform] duration-300 group-hover:translate-x-1"
        style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
        aria-hidden="true"
      >
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
    </>
  )

  if (to)
    return (
      <Link to={to} className={cls} style={{ color: onTint(accent) }}>
        {body}
      </Link>
    )
  return (
    <a href={href} className={cls} style={{ color: onTint(accent) }}>
      {body}
    </a>
  )
}
