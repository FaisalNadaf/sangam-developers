/**
 * Sangam Group — group-level facts.
 *
 * Every value in this file is transcribed from the company source documents:
 *   • Sangam_Developers_Profile 2025-26 (11 pages)
 *   • Sangam_Renewables_company_profile (24 pages)
 *   • SD ISO QLTY MGMNT 2015 / SD ISO SFTY MGMNT 2018
 *   • SRE QLTY 2015 / SRE SFTY 2018
 *
 * Nothing here is invented. If a fact is not in those documents it is not on this site.
 */

import type { MarkKey } from './logos'

export type CompanyKey = 'developers' | 'renewables'

export interface Company {
  key: CompanyKey
  /** Short name used in navigation and headings. */
  name: string
  /** Full registered name as printed on the ISO certificates. */
  legalName: string
  /**
   * How the entity is constituted. Printed beside the registered name where
   * the name does not already carry it — "… LLP" says it, "Sangam Developers"
   * does not. Both are stated on the companies' own pages already.
   */
  constitution: string
  tagline: string
  /** One-line positioning, written from the source profile. */
  role: string
  established: string
  establishedYear: number
  base: string
  path: string
  /** The company's own mark, cut from its profile cover. */
  mark: MarkKey
  accent: string
  accentSoft: string
  /** Darker cut of the mark, for setting type on the light (bone) sections. */
  accentOnBone: string
}

/**
 * The lines the group publishes, in the order they are offered. The first is
 * the direct line printed on both company profiles; the second was added
 * afterwards. Single-slot places (the navigation button, a hero call button)
 * take the first; places with room list them all.
 */
const PHONES = [
  { display: '+91 8975 262 895', href: '+918975262895' },
  { display: '+91 9880 292 908', href: '+919880292908' },
] as const

export const GROUP = {
  name: 'Sangam Group',
  fullName: 'Sangam Group of Companies',
  /**
   * Positioning written from the two company profiles. Both companies build the
   * physical groundwork of renewable energy projects — land, roads, foundations,
   * substations and transmission — for the developers who own the plants.
   */
  positioning:
    'Two engineering companies building the ground layer of India’s renewable energy transition: land, civil works, substations and transmission.',
  phones: PHONES,
  /** The first line, for the one-number slots. */
  phone: PHONES[0].display,
  phoneHref: PHONES[0].href,
  emails: ['sangamdevelopers91@gmail.com', 'sangamrenewables@gmail.com'],
  states: ['Maharashtra', 'Karnataka'],
} as const

export const COMPANIES: Company[] = [
  {
    key: 'developers',
    name: 'Sangam Developers',
    legalName: 'Sangam Developers',
    constitution: 'Proprietorship',
    tagline: 'Expert in Renewable Energies',
    role:
      'Transmission lines, substations, civil works and land development for wind and solar projects across Maharashtra and Karnataka.',
    established: 'March 2016',
    establishedYear: 2016,
    base: 'Morbagi, Dist. Sangli, Maharashtra',
    path: '/developers',
    mark: 'sangam-developers',
    accent: '#6EAC3D',
    accentSoft: '#2A782D',
    accentOnBone: '#2A782D',
  },
  {
    key: 'renewables',
    name: 'Sangam Renewables',
    legalName: 'Sangam Renewables & Electrosystems LLP',
    constitution: 'Limited Liability Partnership',
    tagline: 'Powering a Sustainable Tomorrow',
    role:
      'Solar and wind energy solutions, land development and NA conversion, delivered from raw land through to grid connection.',
    established: '24 June 2024',
    establishedYear: 2024,
    base: 'Vijayapur, Karnataka',
    path: '/renewables',
    mark: 'sangam-renewables',
    accent: '#0097DA',
    accentSoft: '#00A858',
    accentOnBone: '#06618C',
  },
]

export const companyByKey = (key: CompanyKey): Company =>
  COMPANIES.find((c) => c.key === key)!

/**
 * The documented links between the two companies. Each item cites where it
 * comes from so the claim can be checked against the source profiles.
 */
export const GROUP_LINKS: { label: string; detail: string }[] = [
  {
    label: 'Shared leadership',
    detail:
      'Mr. Ravikumar Bagali, B.E. (ECE) is Proprietor of Sangam Developers and Managing Partner of Sangam Renewables & Electrosystems LLP.',
  },
  {
    label: 'One point of contact',
    detail:
      'Both company profiles publish the same direct line, +91 8975 262 895.',
  },
  {
    label: 'Shared client base',
    detail:
      'Suzlon, CleanMax (CMES Jupiter) and Waaree appear on the project registers of both companies.',
  },
  {
    label: 'Joint community work',
    detail:
      'CSR programmes in the Sangam Developers profile are run under the Sangam Renewables & Electrosystems LLP banner.',
  },
]

export interface Office {
  company: CompanyKey | 'both'
  label: string
  lines: string[]
  gstin?: string
  note?: string
  /**
   * The pin as the company dropped it on Google Maps.
   *
   * `lat`/`lng` are the place marker from each share link, not the viewport
   * centre, so the map opens on the building rather than near it. `link` is
   * the original share URL, which is what "Open in Maps" uses: it carries the
   * place card, where a bare coordinate would only drop an unnamed pin.
   */
  map: { lat: number; lng: number; link: string }
}

export const OFFICES: Office[] = [
  {
    company: 'developers',
    label: 'Sangam Developers, Office',
    lines: [
      '#102, Main Road, Morbagi',
      'Tal. Jath, Dist. Sangli',
      'Maharashtra 416 413',
    ],
    gstin: '27BCQPB1451F1ZU',
    map: {
      lat: 17.0844741,
      lng: 75.6149893,
      link: 'https://maps.app.goo.gl/71o8YufBiYMAUW4z6',
    },
  },
  {
    company: 'developers',
    label: 'Sangam Developers, Fabrication works',
    lines: [
      'C/o Adhira Fabrication Works, At. Savali',
      'Tal. Miraj, Dist. Sangli, Gat No. 206, Plot No. 9/10',
      'M.I.D.C. Kanadwadi Road, Sangli 416 436, Maharashtra',
    ],
    note: 'Certified manufacturing address for 33 kV overhead line material.',
    map: {
      lat: 16.8839981,
      lng: 74.6451396,
      link: 'https://maps.app.goo.gl/o3p9HnWbcLktECBK6',
    },
  },
  {
    company: 'renewables',
    label: 'Sangam Renewables & Electrosystems LLP, Office',
    lines: [
      'Plot No. 3, Sri Laxmi Nivasa, MB Patil Nagar',
      'Besides New BLDE Campus (AS Patil), Solapur Road',
      'Vijayapur, Karnataka 586 103',
    ],
    gstin: '29AFIFS5127B1Z0',
    map: {
      lat: 16.8302122,
      lng: 75.709535,
      link: 'https://maps.app.goo.gl/bLirdS984bnvFcF17',
    },
  },
]

/** Named on the leadership page of the Sangam Renewables profile. */
export interface Person {
  name: string
  qualification?: string
  roles: { company: CompanyKey; title: string }[]
  /**
   * Direct line. Same `{ display, href }` shape as `GROUP.phones`, so it feeds
   * a `tel:` link the same way every other number on the site does. Two of
   * these are the group's published lines — the people who answer them are
   * named here rather than the numbers being repeated as a second fact.
   */
  phone?: { display: string; href: string }
  /**
   * Registry key for the portrait. Optional: a member whose photograph is not
   * yet on file gets the monogram fallback in `TeamCard` rather than an empty
   * frame, and gains the picture the moment a key is filled in here.
   */
  photo?: string
}

export const LEADERSHIP: Person[] = [
  {
    name: 'Ravikumar Bagali',
    qualification: 'B.E. (ECE)',
    roles: [
      { company: 'developers', title: 'Proprietor' },
      { company: 'renewables', title: 'Managing Partner' },
    ],
    phone: PHONES[0],
    photo: 'group/ravikumar-bagali',
  },
  {
    name: 'Datta Bamane',
    roles: [
      { company: 'renewables', title: 'Director & HOD — Electrical Department' },
    ],
    phone: { display: '+91 9890 558 677', href: '+919890558677' },
    photo: 'group/datta-bamane',
  },
  {
    name: 'Chindanand Hiremath',
    roles: [
      { company: 'renewables', title: 'General Manager & Accounts HOD' },
    ],
    phone: PHONES[1],
    photo: 'group/chindanand-hiremath',
  },
  {
    name: 'Siddharam Rajendra Houde',
    roles: [
      { company: 'renewables', title: 'General Manager & HOD — Civil Department' },
    ],
    phone: { display: '+91 9545 052 593', href: '+919545052593' },
    photo: 'group/siddharam-houde',
  },
]
