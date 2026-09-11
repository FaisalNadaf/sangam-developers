/**
 * Sangam Ventures wordmark.
 *
 * The source documents carry marks for each company but none for the group, so
 * the group signs itself in type. With no glyph beside it the word has to do
 * the whole job, which changes how it is set:
 *
 *   • SANGAM is heavier and a step larger than a heading of the same height,
 *     and tracked slightly *open* rather than tight — display type is tight,
 *     wordmarks are not, and the difference is what stops it reading as a
 *     stray `<h1>` parked in the corner.
 *   • The descriptor is the same optical width as the word above it. It is
 *     set in mono and its tracking is tuned per size to land there, so the
 *     two lines square off into a block instead of a ragged stack.
 *   • A hairline between them holds that block together and gives the mark an
 *     edge to sit on.
 *
 * The descriptor colour is passed in, so the mark can sit on paper or on a
 * photograph without a second component.
 */

const SIZES = {
  nav: {
    word: 'text-[1.1875rem] md:text-[1.3125rem]',
    descriptor: 'text-[0.5rem] md:text-[0.5625rem]',
    tracking: '0.9em',
    gap: 'my-[0.3em]',
  },
  footer: {
    word: 'text-[1.5rem]',
    descriptor: 'text-[0.625rem]',
    tracking: '0.925em',
    gap: 'my-[0.34em]',
  },
} as const

export function Wordmark({
  className = '',
  muted = 'text-muted',
  size = 'nav',
}: {
  className?: string
  /** Colour of the descriptor, so the mark can sit on a photograph too. */
  muted?: string
  size?: keyof typeof SIZES
}) {
  const s = SIZES[size]

  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span
        className={`font-display font-bold text-current ${s.word}`}
        style={{ letterSpacing: '0.055em' }}
      >
        SANGAM
      </span>

      <span
        className={`h-px w-full bg-current opacity-25 ${s.gap}`}
        aria-hidden="true"
      />

      <span
        className={`font-mono font-bold whitespace-nowrap ${s.descriptor} ${muted}`}
        // Letter-spacing also spaces *after* the last character, which would
        // push the descriptor wider than the word above it. Pulling the same
        // amount back off the right edge squares the block off.
        style={{ letterSpacing: s.tracking, marginInlineEnd: `-${s.tracking}` }}
      >
        VENTURES
      </span>
    </span>
  )
}
