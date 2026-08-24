/**
 * ISO certification records, transcribed from the four certificate PDFs.
 * Certificate numbers, dates, scope and accreditation are exactly as issued.
 */

import type { CompanyKey } from './group'

export interface Certification {
  id: string
  company: CompanyKey
  standard: string
  /** Management system the standard covers, as printed on the certificate. */
  system: string
  /** What the standard is for, in plain language. */
  purpose: string
  certificateNo: string
  issued: string
  expires: string
  scope: string
  issuer: string
  accreditation: string
  verifyUrl: string
  image: string
  addressLines: string[]
}

const SCOPE =
  'Manufacturer of 33 kV Overhead Transmission Line Material including Cross Arms, Clamps & Channels and Fabricated Structures.'
const ISSUER = 'Quality Control Certification (QCC)'
const ACCREDITATION = 'Accredited by UASL, England, United Kingdom'
const VERIFY = 'http://uasl.uk.com/certifiedorganization'

const SD_ADDRESS = [
  '#122, Near Laxmi Temple Main Road, Morbagi 416413, Tal. Jath, Dist. Sangli, Maharashtra, India',
  'Factory: C/o Adhira Fabrication Works, At. Savali, Tal. Miraj, Dist. Sangli, Gat No. 206, Plot No. 9/10, M.I.D.C. Kanadwadi Road, Sangli 416436, Maharashtra, India',
]

const SRE_ADDRESS = [
  'Site No. 145/B, P. No. 3, Building No. 2331, Main Road, Sukoon Colony, SukooN Layout, Vijayapura, Karnataka 586103, India',
]

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'sd-9001',
    company: 'developers',
    standard: 'ISO 9001:2015',
    system: 'Quality Management System',
    purpose:
      'Sets how work is planned, checked and corrected so that what leaves the works matches what was specified.',
    certificateNo: 'QMS/AFFF/0925',
    issued: '10 September 2025',
    expires: '9 September 2028',
    scope: SCOPE,
    issuer: ISSUER,
    accreditation: ACCREDITATION,
    verifyUrl: VERIFY,
    image: 'certificates/sd-iso-9001',
    addressLines: SD_ADDRESS,
  },
  {
    id: 'sd-45001',
    company: 'developers',
    standard: 'ISO 45001:2018',
    system: 'Occupational Health and Safety Management Systems',
    purpose:
      'Sets how hazards are identified and controlled on live sites: at height, near energised lines and around plant.',
    certificateNo: 'OHSMS/B025/0925',
    issued: '10 September 2025',
    expires: '9 September 2028',
    scope: SCOPE,
    issuer: ISSUER,
    accreditation: ACCREDITATION,
    verifyUrl: VERIFY,
    image: 'certificates/sd-iso-45001',
    addressLines: SD_ADDRESS,
  },
  {
    id: 'sre-9001',
    company: 'renewables',
    standard: 'ISO 9001:2015',
    system: 'Quality Management System',
    purpose:
      'Sets how work is planned, checked and corrected so that what leaves the works matches what was specified.',
    certificateNo: 'QMS/832A/0426',
    issued: '10 April 2026',
    expires: '9 April 2029',
    scope: SCOPE,
    issuer: ISSUER,
    accreditation: ACCREDITATION,
    verifyUrl: VERIFY,
    image: 'certificates/sre-iso-9001',
    addressLines: SRE_ADDRESS,
  },
  {
    id: 'sre-45001',
    company: 'renewables',
    standard: 'ISO 45001:2018',
    system: 'Occupational Health and Safety Management Systems',
    purpose:
      'Sets how hazards are identified and controlled on live sites: at height, near energised lines and around plant.',
    certificateNo: 'OHSMS/76DD/0426',
    issued: '10 April 2026',
    expires: '9 April 2029',
    scope: SCOPE,
    issuer: ISSUER,
    accreditation: ACCREDITATION,
    verifyUrl: VERIFY,
    image: 'certificates/sre-iso-45001',
    addressLines: SRE_ADDRESS,
  },
]

export const certificationsFor = (company: CompanyKey) =>
  CERTIFICATIONS.filter((c) => c.company === company)
