/**
 * Sangam Renewables & Electrosystems LLP — content transcribed from
 * Sangam_Renewables_company_profile (24 pages).
 */

export const RENEWABLES = {
  /** Verbatim from the About page. */
  intro:
    'We are a forward-thinking renewable energy company specializing in solar and wind power solutions. Our goal is to deliver efficient, cost-effective, and environmentally responsible energy systems for residential, commercial, and industrial sectors.',
  /** Verbatim from the About page. */
  incorporation:
    'Sangam Renewables & Electrosystems LLP is a dynamic engineering and infrastructure firm incorporated on June 24, 2024. Headquartered in Karnataka, the firm was established to provide comprehensive technical solutions and land development services within the renewable energy sector.',
  /** Verbatim. */
  mission:
    'To design and deliver high-quality solar and wind energy solutions that reduce carbon footprint, optimise energy use and empower communities with sustainable power.',
  /** Verbatim. */
  vision:
    'To become a leading force in transforming global energy consumption by making renewable energy accessible, affordable and reliable for everyone.',
  /** Verbatim from "Our Value Proposition". */
  valueProposition:
    'We specialize in bridging the gap between raw land and operational energy sites. Our team excels in navigating the regulatory landscape of NA Conversion while delivering high-specification Civil and Electrical works. By partnering with industry leaders like Suzlon and Waaree, we continue to contribute to India’s green energy transition through precision, reliability, and local expertise.',
  /** Verbatim from "Core Competencies & Project Experience". */
  competencies:
    'Since its inception, Sangam Renewables & Electrosystems LLP has demonstrated rapid growth, successfully executing critical infrastructure projects for renewable energy companies. Our expertise spans land development, civil engineering, and complex electrical transmission.',
  values: [
    'Sustainability',
    'Innovation',
    'Customer Commitment',
    'Quality Excellence',
    'Environmental Responsibility',
  ],
  principles: [
    'Ethical Business',
    'Decision Making',
    'Respect Human Rights',
    'Being Truthful',
  ],
} as const

/** Figures printed on the "Why Choose Us?" page of the profile. */
export const RENEWABLES_FIGURES = [
  { value: 100, suffix: '%', label: 'Satisfied customers' },
  { value: 185234, label: 'Panels installed' },
  { value: 101000, suffix: ' kWh', label: 'Produced' },
] as const

/**
 * The six services printed in the profile.
 *
 * Each carries the photograph the page shows it with — a key into the media
 * registry. The profiles have no photograph of most of these six services, so
 * these are licensed frames from `media-sourced.json` rather than the company's
 * own site photography, chosen to depict the work itself rather than to
 * decorate the card. The key lives here rather than on the page because a
 * service without a picture of the work is not something the page will show.
 */
export const SERVICES = [
  {
    title: 'Solar panel installation',
    detail: 'Rooftop and ground-mounted photovoltaic systems.',
    image: 'renewables/rooftop-install-crew',
  },
  {
    title: 'Wind turbine solutions',
    detail: 'Turbine locations, foundations and balance-of-plant works.',
    image: 'renewables/wind-farm-scrub',
  },
  {
    title: 'Hybrid energy systems',
    detail: 'Combined solar, wind and storage configurations.',
    image: 'renewables/solar-wind-aerial',
  },
  {
    title: 'Energy consultation',
    detail: 'Feasibility, yield and approvals advice.',
    image: 'renewables/site-survey-level',
  },
  {
    title: 'Maintenance & support',
    detail: 'Operational support after handover.',
    image: 'renewables/inverter-testing',
  },
  {
    title: 'Energy audits',
    detail: 'Assessment of existing consumption and losses.',
    image: 'renewables/meter-board',
  },
] as const

export const SECTORS = [
  {
    key: 'residential',
    title: 'Residential',
    detail:
      'Smart rooftop solar systems, hybrid power solutions, and energy storage systems designed to reduce electricity bills and ensure reliable power for homes and housing communities.',
  },
  {
    key: 'commercial',
    title: 'Commercial',
    detail:
      'Efficient renewable solutions for office spaces, retail outlets, malls, hotels, business parks, and commercial complexes to optimize operational costs and improve energy management.',
  },
  {
    key: 'industrial',
    title: 'Industrial',
    detail:
      'High-capacity solar and wind solutions for factories, warehouses, manufacturing units, and production facilities, enabling uninterrupted operations and reduced dependency on conventional power sources.',
  },
  {
    key: 'agricultural',
    title: 'Agricultural',
    detail:
      'Solar-powered irrigation pumps, rural electrification systems, water pumping solutions, and sustainable energy support for farms and agri-based operations.',
  },
  {
    key: 'institutional',
    title: 'Institutional',
    detail:
      'Reliable clean energy systems for schools, colleges, universities, hospitals, research centers, and government organizations focused on operational efficiency and environmental responsibility.',
  },
] as const

/** Solar scope, from the "Solar Energy" pages. */
export const SOLAR_SCOPE = [
  {
    title: 'Project development & approvals',
    items: [
      'Identification of optimal project locations',
      'Coordination with government and regulatory authorities',
      'Assistance in obtaining licenses and statutory approvals',
      'Grid connectivity and Nodal agency approvals',
    ],
  },
  {
    title: 'Engineering',
    items: [
      'Feasibility analysis and energy yield estimation',
      'Basic and detailed engineering design',
      'Geological and topographical assessments',
      'Civil, mechanical, and structural design execution',
      'Electrical design (LT/HT systems) and specifications',
      'Grid integration and connection design',
    ],
  },
  {
    title: 'Construction & execution',
    items: [
      'End-to-end project management',
      'Detailed planning, scheduling, and progress tracking',
      'Seamless coordination with clients and stakeholders',
      'Strict quality control and contractor management',
    ],
  },
  {
    title: 'Commissioning & handover',
    items: [
      'Preparation of technical documentation and drawings',
      'Comprehensive quality checks and testing',
      'System installation and commissioning',
      'Smooth project handover with complete support',
    ],
  },
] as const

/** Wind scope, from the "Wind Energy" pages. */
export const WIND_SCOPE = [
  {
    title: 'Land development',
    items: [
      'Identification and preparation of Wind Turbine Generator (WTG) locations',
      'Development of internal access roads for smooth operations',
      'Right of Way (ROW) planning for internal and external transmission lines',
      'Dedicated WTG storage and staging yards',
      'Comprehensive land grading and site preparation',
    ],
  },
  {
    title: 'Road development',
    items: [
      'Construction of durable internal roads within the project site',
      'Development of external connectivity roads for transportation and logistics',
    ],
  },
  {
    title: 'Substation construction & commissioning',
    items: [
      'Design and installation of EHV (Extra High Voltage) substations',
      'HT (High Tension) system integration',
      'Testing, commissioning, and synchronization with the grid',
    ],
  },
  {
    title: 'Power evacuation & infrastructure',
    items: [
      'Efficient power evacuation planning and execution',
      'Grid connectivity solutions for seamless energy transfer',
      'Design and implementation of evacuation systems ensuring minimal losses',
    ],
  },
] as const

export const SOLAR_COMPONENTS = [
  'Solar PV modules',
  'Module mounting structures',
  'Array junction box (AJB)',
  'Inverter',
  'LT panel',
  'Earthing & lightning protection system',
  'Solar DC cables',
  'AC cables',
  'Plant monitoring system',
] as const

export const WIND_COMPONENTS = [
  'Wind turbine generator (WTG)',
  'Rotor blades',
  'Nacelle: gearbox, generator, controller',
  'Tower structure',
  'Transformer',
  'Substation',
  'Transmission lines',
  'SCADA & monitoring system',
] as const

export const USP = [
  'Customized energy solutions',
  'Expert team with industry experience',
  'Latest technology integration',
  'End-to-end service',
  'Cost-effective systems',
  'After-sales support',
] as const

export const RENEWABLE_BENEFITS = [
  'Reduced electricity costs',
  'Lower carbon emissions',
  'Energy independence',
  'Sustainable future',
  'Government incentives',
] as const
