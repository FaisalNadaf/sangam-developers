/** @format */

import {
	ClipboardCheck,
	Gauge,
	HardHat,
	Layers,
	Route,
	ShieldCheck,
	Sun,
	Users,
	Wind,
	Wrench,
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
import { companyByKey } from "@/data/group";
import { CLIENTS, projectsFor } from "@/data/projects";
import { RENEWABLES, SERVICES } from "@/data/renewables";

/**
 * Sangam Renewables & Electrosystems LLP.
 *
 * The same six sections as `/developers`, built from the same blocks. This
 * page had run to eleven, and what went was a five-sector breakdown, the full
 * solar and wind scope schedules, a component inventory, a "why choose us"
 * list, the register table, a site-photograph grid, the partner cards and the
 * certificates — around seven hundred lines saying, at length, what the six
 * service cards and the project rail now say at a glance. The partners are on
 * `/about#team` and the certificates on `/about#certificates`, where both
 * companies' are shown together.
 */

const COMPANY = companyByKey("renewables");
/** Ink cut, for type on the light grounds. */
const ACCENT = COMPANY.accentOnBone;
/** Bright cut, for fills, frames and the dark band. */
const ACCENT_BRIGHT = COMPANY.accent;

const PROJECTS = projectsFor("renewables");
const PICTURED = PROJECTS.filter((p) => p.image);
const CLIENT_COUNT = CLIENTS.filter((c) =>
	c.company.includes("renewables"),
).length;
const DISCIPLINES = new Set(PROJECTS.map((p) => p.discipline)).size;

const schema = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Sangam Renewables & Electrosystems LLP",
	url: `${SITE}/renewables`,
	foundingDate: "2024-06-24",
	slogan: COMPANY.tagline,
	description: COMPANY.role,
	telephone: "+91 8975 262 895",
	email: "sangamrenewables@gmail.com",
	parentOrganization: {
		"@type": "Organization",
		name: "Sangam Group of Companies",
		"@id": `${SITE}/#organisation`,
	},
	address: {
		"@type": "PostalAddress",
		streetAddress: "Plot No. 3, Sri Laxmi Nivasa, MB Patil Nagar, Solapur Road",
		addressLocality: "Vijayapur",
		addressRegion: "Karnataka",
		postalCode: "586103",
		addressCountry: "IN",
	},
};

/**
 * The six services printed in the profile, in the profile's own order. The
 * titles, detail lines and photographs come straight from
 * `data/renewables`; only the icon is chosen here.
 */
const SERVICE_ICONS = [Sun, Wind, Layers, ClipboardCheck, Wrench, Gauge];

const CAPABILITIES: Capability[] = SERVICES.map((service, i) => {
	// Falls back rather than indexing past the end: a seventh service added to
	// the profile should reach the page without a blank icon slot crashing it.
	const Icon = SERVICE_ICONS[i] ?? Layers;
	return {
		icon: (
			<Icon
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
		title: service.title,
		detail: service.detail,
		image: service.image,
	};
});

const STATS = [
	{
		value: PROJECTS.length,
		label: "Projects",
		detail: "On the published register, since 2024",
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
		detail: "Including Suzlon and Waaree",
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
		detail: "Land, civil, transmission and solar",
		icon: (
			<Route
				className="h-5 w-5"
				strokeWidth={1.6}
				aria-hidden="true"
			/>
		),
	},
	{
		value: CERTIFICATIONS.filter((c) => c.company === "renewables").length,
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

export default function Renewables() {
	return (
		<PageTransition>
			<Seo
				title="Sangam Renewables & Electrosystems LLP: Land to grid"
				description="Land development and NA conversion, civil and electrical works, and solar and wind energy solutions across Karnataka. Part of Sangam Group."
				path="/renewables"
				image="/media/renewables/solar-farm-1280.webp"
				schema={[
					schema,
					breadcrumb([{ name: "Sangam Renewables", path: "/renewables" }]),
				]}
			/>

			{/* ── 1 · Masthead ──────────────────────────────────────────────── */}
			<PageHeader
				eyebrow="Sangam Renewables & Electrosystems LLP · since June 2024"
				lines={["Raw land to operational site."]}
				intro="Land aggregation and NA conversion, high-specification civil and electrical works, and solar and wind energy systems, from raw land through to grid connection."
				image="renewables/solar-farm"
				imageAlt="Utility-scale ground-mounted solar array running toward a rocky hill range"
				accent={ACCENT_BRIGHT}
				mark="sangam-renewables"
				markAlt="Sangam Renewables & Electrosystems LLP logo">
				<LinkButton
					to="/renewables#sr-projects"
					accent={ACCENT_BRIGHT}
					variant="invert"
					size="md">
					See the projects
				</LinkButton>
			</PageHeader>

			{/* ── 2 · About ─────────────────────────────────────────────────── */}
			<CompanyAbout
				id="sr-about"
				eyebrow="The company"
				lines={["Bridging land and generation."]}
				body="An engineering and infrastructure firm incorporated on 24 June 2024, headquartered in Karnataka. It takes a site from raw land to operational: NA conversion, civil and electrical works, and solar and wind systems. Clients include Suzlon and Waaree."
				values={RENEWABLES.values}
				image="renewables/solar-green-field"
				imageAlt="Ground-mounted solar array on a green field site developed by Sangam Renewables"
				accent={ACCENT}
			/>

			{/* ── 3 · Stats ─────────────────────────────────────────────────── */}
			<StatRail
				id="sr-figures"
				eyebrow="By the numbers"
				lines={["Since 2024, on the record."]}
				accent={ACCENT}
				stats={STATS}
			/>

			{/* ── 4 · What we do ────────────────────────────────────────────── */}
			<CapabilityGrid
				id="sr-services"
				eyebrow="What we do"
				lines={["Solar, wind and the ground under both."]}
				intro={""}
				accent={ACCENT}
				frame={ACCENT_BRIGHT}
				items={CAPABILITIES}
			/>

			{/* ── 5 · Projects ──────────────────────────────────────────────── */}
			<ProjectCarousel
				id="sr-projects"
				eyebrow="Projects"
				lines={["Land cleared, line energised."]}
				accent={ACCENT}
				projects={PICTURED}
				company="renewables"
			/>

			{/* ── 6 · Vision & mission ──────────────────────────────────────── */}
			<VisionMission
				id="sr-purpose"
				eyebrow="Vision & mission"
				lines={["What the company is for."]}
				accent={ACCENT}
				vision={RENEWABLES.vision}
				mission={RENEWABLES.mission}
			/>
		</PageTransition>
	);
}
