import { useEffect } from 'react'

const SITE = 'https://sangamgroup.in'
const OG_IMAGE = '/media/renewables/wind-farm-1280.webp'

/**
 * index.html ships a fallback title and description so the first paint and
 * non-JS crawlers are not blank. React hoists its own `title` ahead of the
 * static one, but a second `meta[name=description]` would simply sit alongside
 * it — and crawlers read the first. Drop the fallbacks once React has rendered.
 */
function useDropDefaultMeta() {
  useEffect(() => {
    document.head.querySelectorAll('[data-default]').forEach((el) => el.remove())
  }, [])
}

interface SeoProps {
  title: string
  description: string
  path: string
  /** Media key for the social card; falls back to the group image. */
  image?: string
  /** JSON-LD blocks for this page. */
  schema?: object[]
}

/**
 * Page metadata.
 *
 * React 19 hoists `title`, `meta` and `link` to the document head from
 * anywhere in the tree, so no head-management dependency is needed.
 */
export function Seo({ title, description, path, image, schema = [] }: SeoProps) {
  useDropDefaultMeta()
  const url = `${SITE}${path}`
  const card = image ? `${SITE}${image}` : `${SITE}${OG_IMAGE}`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Sangam Group of Companies" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={card} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={card} />

      {schema.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Blocks are built from constants in this repo, never from user input,
          // and `<` is escaped so a stray "</script>" in copy cannot close the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}

/** Breadcrumb JSON-LD for any page below the root. */
export const breadcrumb = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE}${item.path}`,
  })),
})

export { SITE }
