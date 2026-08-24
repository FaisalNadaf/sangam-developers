import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minimize2, X, ZoomIn } from 'lucide-react'
import type { Certification } from '@/data/certifications'
import { companyByKey } from '@/data/group'
import { Eyebrow } from './Eyebrow'
import { Mark } from './Mark'
import { EASE_OUT } from '@/lib/motion'
import { Media, mediaSource } from './Media'

/**
 * A certificate presented as a record, not a badge.
 *
 * The scan is the card, and it is shown whole — the well carries A4's own
 * 1:√2, which is what these documents are, so nothing is cropped away. It is
 * a fixed shape rather than each file's measured ratio on purpose: rescanned
 * certificates land a fraction off square, and four cards that are each a
 * different height read as a broken grid long before anyone notices a
 * millimetre of crop. A certificate is a
 * thing you recognise before you read it: the crest, the standard, the
 * holder's name and the accreditation marks are all legible as a shape at
 * thumbnail size. The card this replaces cut a 16:9 band off the top, which
 * threw away the bottom two thirds of every certificate and made four
 * portrait documents read as four landscape photographs.
 *
 * Under the scan, the record — certificate number and expiry exactly as
 * issued, and the link to the accrediting body. That link is what lets the
 * claim be checked rather than taken on trust, and it is why the About page
 * needs no separate "verify" band: every card carries the check.
 *
 * Sized to sit four to a row, which is the whole set.
 */
export function CertificationCard({
  cert,
  onOpen,
}: {
  cert: Certification
  onOpen: (cert: Certification) => void
}) {
  const company = companyByKey(cert.company)

  return (
    <div className="h-full">
      <article
        className="card-frame group flex h-full flex-col p-3.5 md:p-4"
        style={{ '--frame': company.accent } as CSSProperties}
      >
        <button
          type="button"
          onClick={() => onOpen(cert)}
          className="group/scan relative block aspect-[1/1.414] w-full shrink-0 cursor-zoom-in overflow-hidden rounded-chip bg-canvas-3"
          aria-label={`Open the ${cert.standard} certificate for ${company.name} at full size`}
        >
          <Media
            src={cert.image}
            alt=""
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 42vw, 84vw"
            className="transition-transform duration-1000 ease-out-expo group-hover/scan:scale-[1.03]"
          />
          {/* The scan is white paper sitting on a white mat, so it needs its
              own edge or the two dissolve into each other. */}
          <span
            className="pointer-events-none absolute inset-0 rounded-chip ring-1 ring-ink/10 ring-inset"
            aria-hidden="true"
          />
          <span
            className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-deep/75 via-deep/10 to-transparent p-4 opacity-0 transition-opacity duration-400 ease-out-expo group-hover/scan:opacity-100"
            aria-hidden="true"
          >
            <span className="inline-flex translate-y-1.5 items-center gap-2 rounded-chip bg-white/95 px-3.5 py-2 t-label text-ink shadow-soft backdrop-blur-md transition-transform duration-400 ease-out-expo group-hover/scan:translate-y-0">
              <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Open full size
            </span>
          </span>
        </button>

        <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5">
          <div className="flex items-start justify-between gap-3">
            <Eyebrow accent={company.accent}>{company.name}</Eyebrow>
            <Mark
              name={company.mark}
              alt=""
              height={20}
              optical
              className="mt-px shrink-0 opacity-80 transition-opacity duration-400 group-hover:opacity-100"
            />
          </div>

          <h3 className="t-h3 mt-3 text-ink">{cert.standard}</h3>
   
      
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
            <button
              type="button"
              onClick={() => onOpen(cert)}
              className="inline-flex items-center gap-2 t-label transition-transform duration-400 ease-out-expo hover:translate-x-0.5"
              style={{ color: company.accentOnBone }}
            >
              <ZoomIn className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Read it
            </button>
           
          </div>
        </div>
      </article>
    </div>
  )
}

/**
 * The certificate, opened.
 *
 * The whole document fits the viewport, which is the entire point of opening
 * it and the thing the old dialog did not do: the scan went into a 42 rem
 * column at its intrinsic ratio, which on any normal screen is half a metre
 * of certificate behind a scrollbar. Here the image is a flex child of a
 * definite-height box and carries `max-h-full`, so it scales down until all
 * of it is on screen whatever the window is.
 *
 * Fitted, the fine print is too small to read — so the scan also zooms. Click
 * it, or the button in the bar, and it goes to its full width inside a scroll
 * container. The container drops from centred flex to block for that: a
 * centred flex child that overflows puts its own top edge above the scroll
 * origin, where no scrollbar can reach it.
 */
export function CertificateLightbox({
  cert,
  onClose,
}: {
  cert: Certification | null
  onClose: () => void
}) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!cert) return
    setZoomed(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [cert, onClose])

  const company = cert ? companyByKey(cert.company) : null
  const source = cert ? mediaSource(cert.image) : null

  return (
    <AnimatePresence>
      {cert && company && source && (
        <motion.div
          className="fixed inset-0 z-80 flex flex-col bg-deep/94 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${cert.standard} certificate for ${company.name}`}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line-inv px-5 py-4 md:px-8">
            <div className="min-w-0">
              <Eyebrow accent={company.accent} tone="dark">
                {company.legalName}
              </Eyebrow>
              <p className="t-h3 mt-2 truncate text-ink-inv">
                {cert.standard}
                <span className="t-data ml-3 text-muted-inv">{cert.certificateNo}</span>
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="hidden h-11 items-center gap-2 rounded-chip border border-line-inv px-4 t-label text-ink-inv transition-[background-color,border-color] duration-300 hover:border-line-inv-2 hover:bg-white/10 sm:inline-flex"
                aria-pressed={zoomed}
              >
                {zoomed ? (
                  <Minimize2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <ZoomIn className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                )}
                {zoomed ? 'Fit to screen' : 'Actual size'}
              </button>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-inv text-ink-inv transition-[transform,border-color,background-color] duration-300 hover:border-line-inv-2 hover:bg-white/10 active:scale-95"
                aria-label="Close certificate"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <motion.div
            className={`min-h-0 flex-1 p-4 md:p-6 ${
              zoomed ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden'
            }`}
            /* Clicking the ground around the certificate closes, the way a
               lightbox is expected to. Clicking the scan itself zooms. */
            onClick={(e) => e.target === e.currentTarget && onClose()}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.06, ease: EASE_OUT }}
          >
            <img
              src={source.src}
              srcSet={source.srcSet}
              sizes={zoomed ? '1280px' : '(min-width: 768px) 70vh, 92vw'}
              alt={`${cert.standard} certificate ${cert.certificateNo}, issued to ${company.legalName} by ${cert.issuer}`}
              /* Reserved from the registry, not from a literal: these scans get
                 replaced, and a hardcoded intrinsic size silently stops
                 matching the file the moment they do. */
              style={{ aspectRatio: String(source.ratio) }}
              onClick={() => setZoomed((z) => !z)}
              className={
                zoomed
                  ? 'mx-auto h-auto w-full max-w-[1280px] cursor-zoom-out rounded-card bg-paper shadow-plate'
                  : 'max-h-full w-auto max-w-full cursor-zoom-in rounded-card bg-paper object-contain shadow-plate'
              }
            />
          </motion.div>

          {/*
            One line, and only where there is height to spare. Everything in
            this rail is also printed on the scan above it — which is now
            entirely on screen — so on a phone the whole viewport goes to the
            certificate instead of to a caption repeating it.
          */}
          <dl className="hidden shrink-0 flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-line-inv px-5 py-3.5 md:px-8 sm:flex">
            <Reading label="Issued" value={cert.issued} />
            <Reading label="Valid to" value={cert.expires} />
            <Reading label="Issuer" value={cert.issuer} />
            <Reading label="Accreditation" value={cert.accreditation} />
          </dl>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * A reading in the dialog's rail, cut for the dark ground.
 *
 * Label and value share a line here rather than stacking as they do on the
 * card. The rail is competing with the certificate for vertical space and the
 * certificate wins — a stacked pair costs twice the height to say the same
 * thing in a place where nothing has to be scanned in a column.
 */
function Reading({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline gap-2.5">
      <dt className="t-label shrink-0 text-muted-inv">{label}</dt>
      <dd className="t-data truncate text-ink-inv">{value}</dd>
    </div>
  )
}
