// Generates public/sitemap.xml from the route table. Run via `npm run sitemap`.
import { writeFileSync } from 'node:fs'

const SITE = 'https://sangamgroup.in'
// Mirrors the route table in src/App.tsx. The two redirect aliases,
// `/certifications` and `/clientele`, are deliberately absent: they resolve to
// `/certificates` and `/clients`, which must not be indexed twice.
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.9', changefreq: 'yearly' },
  { path: '/projects', priority: '0.9', changefreq: 'monthly' },
  { path: '/clients', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'yearly' },
  { path: '/developers', priority: '0.8', changefreq: 'monthly' },
  { path: '/renewables', priority: '0.8', changefreq: 'monthly' },
]

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
).join('\n')}
</urlset>
`
writeFileSync('public/sitemap.xml', xml)
console.log(`sitemap.xml — ${ROUTES.length} routes`)
