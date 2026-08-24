/**
 * Logo manifest.
 *
 * Most marks here were cut from the company's own profile documents by
 * `tools/marks.py` — the two Sangam marks from the profile covers, the client
 * marks from the "Our Valuable Clients" pages of the Sangam Developers (p. 11)
 * and Sangam Renewables (p. 21) profiles.
 *
 * `serentica` and `dalmia` are the exceptions: neither profile printed a mark
 * for them, and both were supplied afterwards by the company. They went
 * through the same cut, so they carry the same alpha and the same trim, but
 * their sources were small and they are the two smallest files here.
 *
 * Nothing is redrawn and nothing comes from a logo library.
 *
 * Intrinsic sizes are the file's own, so every `<img>` can be given width and
 * height and reserve its box before the bytes arrive.
 *
 * Client marks remain the property of their owners and are reproduced here
 * only to identify the organisations that commissioned work on the register.
 */

export interface Mark {
  src: string
  w: number
  h: number
}

const mark = (name: string, w: number, h: number): Mark => ({
  src: `/media/logos/${name}.webp`,
  w,
  h,
})

export const MARKS = {
  'sangam-developers': mark('sangam-developers', 640, 537),
  'sangam-renewables': mark('sangam-renewables', 640, 360),
  acciona: mark('acciona', 640, 271),
  'adani-solar': mark('adani-solar', 640, 404),
  cleanmax: mark('cleanmax', 640, 153),
  dalmia: mark('dalmia', 140, 69),
  hescom: mark('hescom', 640, 680),
  'jsw-energy': mark('jsw-energy', 640, 465),
  kptcl: mark('kptcl', 640, 646),
  mahavitaran: mark('mahavitaran', 640, 404),
  'renew-power': mark('renew-power', 640, 207),
  serentica: mark('serentica', 166, 29),
  'siemens-gamesa': mark('siemens-gamesa', 640, 103),
  sunsure: mark('sunsure', 640, 150),
  suzlon: mark('suzlon', 640, 114),
  waaree: mark('waaree', 640, 190),
} as const

export type MarkKey = keyof typeof MARKS
