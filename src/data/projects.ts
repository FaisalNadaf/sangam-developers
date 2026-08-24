/**
 * The project register.
 *
 * Rows 1–26 are transcribed from "Details of Projects Completed" in the
 * Sangam Developers profile. Rows SR1–SR9 are transcribed from "Details of
 * Projects Completed" in the Sangam Renewables profile.
 *
 * Values, clients, dates and statuses are exactly as printed. Where the source
 * left a cell blank it is left undefined here rather than filled in.
 */

import type { CompanyKey } from './group'
import type { MarkKey } from './logos'

export type ProjectStatus = 'Commissioned' | 'Completed' | 'In Progress' | 'In Hand' | '90% Completed'

export type Discipline =
  | 'Transmission'
  | 'Substation'
  | 'Land development'
  | 'Civil works'
  | 'Solar EPC'
  | 'Roads'

export interface Project {
  id: string
  company: CompanyKey
  /** Title rewritten for the web from the source description; no facts added. */
  title: string
  /**
   * The register's own description of the work.
   *
   * Corrected for spelling, unit casing and stray capitals only — "Trasmission"
   * to "Transmission", "33KV" to "33 kV" — because this string is printed on
   * every project card and the register's own typing was reaching the reader.
   * No number, client, place or date is altered; `title` remains the rewritten
   * version and the two still agree line for line.
   */
  source: string
  client: string
  location?: string
  /** Scale as printed — km of line, MW, acres, number of locations. */
  scale?: string
  /** Contract value as printed (Lakh / Cr). */
  value?: string
  duration: string
  /** Sort key: first year of the duration. */
  year: number
  status: ProjectStatus
  discipline: Discipline
  /** Key into media.json, where a representative site photograph exists. */
  image?: string
}

export const PROJECTS: Project[] = [
  // ── Sangam Developers ────────────────────────────────────────────────────
  {
    id: 'SD-01',
    company: 'developers',
    title: '50 MW solar PV power project',
    source: '50 MW solar PV power project in Karnataka under Adani Power',
    client: 'Wardha Solar',
    location: 'Karnataka',
    scale: '50 MW',
    value: '85 Lakh',
    duration: '01/2017 – 10/2017',
    year: 2017,
    status: 'Commissioned',
    discipline: 'Solar EPC',
    image: 'renewables/solar-rows-aerial',
  },
  {
    id: 'SD-02',
    company: 'developers',
    title: '30 MW solar PV power project',
    source: '30 MW solar PV power project in Karnataka under SI Power',
    client: 'Snider Electric',
    location: 'Karnataka',
    scale: '30 MW',
    value: '60 Lakh',
    duration: '02/2017 – 06/2017',
    year: 2017,
    status: 'Commissioned',
    discipline: 'Solar EPC',
  },
  {
    id: 'SD-03',
    company: 'developers',
    title: '15 km 33 kV Panther transmission line, Ilkal wind project',
    source: '15 km 33 kV Panther transmission line for Suzlon Energy at the Ilkal wind project',
    client: 'Suzlon Energy',
    location: 'Ilkal, Karnataka',
    scale: '15 km · 33 kV',
    value: '4.5 Cr',
    duration: '03/2017 – 03/2018',
    year: 2017,
    status: 'Commissioned',
    discipline: 'Transmission',
    image: 'developers/conductor-stringing',
  },
  {
    id: 'SD-04',
    company: 'developers',
    title: 'MMS piling, 30 MW AMP solar plant',
    source: 'MMS piling work in the 30 MW AMP Solar SPP at Bandalli',
    client: 'Gamesa',
    location: 'Bandalli',
    scale: '30 MW',
    value: '90 Lakh',
    duration: '10/2017 – 02/2018',
    year: 2017,
    status: 'Commissioned',
    discipline: 'Civil works',
    image: 'developers/mms-assembly',
  },
  {
    id: 'SD-05',
    company: 'developers',
    title: 'MMS piling, 30 MW Atria solar power project',
    source:
      'MMS piling work in the 30 MW Atria Solar Power Project at Kohali, Bellary district, Karnataka',
    client: 'Gamesa',
    location: 'Kohali, Bellary, Karnataka',
    scale: '30 MW',
    value: '75 Lakh',
    duration: '01/2018 – 08/2018',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Civil works',
  },
  {
    id: 'SD-06',
    company: 'developers',
    title: 'Inverter rooms, 30 MW Atria solar power project',
    source:
      'Inverter rooms for the 30 MW Atria Solar Power Project at Kohali, Bellary district, Karnataka',
    client: 'Gamesa',
    location: 'Kohali, Bellary, Karnataka',
    scale: '30 MW',
    value: '90 Lakh',
    duration: '01/2018 – 08/2018',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Civil works',
  },
  {
    id: 'SD-07',
    company: 'developers',
    title: '12 km 33 kV DOG line, Bableshwar wind farm phase 2',
    source: '12 km 33 kV DOG transmission line at the Bableshwar Wind Farm phase 2 project',
    client: 'Gamesa',
    location: 'Bableshwar',
    scale: '12 km · 33 kV',
    value: '3.5 Cr',
    duration: '01/2018 – 04/2018',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Transmission',
    image: 'developers/lattice-field',
  },
  {
    id: 'SD-08',
    company: 'developers',
    title: 'AC/DC MV cable laying, 60 MW Avaada solar',
    source: 'AC/DC MV cable laying and termination at 60 MW Avaada Solar, Ilkal, Karnataka',
    client: 'Gamesa',
    location: 'Ilkal, Karnataka',
    scale: '60 MW',
    value: '60 Lakh',
    duration: '02/2018 – 03/2018',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Solar EPC',
  },
  {
    id: 'SD-09',
    company: 'developers',
    title: 'WTG foundation works',
    source: 'WTG foundation work for Siemens Gamesa',
    client: 'Gamesa',
    value: '3.75 Cr',
    duration: '12/2018 – 02/2019',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Civil works',
    image: 'renewables/roller-wtg-base',
  },
  {
    id: 'SD-10',
    company: 'developers',
    title: '50 km of 33 kV transmission line, Lohara and Kavaldhara',
    source: '50 km of 33 kV transmission line work at Lohara and Kavaldhara',
    client: 'Gamesa',
    location: 'Lohara & Kavaldhara',
    scale: '50 km · 33 kV',
    value: '12 Cr',
    duration: '11/2018 – 12/2019',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Transmission',
    image: 'developers/dp-structure',
  },
  {
    id: 'SD-11',
    company: 'developers',
    title: '25 DP yards, Lohara and Kavaldhara',
    source: '25 nos. of DP yard work at Lohara and Kavaldhara',
    client: 'Gamesa',
    location: 'Lohara & Kavaldhara',
    scale: '25 yards',
    value: '2.75 Cr',
    duration: '11/2018 – 12/2019',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Substation',
    image: 'developers/dp-structure-2',
  },
  {
    id: 'SD-12',
    company: 'developers',
    title: 'Shed foundation and substation, Dalmia cement plant',
    source: 'Shed foundation and substation work at the Dalmia cement plant, Yadwad',
    client: 'Dalmia',
    location: 'Yadwad',
    value: '73 Lakh',
    duration: '06/2020 – 11/2020',
    year: 2020,
    status: 'Commissioned',
    discipline: 'Substation',
  },
  {
    id: 'SD-13',
    company: 'developers',
    title: '110 kV transmission line, Vijayapura',
    source: '110 kV transmission line work at Vijayapura',
    client: 'KPTCL (Basaveshwar Ele Pvt Ltd)',
    location: 'Vijayapura, Karnataka',
    scale: '110 kV',
    value: '4 Cr',
    duration: '2021',
    year: 2021,
    status: 'Commissioned',
    discipline: 'Transmission',
    image: 'developers/substation-lattice',
  },
  {
    id: 'SD-14',
    company: 'developers',
    title: 'Road maintenance, Kanamadi',
    source: 'Road maintenance work at Kanamadi',
    client: 'Acciona Energy',
    location: 'Kanamadi',
    value: '2.5 Cr',
    duration: '2021',
    year: 2021,
    status: 'Commissioned',
    discipline: 'Roads',
    image: 'renewables/access-road',
  },
  {
    id: 'SD-15',
    company: 'developers',
    title: 'Substation building repair',
    source: 'Substation building repair work',
    client: 'Acciona Energy',
    value: '1.2 Cr',
    duration: '04/2018 – 07/2018',
    year: 2018,
    status: 'Commissioned',
    discipline: 'Substation',
  },
  {
    id: 'SD-16',
    company: 'developers',
    title: 'Land aggregation and development, Gadag',
    source: 'Land aggregation and development work at Gadag',
    client: 'ReNew Power',
    location: 'Gadag, Karnataka',
    value: '18 Cr',
    duration: 'from July 2022',
    year: 2022,
    status: 'Commissioned',
    discipline: 'Land development',
    image: 'developers/row-corridor',
  },
  {
    id: 'SD-17',
    company: 'developers',
    title: '55 km of 33 kV transmission line, RTC1 Gadag',
    source: '55 km of 33 kV transmission line work at RTC1 Gadag',
    client: 'ReNew Power',
    location: 'Gadag, Karnataka',
    scale: '55 km · 33 kV',
    value: '20 Cr',
    duration: 'Oct 2023',
    year: 2023,
    status: 'Commissioned',
    discipline: 'Transmission',
    image: 'developers/dusk-line',
  },
  {
    id: 'SD-18',
    company: 'developers',
    title: 'Road and platform works for WTG erection',
    source: 'Road and platform work for WTG erection',
    client: 'ReNew Power',
    value: '3 Cr',
    duration: 'Dec 2022',
    year: 2022,
    status: 'Commissioned',
    discipline: 'Roads',
    image: 'renewables/haul-road',
  },
  {
    id: 'SD-19',
    company: 'developers',
    title: 'Land aggregation and development, Solapur',
    source: 'Land aggregation and development work at Solapur, Maharashtra',
    client: 'ReNew Power',
    location: 'Solapur, Maharashtra',
    value: '20 Cr',
    duration: 'Ongoing',
    year: 2024,
    status: 'In Progress',
    discipline: 'Land development',
  },
  {
    id: 'SD-20',
    company: 'developers',
    title: 'Land aggregation and development, Koppal',
    source: 'Land aggregation and development work at Koppal, Karnataka',
    client: 'Suzlon Energy',
    location: 'Koppal, Karnataka',
    value: '15 Cr',
    duration: 'Ongoing',
    year: 2024,
    status: 'In Progress',
    discipline: 'Land development',
  },
  {
    id: 'SD-21',
    company: 'developers',
    title: '25 km 33 kV SPSC Panther and DOG line, Tuljapur',
    source: '33 kV transmission line work at Tuljapur, 25 km of SPSC Panther and DOG line',
    client: 'ReNew Power',
    location: 'Tuljapur',
    scale: '25 km · 33 kV',
    value: '11.38 Cr',
    duration: 'from Dec 2024',
    year: 2024,
    status: '90% Completed',
    discipline: 'Transmission',
    image: 'developers/tower-erection',
  },
  {
    id: 'SD-22',
    company: 'developers',
    title: '10 km 33 kV SPSC Panther and DOG line, Kakamari',
    source:
      '33 kV transmission line work at Kakamari village, 10 km of SPSC Panther and DOG line',
    client: 'CMES Jupiter Private Limited (CleanMax)',
    location: 'Kakamari',
    scale: '10 km · 33 kV',
    value: '1.57 Cr',
    duration: 'from Feb 2025',
    year: 2025,
    status: 'Commissioned',
    discipline: 'Transmission',
  },
  {
    id: 'SD-23',
    company: 'developers',
    title: '5 km SPDC line, Kallam',
    source: '33 kV transmission line work at Kallam site village, 5 km of SPDC work',
    client: 'Serentica Renewables India 4 Pvt Ltd',
    location: 'Kallam',
    scale: '5 km · 33 kV',
    value: '1.75 Cr',
    duration: 'from Feb 2025',
    year: 2025,
    status: 'In Progress',
    discipline: 'Transmission',
  },
  {
    id: 'SD-24',
    company: 'developers',
    title: 'Land acquisition across 10 locations, Aland',
    source: 'Land acquisition work at the Aland site, Karnataka, across 10 locations',
    client: 'JSW Renew Energy Nine Limited',
    location: 'Aland, Karnataka',
    scale: '10 locations',
    value: '8.30 Cr',
    duration: 'from April 2025',
    year: 2025,
    status: 'In Progress',
    discipline: 'Land development',
    image: 'developers/pole-transport',
  },
  {
    id: 'SD-25',
    company: 'developers',
    title: '60 km 33 kV SPSC Panther and DOG line, Ilkal',
    source: '33 kV transmission line work at Ilkal, 60 km of SPSC Panther and DOG line',
    client: 'Suzion Southern Project Ltd',
    location: 'Ilkal, Karnataka',
    scale: '60 km · 33 kV',
    value: '25 Cr',
    duration: 'from May 2025',
    year: 2025,
    status: 'In Progress',
    discipline: 'Transmission',
    image: 'developers/tower-lineman',
  },
  {
    id: 'SD-26',
    company: 'developers',
    title: '10 km 33 kV SPSC Panther and DOG line, Jagalur',
    source:
      '33 kV transmission line work at Jagalur village, 10 km of SPSC Panther and DOG line',
    client: 'CMES Jupiter Private Limited (CleanMax)',
    location: 'Jagalur',
    scale: '10 km · 33 kV',
    value: '2.5 Cr',
    duration: 'from June 2025',
    year: 2025,
    status: 'In Progress',
    discipline: 'Transmission',
    image: 'developers/crane-material',
  },

  // ── Sangam Renewables & Electrosystems LLP ───────────────────────────────
  {
    id: 'SR-01',
    company: 'renewables',
    title: 'Land aggregation and development, Bagewadi',
    source: 'Land aggregation and development work (Bagewadi site, Karnataka)',
    client: 'Suzlon Renewable Development Ltd',
    location: 'Bagewadi, Karnataka',
    scale: '24 nos.',
    value: '14.94 Cr',
    duration: 'from Sep 2024',
    year: 2024,
    status: 'In Progress',
    discipline: 'Land development',
    image: 'renewables/wind-hilltop',
  },
  {
    id: 'SR-02',
    company: 'renewables',
    title: 'Land development, Kanamadi solar site',
    source: 'Land development (Kanamadi solar site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Kanamadi, Karnataka',
    scale: '400 acres',
    value: '5.42 Cr',
    duration: 'from Dec 2024',
    year: 2024,
    status: 'In Progress',
    discipline: 'Land development',
    image: 'renewables/gravel-road',
  },
  {
    id: 'SR-03',
    company: 'renewables',
    title: 'NA conversion, Kanamadi solar site',
    source: 'NA conversion work (Kanamadi solar site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Kanamadi, Karnataka',
    scale: '400 acres',
    value: '4.01 Cr',
    duration: 'from Dec 2024',
    year: 2024,
    status: 'In Progress',
    discipline: 'Land development',
  },
  {
    id: 'SR-04',
    company: 'renewables',
    title: 'Waaree inverter and solar project',
    source: 'Waaree inverter and solar project',
    client: 'Waaree Technologies Ltd',
    scale: '100 kW',
    value: '5.00 Cr',
    duration: 'from Sep 2024',
    year: 2024,
    status: 'In Progress',
    discipline: 'Solar EPC',
    image: 'renewables/inverter',
  },
  {
    id: 'SR-05',
    company: 'renewables',
    title: 'ITC SPSC Panther 33 kV transmission and ROW, Honawad',
    source:
      'ITC SPSC Panther 33 kV transmission and ROW (Honawad site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Honawad, Karnataka',
    scale: '10.00 km · 33 kV',
    value: '1.51 Cr',
    duration: 'from Oct 2025',
    year: 2025,
    status: 'In Progress',
    discipline: 'Transmission',
    image: 'renewables/ht-line-field',
  },
  {
    id: 'SR-06',
    company: 'renewables',
    title: 'ITC SPSC Panther 33 kV transmission and ROW, Jagaluru',
    source:
      'ITC SPSC Panther 33 kV transmission and ROW (Jagaluru site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Jagaluru, Karnataka',
    scale: '7.16 km · 33 kV',
    value: '0.70 Cr',
    duration: 'from Aug 2025',
    year: 2025,
    status: 'Completed',
    discipline: 'Transmission',
    image: 'renewables/crane-erection',
  },
  {
    id: 'SR-07',
    company: 'renewables',
    title: 'OFC cable erection, Jagaluru',
    source: 'OFC cable erection (Jagaluru site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Jagaluru, Karnataka',
    scale: '17.00 km',
    value: '0.09 Cr',
    duration: 'from Aug 2025',
    year: 2025,
    status: 'Completed',
    discipline: 'Transmission',
    image: 'renewables/cable-laying',
  },
  {
    id: 'SR-08',
    company: 'renewables',
    title: 'Civil works, Kanamadi solar site',
    source: 'Civil work (Kanamadi solar site, Karnataka)',
    client: 'CMES Jupiter Pvt Ltd',
    location: 'Kanamadi, Karnataka',
    scale: '6.00 km',
    value: '0.96 Cr',
    duration: 'from Oct 2025',
    year: 2025,
    status: 'Completed',
    discipline: 'Civil works',
    image: 'renewables/compactor',
  },
  {
    id: 'SR-09',
    company: 'renewables',
    title: 'WTG foundation civil works',
    source: 'Civil work (WTG foundation)',
    client: 'Sunsure Energy',
    scale: '300 MW',
    value: '6.50 Cr',
    duration: 'from Apr 2026',
    year: 2026,
    status: 'In Hand',
    discipline: 'Civil works',
    image: 'renewables/drill-rig',
  },
]

export const DISCIPLINES: Discipline[] = [
  'Transmission',
  'Land development',
  'Civil works',
  'Substation',
  'Solar EPC',
  'Roads',
]

/** Named clients, taken only from the client pages and project registers. */
/**
 * Client sectors.
 *
 * The names and the company each one appears under are transcribed from the
 * two project registers. `sector` is an editorial grouping added for the
 * clientele page — it describes what kind of organisation each client is, not
 * anything about the work done for them.
 */
export type ClientSector =
  | 'Turbine & module manufacturers'
  | 'Independent power producers'
  | 'State utilities'
  | 'Industry'

export const CLIENT_SECTORS: { key: ClientSector; blurb: string }[] = [
  {
    key: 'Turbine & module manufacturers',
    blurb:
      'The people who supply the machines, contracting the ground and grid works that let them be installed.',
  },
  {
    key: 'Independent power producers',
    blurb:
      'Owners and developers of the plants themselves, from land assembly through to evacuation.',
  },
  {
    key: 'State utilities',
    blurb:
      'Distribution and transmission licensees in Maharashtra and Karnataka.',
  },
  { key: 'Industry', blurb: 'Industrial plants taking on their own generation and civil works.' },
]

export interface Client {
  name: string
  company: CompanyKey[]
  sector: ClientSector
  /**
   * How this client is written in the `client` column of the register, where
   * that differs from the name it trades under. Without these the tally below
   * silently reports zero for a client that plainly has work on the books.
   */
  registerNames?: string[]
  /**
   * The client's own mark, as printed on the "Our Valuable Clients" page of
   * one of the two profiles. Absent for the two clients that appear only in
   * the register text, where no mark was published to cut.
   */
  logo?: MarkKey
}

export const CLIENTS: Client[] = [
  {
    name: 'Adani Solar',
    company: ['developers'],
    sector: 'Turbine & module manufacturers',
    logo: 'adani-solar',
  },
  {
    name: 'Acciona',
    company: ['developers'],
    sector: 'Independent power producers',
    registerNames: ['Acciona'],
    logo: 'acciona',
  },
  {
    name: 'ReNew Power',
    company: ['developers'],
    sector: 'Independent power producers',
    logo: 'renew-power',
  },
  {
    name: 'Siemens Gamesa',
    company: ['developers'],
    sector: 'Turbine & module manufacturers',
    registerNames: ['Gamesa'],
    logo: 'siemens-gamesa',
  },
  {
    name: 'Suzlon',
    company: ['developers', 'renewables'],
    sector: 'Turbine & module manufacturers',
    // 'Suzion' is the spelling used on one row of the source register.
    registerNames: ['Suzlon', 'Suzion'],
    logo: 'suzlon',
  },
  {
    name: 'JSW Energy',
    company: ['developers'],
    sector: 'Independent power producers',
    registerNames: ['JSW'],
    logo: 'jsw-energy',
  },
  {
    name: 'CleanMax',
    company: ['developers', 'renewables'],
    sector: 'Independent power producers',
    registerNames: ['CleanMax', 'CMES Jupiter'],
    logo: 'cleanmax',
  },
  {
    name: 'Mahavitaran (MSEDCL)',
    company: ['developers'],
    sector: 'State utilities',
    logo: 'mahavitaran',
  },
  {
    name: 'KPTCL',
    company: ['developers'],
    sector: 'State utilities',
    registerNames: ['KPTCL'],
    logo: 'kptcl',
  },
  {
    name: 'HESCOM',
    company: ['developers'],
    sector: 'State utilities',
    logo: 'hescom',
  },
  {
    name: 'Waaree',
    company: ['renewables'],
    sector: 'Turbine & module manufacturers',
    registerNames: ['Waaree'],
    logo: 'waaree',
  },
  {
    name: 'Sunsure Energy',
    company: ['renewables'],
    sector: 'Independent power producers',
    logo: 'sunsure',
  },
  {
    name: 'Serentica Renewables',
    company: ['developers'],
    sector: 'Independent power producers',
    registerNames: ['Serentica'],
    logo: 'serentica',
  },
  { name: 'Dalmia', company: ['developers'], sector: 'Industry', logo: 'dalmia' },
]

/**
 * Register rows contracted by a given client.
 *
 * Some clients appear on the site's client list without being the contracting
 * party on any row — they are named in the profiles' own client pages instead.
 * Those return an empty list, and the UI says so rather than printing a zero.
 */
export const entriesForClient = (client: Client) => {
  const needles = (client.registerNames ?? [client.name]).map((n) => n.toLowerCase())
  return PROJECTS.filter((p) => needles.some((n) => p.client.toLowerCase().includes(n)))
}

const byCompany = (key: CompanyKey) => PROJECTS.filter((p) => p.company === key)

/** Literal tallies of the register — no estimates. */
export const REGISTER_COUNTS = {
  total: PROJECTS.length,
  developers: byCompany('developers').length,
  renewables: byCompany('renewables').length,
  clients: CLIENTS.length,
  delivered: PROJECTS.filter(
    (p) => p.status === 'Commissioned' || p.status === 'Completed',
  ).length,
  active: PROJECTS.filter(
    (p) => p.status === 'In Progress' || p.status === 'In Hand' || p.status === '90% Completed',
  ).length,
  earliestYear: Math.min(...PROJECTS.map((p) => p.year)),
}

export const projectsFor = byCompany
