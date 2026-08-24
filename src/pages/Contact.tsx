/** @format */

import { Mail, MapPin, Phone } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Seo, SITE, breadcrumb } from "@/components/Seo";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { COMPANIES, GROUP, LEADERSHIP, OFFICES } from "@/data/group";

const schema = {
	"@context": "https://schema.org",
	"@type": "ContactPage",
	url: `${SITE}/contact`,
	mainEntity: {
		"@type": "Organization",
		"@id": `${SITE}/#organisation`,
		name: GROUP.fullName,
		telephone: GROUP.phone,
		email: GROUP.emails[0],
		contactPoint: COMPANIES.map((company, i) => ({
			"@type": "ContactPoint",
			contactType: "sales",
			name: company.legalName,
			telephone: GROUP.phone,
			email: GROUP.emails[i],
			areaServed: "IN",
			availableLanguage: ["en", "hi", "kn", "mr"],
		})),
	},
};

export default function Contact() {
	const lead = LEADERSHIP[0];

	return (
		<PageTransition>
			<Seo
				title="Contact Sangam Group: Sangli and Vijayapur"
				description="One direct line for both Sangam companies: +91 8975 262 895. Offices in Sangli, Maharashtra and Vijayapur, Karnataka. Send a site enquiry."
				path="/contact"
				image="/media/developers/sunset-poles-1280.webp"
				schema={[schema, breadcrumb([{ name: "Contact", path: "/contact" }])]}
			/>

			<PageHeader
				eyebrow="Contact"
				lines={["One line for both companies."]}
				intro="Call, or send the site, the scope and the timeline. Both companies answer on one line, and the reply comes from the people doing the work."
				image="developers/sunset-poles"
				imageAlt="Newly strung transmission poles running across farmland at sunset">
				<a
					href={`tel:${GROUP.phoneHref}`}
					className="group inline-flex items-center gap-3 rounded-chip bg-paper px-6 py-3 font-sans text-[0.9375rem] font-bold text-ink shadow-lift transition-[transform,box-shadow] duration-400 ease-out-expo hover:-translate-y-0.5 hover:shadow-plate">
					<Phone
						className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
						strokeWidth={2}
						aria-hidden="true"
					/>
					{GROUP.phone}
				</a>
			</PageHeader>

			{/* ── Reaching them, and writing to them ──────────────────────────
          The two sit side by side. A reader who only wants the number should
          not have to scroll past a form to reach it, and a reader who wants
          the form finds it where a form usually is. The channels take the
          narrower column because a phone number and two addresses are short,
          and a form is not.
      */}
			<section
				className="section-y ground-paper"
				aria-labelledby="enquiry-heading">
				<div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
					{/* Left — the direct channels */}
					<div className="lg:col-span-5">
						<SectionHeader
							id="reach-heading"
							eyebrow="Direct"
							lines={["Phone first. Email second."]}
						/>

						<div className="mt-8 grid gap-4">
							<Reveal direction="left">
								<div>
									<a
										href={`tel:${GROUP.phoneHref}`}
										className="group relative flex flex-col overflow-hidden rounded-card p-7 shadow-card transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift md:p-8"
										style={{ background: "var(--color-brand)" }}>
										<span
											className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 transition-transform duration-700 ease-out-expo group-hover:scale-125"
											aria-hidden="true"
										/>
										<span className="relative flex h-13 w-13 items-center justify-center rounded-full bg-white/16 transition-transform duration-500 ease-spring group-hover:scale-110">
											<Phone
												className="h-6 w-6 text-white"
												strokeWidth={1.5}
												aria-hidden="true"
											/>
										</span>
										<div className="relative mt-7">
											<p className="t-label text-white">
												Direct line for both companies
											</p>
											<p className="t-h2 mt-3 text-white">{GROUP.phone}</p>
											<p className="t-small mt-4 text-white/90">
												{lead.name}, {lead.qualification},{" "}
												{lead.roles.map((r) => r.title).join(" and ")}
											</p>
										</div>
									</a>
								</div>
							</Reveal>

							{COMPANIES.map((company, i) => (
								<Reveal
									key={company.key}
									direction="left"
									delay={0.08 * (i + 1)}>
									<div>
										<a
											href={`mailto:${GROUP.emails[i]}`}
											className="card card-interactive group flex items-start gap-4 p-6 md:p-7">
											<span
												className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
												style={{
													background: `color-mix(in srgb, ${company.accent} 12%, transparent)`,
												}}>
												<Mail
													className="h-5 w-5"
													style={{ color: company.accentOnBone }}
													strokeWidth={1.5}
													aria-hidden="true"
												/>
											</span>
											<div className="min-w-0">
												<p
													className="t-label"
													style={{ color: company.accentOnBone }}>
													{company.name}
												</p>
												<p className="t-body mt-2 font-bold break-all text-ink transition-colors duration-300 group-hover:text-brand">
													{GROUP.emails[i]}
												</p>
											</div>
										</a>
									</div>
								</Reveal>
							))}
						</div>
					</div>

					{/* Right — the enquiry form */}
					<div className="lg:col-span-7">
						<SectionHeader
							id="enquiry-heading"
							eyebrow="Send an enquiry"
							lines={["Tell us about the site."]}
						/>
						<Reveal
							direction="right"
							className="mt-8">
							<ContactForm />
						</Reveal>
					</div>
				</div>
			</section>

			{/* ── The three registered addresses, each on its own map ─────────
          A row of maps rather than a column of address blocks. The question a
          reader has here is "where is that", and an address only answers it
          if you already know the district.

          Each frame opens on the pin the company dropped itself, carried in
          `office.map` rather than resolved from the address text: a geocoded
          address lands somewhere on the road, and two of these three are a
          works unit and a house on a plot, which is exactly the case geocoding
          gets wrong. "Open in Maps" uses the original share link, so it opens
          the place card rather than an unnamed pin.

          The frames load lazily. Three map embeds fetched eagerly would cost
          more than the rest of the page put together.
      */}
			<section
				className="section-y ground-tint"
				aria-labelledby="offices-heading">
				<div className="shell">
					<SectionHeader
						id="offices-heading"
						eyebrow="Where we are"
						lines={["Either side of the border."]}
						accent="var(--color-sd-deep)"
						align="wide"
					/>

					<Stagger
						as="ul"
						className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6"
						each={0.08}>
						{OFFICES.map((office) => {
							const company = COMPANIES.find((c) => c.key === office.company);
							const { lat, lng, link } = office.map;

							return (
								<StaggerItem
									as="li"
									key={office.label}>
									<article className="card group flex h-full flex-col overflow-hidden">
										<div className="relative aspect-4/3 shrink-0 overflow-hidden bg-canvas-3">
											<iframe
												title={`Map showing ${office.label}`}
												src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
												loading="lazy"
												referrerPolicy="no-referrer-when-downgrade"
												className="h-full w-full border-0"
											/>
										</div>

										<div className="flex flex-1 flex-col p-6">
											{company && (
												<p
													className="t-label"
													style={{ color: company.accentOnBone }}>
													{company.name}
												</p>
											)}
											<h3 className="t-h3 mt-2 text-ink">
												{office.label.replace(/^.*?,\s*/, "")}
											</h3>

											<address className="t-small mt-3 text-muted not-italic">
												{office.lines.map((line) => (
													<span
														key={line}
														className="block">
														{line}
													</span>
												))}
											</address>

											{office.note && (
												<p className="t-small mt-3 text-muted">{office.note}</p>
											)}

											<div className="mt-auto pt-5">
												{office.gstin && (
													<p className="t-data rounded-chip bg-canvas-2 px-3 py-2 text-muted">
														GSTIN {office.gstin}
													</p>
												)}
												<a
													href={link}
													target="_blank"
													rel="noreferrer noopener"
													className="mt-4 inline-flex items-center gap-2 t-label text-brand transition-transform duration-400 ease-out-expo hover:translate-x-0.5">
													<MapPin
														className="h-3.5 w-3.5"
														strokeWidth={2}
														aria-hidden="true"
													/>
													Open in Maps
												</a>
											</div>
										</div>
									</article>
								</StaggerItem>
							);
						})}
					</Stagger>
				</div>
			</section>
		</PageTransition>
	);
}
