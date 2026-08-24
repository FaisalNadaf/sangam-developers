/** @format */

import { PageTransition } from "@/components/PageTransition";
import { Seo, SITE, breadcrumb } from "@/components/Seo";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/Button";
import { WhySangam } from "@/sections/WhySangam";
import { Leadership, leadershipSchema } from "@/sections/Leadership";
import { Certification } from "@/sections/Certification";
import { Community } from "@/sections/Community";
import { GROUP } from "@/data/group";

/**
 * One page now covers the group, its partners and its certificates, so the
 * employee list that used to be the `/team` page's schema lives here.
 */
const aboutSchema = {
	"@context": "https://schema.org",
	"@type": "AboutPage",
	url: `${SITE}/about`,
	name: "About Sangam Group of Companies",
	mainEntity: {
		"@type": "Organization",
		"@id": `${SITE}/#organisation`,
		name: GROUP.fullName,
		employee: leadershipSchema,
	},
};

export default function About() {
	return (
		<PageTransition>
			<Seo
				title="About Sangam Group: Two companies, one operation"
				description="How Sangam Developers and Sangam Renewables fit together: shared leadership, shared clients and one certified system across a project’s whole ground layer."
				path="/about"
				image="/media/developers/site-team-1280.webp"
				schema={[aboutSchema, breadcrumb([{ name: "About Us", path: "/about" }])]}
			/>

			<PageHeader
				eyebrow="About us"
				lines={["Two companies, one operation."]}
				intro="Sangam Developers and Sangam Renewables share one proprietor, one direct line and one client list. Between them they cover every layer of a site below the turbine."
				image="developers/lattice-field"
				imageAlt="Line of lattice transmission towers crossing open agricultural land">
				<div className="flex flex-wrap gap-3">
					<LinkButton
						to="/about#team"
						variant="invert"
						size="md">
						Meet the team
					</LinkButton>
					<LinkButton
						to="/about#certificates"
						variant="glass"
						size="md"
						arrow={false}>
						See the certificates
					</LinkButton>
				</div>
			</PageHeader>

			<WhySangam />

			<Leadership />

			<Certification />

			<Community />
		</PageTransition>
	);
}
