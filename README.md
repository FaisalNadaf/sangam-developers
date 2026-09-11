# Sangam Ventures

Corporate site for Sangam Ventures — **Sangam Developers** (est. March 2016) and
**Sangam Renewables & Electrosystems LLP** (incorporated 24 June 2024).

React 19 · Vite 7 · TypeScript · Tailwind v4 · Framer Motion · Lenis

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # regenerates sitemap.xml, typechecks, builds to dist/
npm run preview  # serve the production build
```

---

## Pages

| Route | Page | In the navbar as |
| --- | --- | --- |
| `/` | Home | Home |
| `/about` | About Us | About ▾ |
| `/team` | Team Members | About ▾ |
| `/certificates` | Certificates | About ▾ |
| `/developers` | Sangam Developers profile | Sangam Developers |
| `/renewables` | Sangam Renewables profile | Sangam Renewables |
| `/projects` | Projects | Projects |
| `/clients` | Clients | Client |
| `/contact` | Contact | Contact + the `Let's talk` CTA |

Two aliases exist so older links do not 404: `/clientele` → `/clients` and
`/certifications` → `/certificates`. Both are deliberately absent from
`sitemap.xml`, and the canonical on each page points at the real path.

The navbar carries seven destinations and one dropdown. The active destination
is marked with a rule under it rather than a filled capsule, so the only filled
shape on the bar is the call to action — the one thing there that is a button. Two of the labels are
two words long, so the full bar needs the `xl` breakpoint rather than `lg`;
between 1024 px and 1280 px the mobile sheet is used instead, with the
`Let's talk` CTA still on the bar from `md` up.

## The one rule

**Every fact on this site is transcribed from the company's own documents.**

| Source | Covers |
| --- | --- |
| `Sangam_Developers_Profile 2025-26` (11 pp.) | mission, vision, values, delivery sequence, solar and wind scope, 26 projects, clients, CSR |
| `Sangam_Renewables_company_profile` (24 pp.) | about, mission, vision, figures, services, sectors, scope, 9 projects, team, clients, CSR |
| `SD ISO QLTY MGMNT 2015` / `SD ISO SFTY MGMNT 2018` | Sangam Developers ISO 9001:2015 and ISO 45001:2018 |
| `SRE QLTY 2015` / `SRE SFTY 2018` | Sangam Renewables ISO 9001:2015 and ISO 45001:2018 |

Nothing is invented — no estimated statistics, no unnamed clients, no
testimonials, no awards. Counts shown on the site (35 projects, 14 clients,
4 certificates) are tallies computed from the data files, so they cannot drift
away from the register they summarise.

Project contract values are printed exactly as recorded, in lakh and crore, and
are deliberately **never totalled** into a headline figure.

---

## Editing content

All copy that states a fact lives in `src/data/`. Change it there and the whole
site follows — headings, counters, filters, schema.org output and the timeline.

| File | Holds |
| --- | --- |
| `group.ts` | group identity, the two companies, offices, GSTINs, leadership, the four documented links between the companies |
| `projects.ts` | the 35-row project register, disciplines, client list, derived counts |
| `certifications.ts` | the four ISO records — numbers, dates, scope, accreditation |
| `developers.ts` | Sangam Developers mission, vision, values, delivery sequence, solar and wind scope |
| `renewables.ts` | Sangam Renewables about, figures, services, sectors, scope, components, USP |
| `media.json` | generated image manifest — do not hand-edit |

**Adding a project:** append to `PROJECTS` in `projects.ts`. Counters, filters,
the featured gallery, the timeline tallies and the JSON-LD all update from it.
Add `image:` only if a real photograph of that work exists in `media.json`.

---

## Images

All photography is extracted from the source PDFs — no stock. Each asset ships
as WebP at up to three widths with its intrinsic size and dominant colour
recorded in `src/data/media.json`, which is what keeps layout shift near zero.

```tsx
<Media src="developers/tower-lineman" sizes="(min-width: 1024px) 50vw, 100vw" />
```

`priority` marks the LCP image on a page; everything else lazy-loads.

### The home backdrop

The hero runs `public/media/hero/hero.mp4` (7 s, silent, looping) over a still
cut from its own first second. The still is what paints first — 48 kB against
2.9 MB — so the hero is complete and readable before a frame of video arrives,
and it is all that ever loads under `prefers-reduced-motion`, below 1024 px, or
while the tab is hidden. Replacing the clip means dropping in a new `hero.mp4`
and re-cutting the three poster widths from it.

### Logos

`tools/marks.py` cuts every mark on the site out of the company's own
documents — the two Sangam marks from the profile covers, and twelve client
marks from the "Our Valuable Clients" pages of the Sangam Developers (p. 11)
and Sangam Renewables (p. 21) profiles. Each is trimmed to its ink and has the
page ground flood-filled away from the border inward, so white *inside* a mark
survives: the HESCOM roundel, the counters in "adani". Sizes and alt text live
in `src/data/logos.ts`; render with `<Mark>`.

Two clients — Serentica Renewables and Dalmia — are named only in the register
text, where no mark was published to cut. Their cards fall back to a monogram
rather than to a redrawn logo.

`<Mark optical>` balances marks by ink rather than by height. At a fixed
38 px, the Siemens Gamesa lockup is 236 px wide and the HESCOM roundel is
38 px square, and the roundel reads as a fifth the size of its neighbour;
damping the height by the aspect ratio evens them out.

## Design system

Defined once in `src/styles/index.css` as Tailwind v4 `@theme` tokens. The site
is a **light theme throughout** — drafting paper rather than ink — with the one
dark plate reserved for the closing call to action.

**Surfaces** are four steps: `canvas` `#FAFAF8` (the page ground), `paper`
`#FFFFFF` (cards and raised bands), `canvas-2` `#F2F5F0` and `canvas-3`
`#E9EEE7` (tinted bands, pulled a few degrees toward the mark greens so they
read as related to the brand rather than merely grey). Sections alternate
between them so no two adjacent sections share a ground.

**Ink** is four steps, each with a job: `ink` for headings, `body` for prose,
`muted` for secondary and label text, `faint` for rules and icons only. The
first three clear WCAG AA on every surface — `muted` `#5E6D66` is set dark
enough to hold 4.5:1 on `canvas-3`, the deepest of the four grounds, so it is
safe wherever it lands. `faint` is never used for text that has to be read,
placeholders included.

Both company marks and the group accent are chosen to be seen as **fills** — a
leaf green and a sky blue, both fairly light. Set as small type on a tinted
ground they land around 4.2:1, so any accent used as text goes through
`onTint()` in `src/lib/color.ts`, which darkens it toward the ink without
moving its hue. Eyebrows, chips, text links and the block labels on the two
company pages all use it.

**Colour** is still derived from the two company marks and the site
photography: Developers green `#6EAC3D` with the deep cut `#2A782D`, Renewables
blue `#0097DA` with `#06618C`, group accent `--color-brand` `#2F7A3C`, and
`--color-laterite` `#B4521F` for live project status — the red soil in nearly
every site photograph. The bright originals are fills and marks; the `-deep`
cuts carry type.

**Radius** is one scale, five steps — `chip` `tile` `card` `panel` `plate` plus
`pill`. Nothing invents its own corner value.

**Elevation** is three steps — `shadow-soft`, `shadow-card`, `shadow-lift` —
plus `shadow-plate` for the large photographic panels. All are long and
low-opacity, tinted with the ink rather than pure black, so a raised surface
reads as lit paper instead of as a drop shadow.

**Type** is three families, each with one job: **Archivo** for display,
**IBM Plex Sans** for body, navigation and buttons, **IBM Plex Mono** for
technical data — kV, km, ₹Cr, certificate numbers, section markers. Use the
`t-*` utilities rather than raw sizes.

Mono is the voice for *data*, not for anything you click. Navigation labels and
buttons are sans at sentence case: tracked-out uppercase costs about a third
more width per label and flattens the word shapes that make a bar scannable.

### Section markers

Every section, page header and hero names itself with `<Eyebrow>` — a short
accent rule with the label beside it, the device the Sangam Developers profile
uses on its own pages. It replaced a tinted capsule, which read as a *badge*:
something with a status, or something you could press. Nothing that is only a
label wears a capsule anywhere on the site now — not section markers, not the
breadcrumb, not project status, not the year on the timeline. Capsules are left
to the two things that earn them, buttons and filter chips.

### Cards

One recipe, used everywhere: the `card` utility (paper, hairline border,
`--radius-card`, `shadow-soft`) plus `card-interactive` for the hover lift.
Anything that calls itself a card gets those and then differs only in its
contents. `<Tilt>` adds the cursor-following 3D effect on top — six degrees at
the corners, never more — and `<TiltLayer>` floats content above the tilting
surface so the effect reads as parallax rather than as a rotated picture.

### Motion

Four gestures, and everything on the page is one of them:

| Gesture | Used for |
| --- | --- |
| *rise* | headings, cards, list rows — arrives from below |
| *slide* | two-column blocks, converging on their own centre |
| *scale* | plates and photographs, settling in from slightly small |
| *draw* | a rule extending left to right — section openers, the span rule |

Distances are deliberately large enough to be seen: 28–56 px over 0.6–0.9 s.
A 6 px nudge over 300 ms is invisible on a laptop and reads as a rendering
glitch on a phone.

Everything is defined in `src/lib/motion.ts` and consumed through the
`<Reveal>` / `<SlideIn>` / `<ScaleIn>` / `<Stagger>` primitives in
`src/components/Reveal.tsx`. Do not hand-roll `whileInView` — see below.

### The span rule

The signature device. Sangam's work is linear — kilometres of 33 kV line,
right-of-way corridors, internal roads. A transmission line profile is drawn on
a survey sheet as a horizontal datum with a tick at every structure, and that is
what `<SpanRule>` is: the datum extends, then the structures land on it in
sequence. It opens every section. The group structure on the home page is drawn
the same way — as a **single-line diagram**, one bus feeding two circuits.

---

## Accessibility & motion

Verified across 8 routes × desktop, tablet and mobile: no console errors, no
horizontal overflow, alt text on every image, correct heading order, visible
focus rings.

`prefers-reduced-motion` is honoured properly rather than nominally. Reveals do
not animate instantly — they are **not applied at all**, so no element ever
carries a hidden state and no content can be stranded at zero opacity if an
observer fails to fire. `<Tilt>` renders as a plain element, and Lenis smooth
scrolling is disabled outright.

**Use the primitives.** `<Reveal>`, `<SlideIn>`, `<ScaleIn>`, `<FadeIn>`,
`<Stagger>` / `<StaggerItem>`, `<MaskedLines>` and the `useReveal` / `useDraw`
hooks all carry the reduced-motion guard. A hand-written `initial` +
`whileInView` pair does not, and will strand content at zero opacity for
exactly the people who asked for less motion.

`<Tilt>` is additionally skipped for coarse pointers — there is no cursor to
follow on a phone, and the listener would only cost battery.

---

## Components

| Component | Used for |
| --- | --- |
| `PageHeader` | the 40vh split opener, the **same height on every page** — copy left, feathered plate right |
| `Eyebrow` | the section marker: accent rule plus label, on paper or on a dark plate |
| `HeroVideo` | the home backdrop: still first, clip over it, and no clip at all under reduced motion, below 1024 px or in a hidden tab |
| `SectionHeader` | span rule, eyebrow pill, masked heading, optional intro |
| `Carousel` | auto-advancing rail; pauses on hover, focus and hidden tab, and never autoplays under reduced motion |
| `LogoMarquee` | the client rail; one composited transform, paused off screen and on hover, replaced by a static wrapped row under reduced motion |
| `Mark` | a logo at a fixed or optical height, with its intrinsic box reserved |
| `cards.tsx` | `ProjectCard`, `StatCard`, `ClientCard`, `TeamCard`, `FeatureCard` — one surface recipe, one hover language |
| `CertificationCard` | a certificate as a readable record, plus its lightbox |
| `ProjectRegister` | the schedule view: real table on desktop, spec cards on phones |
| `ContactForm` | validated enquiry form (see the note below) |
| `Tilt` / `TiltLayer` | the shallow 3D card effect and its depth layers |
| `Reveal` family | every scroll animation on the site |
| `Button` | `LinkButton` (solid / outline / ghost / invert) and `TextLink` |

### The contact form

The site is a static build with no server behind it. Rather than pretend to
POST somewhere and silently drop the message, `ContactForm` validates in full
and then hands a composed, pre-filled email to the reader's own mail client.
Fields are name, email, phone, company, subject, scope, site location and the
message. Name, email, subject, location and message are required; the subject
becomes the mail subject line.
**If a backend or a form service is added later, replace the `mailto:` handoff
in `onSubmit` — the validation and error states already work.**

---

## Deploying

Static SPA — any host works. `vercel.json` and `public/_redirects` already route
all paths to `index.html` and set immutable caching on `/media` and `/assets`.

Before going live, set the real domain in `src/components/Seo.tsx` (`SITE`),
`scripts/sitemap.mjs` and `public/robots.txt`.
