import type { ReactNode } from 'react'
import { onTint } from '@/lib/color'

/**
 * The section marker.
 *
 * Every section, page header and hero names itself with one of these. It is a
 * short accent rule with the label set against it — the device the Sangam
 * Developers profile uses on its own pages, so it is the company's mark of
 * emphasis rather than a borrowed one.
 *
 * It replaces the tinted capsule this site used before. A capsule reads as a
 * *badge* — a status, a count, something you could click — and putting one at
 * the top of every section made eight different things on a page all look like
 * controls. A rule reads as typography, which is what a section marker is: it
 * sits quietly beside the heading and lets the heading be the loud thing.
 *
 * `tone` picks the two grounds the site actually has:
 *   • paper — label in the accent, darkened by `onTint` so 11 px type clears
 *             AA on the tinted bands
 *   • dark  — label in white, rule in the bright accent, for the hero and the
 *             closing plate
 */
export function Eyebrow({
  children,
  accent = 'var(--color-brand)',
  tone = 'paper',
  className = '',
}: {
  children: ReactNode
  accent?: string
  tone?: 'paper' | 'dark'
  className?: string
}) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span
        className="block h-3.5 w-[3px] shrink-0 rounded-[2px]"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <span
        className="t-label"
        style={{ color: tone === 'dark' ? 'rgba(255,255,255,0.92)' : onTint(accent) }}
      >
        {children}
      </span>
    </p>
  )
}
