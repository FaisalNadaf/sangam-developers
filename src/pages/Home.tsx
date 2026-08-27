/** @format */

import { PageTransition } from "@/components/PageTransition";
import { Seo, SITE } from "@/components/Seo";
import { GroupHero } from "@/sections/GroupHero";
import { Divisions } from "@/sections/Divisions";
import { Capability } from "@/sections/Capability";
import { FeaturedProjects } from "@/sections/FeaturedProjects";
import { ClientStrip } from "@/sections/ClientStrip";
import { COMPANIES, GROUP, OFFICES } from "@/data/group";

const organisation = {
	"@context": "https://schema.org",
	"@type": "Organization",
	"@id": `${SITE}/#organisation`,
	name: GROUP.fullName,
	alternateName: "Sangam Group",
	url: SITE,
	description: GROUP.positioning,
	telephone: GROUP.phones.map((line) => line.display),
	email: GROUP.emails[0],
	areaServed: GROUP.states.map((state) => ({ "@type": "State", name: state })),
	subOrganization: COMPANIES.map((company) => ({
		"@type": "Organization",
		name: company.legalName,
		url: `${SITE}${company.path}`,
		foundingDate: String(company.establishedYear),
		description: company.role,
	})),
	address: OFFICES.filter((o) => !o.note).map((office) => ({
		"@type": "PostalAddress",
		streetAddress: office.lines[0],
		addressLocality: office.lines[1],
		addressRegion:
			office.company === "developers" ? "Maharashtra" : "Karnataka",
		addressCountry: "IN",
	})),
	hasCredential: [
		{ "@type": "EducationalOccupationalCredential", name: "ISO 9001:2015" },
		{ "@type": "EducationalOccupationalCredential", name: "ISO 45001:2018" },
	],
};

const website = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	"@id": `${SITE}/#website`,
	url: SITE,
	name: GROUP.fullName,
	publisher: { "@id": `${SITE}/#organisation` },
	inLanguage: "en-IN",
};

/**
 * The home page.
 *
 * A full viewport of hero, then four sections that each answer one question —
 * who the two companies are, what they build, what the work looks like, and
 * who commissions it. The detail behind each lives on its own page rather
 * than being restated here, and the close is the footer's own.
 */
export default function Home() {
	return (
		<PageTransition>
			<Seo
				title="Sangam Group of Companies: Renewable energy infrastructure"
				description="Land development, civil works, substations and 33 kV transmission for wind and solar projects across Maharashtra and Karnataka since 2017."
				path="/"
				schema={[organisation, website]}
			/>

			<GroupHero />
			<Divisions />
			<Capability />
			<FeaturedProjects />
			<ClientStrip />
		</PageTransition>
	);
}
