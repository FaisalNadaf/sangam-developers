/** @format */

import { DISCIPLINES, type Discipline } from "@/data/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { AccordionGallery } from "@/components/AccordionGallery";
import { mediaSource } from "@/components/Media";
import { Reveal } from "@/components/Reveal";

/**
 * What the group actually builds.
 *
 * Six site photographs in an accordion, one open at a time. Hover, tap or
 * arrow-key moves between them, and the open plate names its discipline and
 * says in a line what the work is.
 *
 * The disciplines and their descriptions are taken from the scope lists in the
 * two profiles. `scope` is not on the page at present — the section used to
 * carry all six lists underneath the strip and no longer does — but it is kept
 * here rather than deleted, because this file is the only place several of
 * those lines are transcribed.
 */
const DETAIL: Record<
	Discipline,
	{ summary: string; scope: string[]; image: string }
> = {
	Transmission: {
		summary:
			"HV and EHV overhead lines: SPSC Panther and DOG conductor, right of way, stringing and grid connection.",
		scope: [
			"Construction of HV and EHV transmission lines",
			"Right of Way planning for internal and external lines",
			"Grid connectivity and power evacuation",
			"Pre-commissioning, testing and synchronisation",
		],
		image: "capability/tower-technician",
	},
	"Land development": {
		summary:
			"From raw parcels to a buildable site: aggregation, acquisition and NA conversion, then grading and staging.",
		scope: [
			"Land aggregation, acquisition and NA conversion",
			"Identification and preparation of WTG locations",
			"Dedicated WTG storage and staging yards",
			"Comprehensive land grading and site preparation",
		],
		image: "capability/site-grading",
	},
	"Civil works": {
		summary:
			"Foundations and platforms that carry turbines, modules and switchgear: piling, crane platforms and inverter rooms.",
		scope: [
			"WTG foundation works",
			"MMS piling for solar module mounting structures",
			"Crane platforms and foundation works",
			"Inverter rooms and plant buildings",
		],
		image: "capability/foundation-crew",
	},
	Substation: {
		summary:
			"EHV and HT substations, unit substations and DP yards, built, tested and handed over to the grid.",
		scope: [
			"Design and installation of EHV substations",
			"HT system integration",
			"DP yard construction",
			"Testing, commissioning and synchronisation with the grid",
		],
		image: "capability/substation-gantries",
	},
	"Solar EPC": {
		summary:
			"Rooftop and ground-mounted photovoltaic systems, cable works and inverters, through to commissioning.",
		scope: [
			"Rooftop and ground-mounted PV installation",
			"AC/DC MV cable laying and termination",
			"Inverter and LT panel installation",
			"Plant monitoring, commissioning and handover",
		],
		image: "capability/pv-commissioning",
	},
	Roads: {
		summary:
			"The internal and external roads that let a 60-metre blade reach a ridge: cut, graded and compacted.",
		scope: [
			"Construction of durable internal roads within the project site",
			"External connectivity roads for transportation and logistics",
			"Crane platform and hardstanding preparation",
			"Road maintenance across live sites",
		],
		image: "capability/road-cutting",
	},
};

const ACCENT = "var(--color-sd-deep)";

/** Bright enough to hold its own against a photograph. */
const PLATE_ACCENT = "var(--color-sd)";

/** Must stay a hex — the gallery appends an alpha pair to it. */
const PLATE_OVERLAY = "#0e1512";

/**
 * Only disciplines whose photograph actually resolves get a panel, so a
 * missing key drops out of the strip rather than opening a broken frame.
 */
const PANELS = DISCIPLINES.map((discipline) => ({
	discipline,
	source: mediaSource(DETAIL[discipline].image),
})).flatMap(({ discipline, source }) =>
	source ?
		[
			{
				image: source.src,
				srcSet: source.srcSet,
				color: source.color,
				alt: source.alt,
				label: discipline,
				meta: DETAIL[discipline].summary,
			},
		]
	:	[],
);

export function Capability() {
	return (
		<section
			id="capability"
			className="section-y ground-tint scroll-mt-24"
			aria-labelledby="capability-heading">
			<div className="shell">
				<SectionHeader
					id="capability-heading"
					eyebrow="Capability"
					lines={["Six disciplines, one site team."]}
					accent={ACCENT}
					align="wide"
				/>

				{/*
          One photograph at a time by design. Six site plates at equal size
          compete with each other and none of them is legible; one open plate
          at nearly half the row is large enough to read the work in it, and
          the five slivers beside it are the index.
        */}
				<Reveal className="mt-12 lg:mt-16">
					<AccordionGallery
						items={PANELS}
						defaultIndex={0}
						accentColor={PLATE_ACCENT}
						overlayColor={PLATE_OVERLAY}
						height={520}
						gap={10}
						radius={20}
						expandRatio={0.44}
						duration={0.7}
						tilt={6}
						dim={0.4}
						parallax={0.5}
						trigger="hover"
						sizes="(max-width: 640px) 92vw, (max-width: 1024px) 60vw, 44vw"
					/>
				</Reveal>
			</div>
		</section>
	);
}
