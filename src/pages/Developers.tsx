/** @format */

import {
	Cable,
	HardHat,
	LandPlot,
	PlugZap,
	Route,
	ShieldCheck,
	Sun,
	Users,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Seo, SITE, breadcrumb } from "@/components/Seo";
import { PageHeader } from "@/components/PageHeader";
import { LinkButton } from "@/components/Button";
import {
	CompanyAbout,
	StatRail,
	CapabilityGrid,
	VisionMission,
	type Capability,
} from "@/components/company";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { CERTIFICATIONS } from "@/data/certifications";
import { companyByKey, GROUP } from "@/data/group";
import { CLIENTS, projectsFor } from "@/data/projects";
import { DEVELOPERS } from "@/data/developers";

/**
 * Sangam Developers.
 *
 * Six sections: masthead, about, figures, what we do, projects, vision and
 * mission. It used to run to nine, and the four that went were a full
 * eleven-step delivery schedule, the complete capability list off both the
 * solar and the wind pages of the profile, the twenty-six-row register table
 * and a site-photograph grid — between them most of the page's height and
 * almost none of its argument. The register lives on `/projects`, which is
 * built to filter and compare it; the certificates live on `/about`, where
 * both companies' are shown together and can be opened.
 *
 * Everything below is passed to the shared blocks in `components/company`, so
 * this page and `/renewables` cannot drift apart again.
 */

const COMPANY = companyByKey("developers");
/** Ink cut, for type on the light grounds. */
const ACCENT = COMPANY.accentOnBone;
/** Bright cut, for fills, frames and the dark band. */
const ACCENT_BRIGHT = COMPANY.accent;

const PROJECTS = projectsFor("developers");
const PICTURED = PROJECTS.filter((p) => p.image);
const CLIENT_COUNT = CLIENTS.filter((c) =>
	c.company.includes("developers"),
).length;
const DISCIPLINES = new Set(PROJECTS.map((p) => p.discipline)).size;

const schema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Sangam Developers",
	url: `${SITE}/developers`,
	foundingDate: "2016-03",
	slogan: COMPANY.tagline,
	description: COMPANY.role,
	telephone: GROUP.phones.map((line) => line.display),
	email: GROUP.emails[0],
	parentOrganization: {
		"@type": "Organization",
		name: "Sangam Group of Companies",
		"@id": `${SITE}/#organisation`,
	},
	address: {
		"@type": "PostalAddress",
		streetAddress: "#102, Main Road, Morbagi",
		addressLocality: "Tal. Jath, Dist. Sangli",
		addressRegion: "Maharashtra",
		postalCode: "416413",
		addressCountry: "IN",
	},
};

/**
 * What the company does, drawn from the disciplines it is actually on the
 * register for and from the capability headings in its own profile. Nothing
 * here is a line of work the profile does not name.
 */
const CAPABILITIES: Capability[] = [
	{
		icon: (
			<Cable
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Transmission lines",
		detail:
			"EHV and HT overhead line at 33 kV and 110 kV, strung across Maharashtra and Karnataka.",
		image: "developers/line-conductor-work",
	},
	{
		icon: (
			<PlugZap
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Substations",
		detail:
			"EHV and HT substation construction, commissioning and power evacuation to the grid.",
		image: "developers/switchyard-gantry",
	},
	{
		icon: (
			<LandPlot
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Land development",
		detail:
			"WTG locations, right of way for internal and external lines, and turbine storage yards.",
		image: "developers/land-levelling",
	},
	{
		icon: (
			<Route
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Roads",
		detail:
			"Internal site roads and the external connectivity a turbine convoy needs to reach them.",
		image: "developers/road-compaction",
	},
	{
		icon: (
			<HardHat
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Civil works",
		detail:
			"Foundations, crane platforms and site preparation, ahead of erection.",
		image: "developers/foundation-rebar",
	},
	{
		icon: (
			<Sun
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: "Solar",
		detail:
			"Promotion and approvals through engineering, construction and commissioning.",
		image: "developers/solar-array-crew",
	},
];

const STATS = [
	{
		value: PROJECTS.length,
		label: "Projects",
		detail: "On the published register, since 2017",
		icon: (
			<HardHat
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
	},
	{
		value: CLIENT_COUNT,
		label: "Clients",
		detail: "Manufacturers, IPPs and state utilities",
		icon: (
			<Users
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
	},
	{
		value: DISCIPLINES,
		label: "Disciplines",
		detail: "Land through to energisation",
		icon: (
			<Route
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
	},
	{
		value: CERTIFICATIONS.filter((c) => c.company === "developers").length,
		label: "ISO certificates",
		detail: "9001 quality and 45001 safety, current",
		icon: (
			<ShieldCheck
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
	},
];

export default function Developers() {
	return (
		<PageTransition>
			<Seo
				title="Sangam Developers: Transmission and civil works since 2016"
				description="33 kV and 110 kV transmission lines, EHV and HT substations, WTG foundations and land development for wind and solar projects. 26 projects on register."
				path="/developers"
				image="/media/developers/substation-lattice-1280.webp"
				schema={[
					schema,
					breadcrumb([{ name: "Sangam Developers", path: "/developers" }]),
				]}
			/>

			{/* ── 1 · Masthead ──────────────────────────────────────────────── */}
			<PageHeader
				eyebrow="Sangam Developers · since March 2016"
				lines={["Lines that reach the grid."]}
				intro="Transmission lines, EHV substations, foundations and land development, built since 2016 for the wind and solar plants of Suzlon, ReNew Power and Adani Solar."
				image="developers/substation-lattice"
				imageAlt="Lattice tower and switchyard gantry at an EHV substation built by Sangam Developers"
				accent={ACCENT_BRIGHT}
				mark="sangam-developers"
				markAlt="Sangam Developers logo">
				<LinkButton
					to="/developers#sd-projects"
					accent={ACCENT_BRIGHT}
					variant="invert"
					size="md">
					See the projects
				</LinkButton>
			</PageHeader>

			{/* ── 2 · About ─────────────────────────────────────────────────── */}
			<CompanyAbout
				id="sd-about"
				eyebrow="The company"
				lines={["The ground layer of wind power."]}
				body="A proprietorship founded in March 2016 by Mr. Ravikumar Bagali, B.E. (ECE). It builds the ground layer of wind and solar plants across Maharashtra and Karnataka, and also carries on property development and allied services."
				values={DEVELOPERS.values}
				image="developers/conductor-stringing"
				imageAlt="Linesman stringing conductor on a 33 kV double-pole structure"
				accent={ACCENT}
			/>

			{/* ── 3 · Stats ─────────────────────────────────────────────────── */}
			<StatRail
				id="sd-figures"
				eyebrow="By the numbers"
				lines={["Since 2016, on the record."]}
				accent={ACCENT}
				stats={STATS}
			/>

			{/* ── 4 · What we do ────────────────────────────────────────────── */}
			<CapabilityGrid
				id="sd-scope"
				eyebrow="What we do"
				lines={["Land, line and substation."]}
				intro={
					<p>
						Six lines of work, taken singly or as one contract from bare land
						through to power evacuation.
					</p>
				}
				accent={ACCENT}
				frame={ACCENT_BRIGHT}
				items={CAPABILITIES}
			/>

			{/* ── 5 · Projects ──────────────────────────────────────────────── */}
			<ProjectCarousel
				id="sd-projects"
				eyebrow="Projects"
				lines={["Built, strung and energised."]}
				accent={ACCENT}
				projects={PICTURED}
				company="developers"
			/>

			{/* ── 6 · Vision & mission ──────────────────────────────────────── */}
			<VisionMission
				id="sd-purpose"
				eyebrow="Vision & mission"
				lines={["What the company is for."]}
				accent={ACCENT}
				vision={DEVELOPERS.vision}
				mission={DEVELOPERS.mission}
			/>
		</PageTransition>
	);
}
