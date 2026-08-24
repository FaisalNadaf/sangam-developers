/**
 * Sangam Developers — content transcribed from Sangam_Developers_Profile 2025-26.
 * Verbatim source statements are marked; everything else is a shortened
 * restatement of a source list, with no facts added.
 */

export const DEVELOPERS = {
  /**
   * From the Company Profile page, written as a complete sentence.
   *
   * The source prints both as clauses that continue a printed heading — "is a
   * reliable and high-quality supply…" — so the page used to render "Sangam
   * Developers is a reliable and high-quality supply with electric power",
   * which says the company is a supply. Same commitment, stated as a sentence.
   */
  mission:
    'To provide a reliable, high-quality supply of electric power produced from renewable energy sources.',
  /** From the Company Profile page. See the note on `mission`. */
  vision:
    'To establish the company as a leader in the renewable energy sector in India.',
  /** Verbatim from the Company Overview page. */
  overview:
    'To promote and harness wind energy for all-inclusive, sustained growth, now and in the future. To campaign for this “Green Revolution” (clean energy) so that it reaches the economy, business and rural employment, and contributes towards self-reliance to meet the growing need for power. Sangam Developers will strive towards high efficiency in energy generation through the best technologies and cost efficiency through large volume. Strive to achieve prominence of wind energy in the energy mix to conserve depleting fossil fuels. Spread the message on the use of green power to lessen the adverse effect of global warming and climate change.',
  values: [
    'Integrity',
    'Professionalism',
    'Honesty',
    'Accountability',
    'Commitment to customers',
  ],
  principles: [
    'Ethical Business',
    'Decision Making',
    'Respect Human Rights',
    'Being Truthful',
  ],
  /** Footnote printed under the project register. */
  alliedNote:
    'Also carrying the businesses of property developments and allied services.',
} as const

/** "How We Do?" — the two-stage delivery sequence printed in the profile. */
export interface Stage {
  label: string
  steps: string[]
}

export const DELIVERY: Stage[] = [
  {
    label: 'Project planning',
    steps: [
      'Site survey',
      'Preliminary plan design',
      'Technical and economical due diligence',
      'Component selection',
      'Final approval drawings and design',
    ],
  },
  {
    label: 'Project implementation',
    steps: [
      'Preparation of land',
      'Civil work: foundation works, road work, crane platform',
      'Electrical work: construction of HV and EHV transmission lines, substations, unit substations',
      'Pre-commissioning and testing',
      'Grid connectivity and power evacuation',
      'Final commissioning',
    ],
  },
]

export interface CapabilityGroup {
  title: string
  items: string[]
}

/** From the "Solar Energy" page of the profile. */
export const SOLAR_CAPABILITY: CapabilityGroup[] = [
  {
    title: 'Promotion',
    items: [
      'Identifying location of appropriate project sites',
      'Discussion with necessary authorities',
      'Conducting basic processes for obtaining licenses and procedural permits',
      'Obtaining connectivity and Nodal agency approval',
    ],
  },
  {
    title: 'Engineering',
    items: [
      'Suitability and estimation of production',
      'Basic and detailed engineering',
      'Conduct geological and topographical studies',
      'Execute civil works design',
      'Mechanical design and specs definition',
      'Electrical LV/HV design and specs definition',
      'Grid connection design and specs definition',
    ],
  },
  {
    title: 'Construction',
    items: [
      'Project management',
      'Planning and schedules / follow up',
      'Coordination with customers',
      'Quality contractor assurance',
    ],
  },
  {
    title: 'Commissioning',
    items: [
      'Document and drawing of the executed project',
      'Detailed quality review',
      'Project set up',
      'Project commissioning',
      'Project handover to owner',
    ],
  },
]

/** From the "Wind Energy" page of the profile. */
export const WIND_CAPABILITY: CapabilityGroup[] = [
  {
    title: 'Land development',
    items: [
      'WTG location',
      'Internal roads',
      'ROW for internal and external lines',
      'WTG storage yards',
    ],
  },
  {
    title: 'Laying of roads',
    items: ['Internal roads', 'External roads'],
  },
  {
    title: 'Substation construction & commissioning',
    items: ['EHV', 'HT'],
  },
  {
    title: 'Transmission lines',
    items: ['EHV', 'HT'],
  },
  {
    title: 'Power evacuation',
    items: ['Evacuation of generated power to the grid'],
  },
]
