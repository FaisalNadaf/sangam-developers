/** @format */

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import {
	CertificationCard,
	CertificateLightbox,
} from "@/components/CertificationCard";
import { Stagger, StaggerItem } from "@/components/Reveal";
import {
	CERTIFICATIONS,
	type Certification as Cert,
} from "@/data/certifications";

/**
 * The four certificates.
 *
 * Lifted out of the former `/certificates` page when the About branch was
 * folded into one page, and cut to the records themselves on the way.
 *
 * Two things went. A pair of sections listing what ISO 9001 and ISO 45001
 * require ran to a full screen each, and neither said anything about this
 * group — they described the standards, which the standards bodies describe
 * better, and each card already carries the one line that matters about its
 * own. And a "verify" band repeated every certificate number and expiry date
 * from the cards above it, under a link to the accrediting body that each card
 * also carries. The cards were always the page; the rest was scaffolding
 * around them.
 *
 * A third thing has since gone: the two per-company sub-headings this used to
 * be split under. Four certificates is the whole set, and holding it as one
 * row of four says the thing the split was trying to say — both companies,
 * both standards, one system — in a single glance rather than in two stacked
 * halves you have to scroll between and compare from memory. `CERTIFICATIONS`
 * is already ordered by company, so the row still reads left to right as
 * Developers, Developers, Renewables, Renewables, and each card names and
 * colours its own company.
 */
export function Certification() {
	const [cert, setCert] = useState<Cert | null>(null);

	return (
		<section
			id="certificates"
			className="section-y ground-canvas band-top scroll-mt-24"
			aria-labelledby="certs-heading">
			<div className="shell">
				<SectionHeader
					id="certs-heading"
					eyebrow="Certificates"
					lines={["Open any one and read it."]}
				
					align="wide"
				/>

				<Stagger
					className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6"
					each={0.09}>
					{CERTIFICATIONS.map((c) => (
						<StaggerItem key={c.id}>
							<CertificationCard
								cert={c}
								onOpen={setCert}
							/>
						</StaggerItem>
					))}
				</Stagger>

	
			</div>

			<CertificateLightbox
				cert={cert}
				onClose={() => setCert(null)}
			/>
		</section>
	);
}
