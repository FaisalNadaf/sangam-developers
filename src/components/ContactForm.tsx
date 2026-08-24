import { useState, type FormEvent } from 'react'
import { AlertCircle, Check, Send } from 'lucide-react'
import { GROUP } from '@/data/group'
import { DISCIPLINES } from '@/data/projects'

/**
 * Enquiry form.
 *
 * The site is a static build with no server behind it, so rather than pretend
 * to POST somewhere and silently drop the message, the form validates in full
 * and then hands a composed, pre-filled email to the reader's own mail client.
 * The message is theirs either way, and nothing is lost if it never sends.
 *
 * If a backend or form service is added later, replace the `mailto:` handoff
 * in `onSubmit` — the validation and error states already work.
 */

interface Fields {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  scope: string
  location: string
  message: string
}

const EMPTY: Fields = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  scope: '',
  location: '',
  message: '',
}

type Errors = Partial<Record<keyof Fields, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us who you are.'
  if (!values.email.trim()) errors.email = 'We need an address to reply to.'
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = 'That does not look like an email address.'
  if (!values.subject.trim()) errors.subject = 'One line on what this is about.'
  if (!values.location.trim())
    errors.location = 'Village, taluka and district, or the nearest town.'
  if (!values.message.trim()) errors.message = 'A sentence or two about the work is enough.'
  else if (values.message.trim().length < 20)
    errors.message = 'A little more detail would help us reply usefully.'
  return errors
}

export function ContactForm() {
  const [values, setValues] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [sent, setSent] = useState(false)

  const set = (key: keyof Fields) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    // Re-validate a field the moment it stops being wrong, so the error clears
    // as soon as it is fixed rather than on the next submit.
    if (touched[key]) setErrors(validate({ ...values, [key]: value }))
  }

  const blur = (key: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors(validate(values))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({
      name: true,
      email: true,
      phone: true,
      company: true,
      subject: true,
      scope: true,
      location: true,
      message: true,
    })
    if (Object.keys(found).length) {
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.focus()
      return
    }

    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      values.scope && `Scope: ${values.scope}`,
      `Site location: ${values.location}`,
      '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${GROUP.emails[0]}?subject=${encodeURIComponent(
      `Project enquiry: ${values.location}`,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Your name"
          required
          value={values.name}
          error={touched.name ? errors.name : undefined}
          onChange={set('name')}
          onBlur={blur('name')}
          autoComplete="name"
        />
        <Field
          id="email"
          type="email"
          label="Email"
          required
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={set('email')}
          onBlur={blur('email')}
          autoComplete="email"
        />
        <Field
          id="phone"
          type="tel"
          label="Phone"
          hint="Optional"
          value={values.phone}
          onChange={set('phone')}
          onBlur={blur('phone')}
          autoComplete="tel"
        />
        <Field
          id="company"
          label="Company"
          hint="Optional"
          value={values.company}
          onChange={set('company')}
          onBlur={blur('company')}
          autoComplete="organization"
        />
        <Field
          id="subject"
          label="Subject"
          required
          value={values.subject}
          error={touched.subject ? errors.subject : undefined}
          onChange={set('subject')}
          onBlur={blur('subject')}
        />
        <SelectField
          id="scope"
          label="Scope"
          hint="Optional"
          value={values.scope}
          onChange={set('scope')}
          options={DISCIPLINES}
        />
        <div className="sm:col-span-2">
          <Field
            id="location"
            label="Site location"
            required
            hint="Village, taluka and district"
            value={values.location}
            error={touched.location ? errors.location : undefined}
            onChange={set('location')}
            onBlur={blur('location')}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            id="message"
            label="About the work"
            required
            multiline
            hint="Scale, programme and whether NA conversion is done"
            value={values.message}
            error={touched.message ? errors.message : undefined}
            onChange={set('message')}
            onBlur={blur('message')}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 rounded-chip bg-brand px-6 py-3 font-sans text-[0.9375rem] font-bold text-white shadow-soft transition-[transform,box-shadow] duration-400 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
        >
          <Send
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
          Send enquiry
        </button>

        <p className="t-small text-muted" role="status" aria-live="polite">
          {sent ? (
            <span className="inline-flex items-center gap-2 text-brand">
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Your mail app should now be open with the message ready to send.
            </span>
          ) : (
            <>
              Opens in your mail app, addressed to{' '}
              <a
                href={`mailto:${GROUP.emails[0]}`}
                className="text-ink underline underline-offset-2 hover:text-brand"
              >
                {GROUP.emails[0]}
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  )
}

/* ── Field primitives ─────────────────────────────────────────────────── */

interface FieldProps {
  id: keyof Fields
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  required?: boolean
  multiline?: boolean
  type?: string
  autoComplete?: string
}

const controlClass = (invalid: boolean) =>
  `w-full rounded-tile border bg-canvas px-4 py-3 t-body text-ink transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-muted focus:bg-paper focus:outline-none ${
    invalid
      ? 'border-laterite focus:border-laterite'
      : 'border-line focus:border-brand focus:shadow-soft'
  }`

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required,
  multiline,
  type = 'text',
  autoComplete,
}: FieldProps) {
  const invalid = Boolean(error)
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="t-label text-ink">
          {label}
          {required && (
            <span className="ml-1 text-laterite" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && !error && (
          <span id={`${id}-hint`} className="t-small text-muted">
            {hint}
          </span>
        )}
      </div>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          required={required}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          data-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${controlClass(invalid)} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          data-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={controlClass(invalid)}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="t-small mt-2 flex items-center gap-1.5 text-laterite">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  hint,
}: {
  id: keyof Fields
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  hint?: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="t-label text-ink">
          {label}
        </label>
        {hint && <span className="t-small text-muted">{hint}</span>}
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${controlClass(false)} appearance-none`}
      >
        <option value="">Select a discipline</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="Combination">More than one of these</option>
      </select>
    </div>
  )
}
