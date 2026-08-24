/** @format */

import type { ReactNode } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { Media } from "./Media";
import { SectionHeader } from "./SectionHeader";
import { Reveal, ScaleIn, Stagger, StaggerItem } from "./Reveal";

/**
 * The company-page furniture.
 *
 * `/developers` and `/renewables` are the same page about two companies, so
 * they are now built from the same four blocks and differ only in the content
 * passed to them. Both pages previously ran to nine and eleven sections of
 * hand-rolled layout — around 1,200 lines between them, most of it two
 * near-identical copies of the same idea — which is how they drifted apart in
 * the first place.
 *
 * Everything here takes `accent`, so one company reads green and the other
 * blue without either page reaching for a colour of its own.
 */

/* ── About ────────────────────────────────────────────────────────────── */

/**
 * Who the company is, in one paragraph and one photograph.
 *
 * `values` are the company's own, printed as chips rather than as a bulleted
 * list: five one-word values set as list items took the vertical space of a
 * paragraph to say five words.
 */
export function CompanyAbout({
	id,
	eyebrow,
	lines,
	body,
	values,
	image,
	imageAlt,
	accent,
}: {
	id: string;
	eyebrow: string;
	lines: string[];
	/** Reading beside the marker. Optional: not every opener carries one. */
	meta?: string;
	body: string;
	values: readonly string[];
	image: string;
	imageAlt: string;
	accent: string;
}) {
	return (
		<section
			className="section-y ground-paper band-bottom"
			aria-labelledby={id}>
			<div className="shell">
				<SectionHeader
					id={id}
					eyebrow={eyebrow}
					lines={lines}
					accent={accent}
				/>

				<div className="mt-10 grid items-center gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-14">
					<ScaleIn className="lg:col-span-5">
						{/* 4:3 at every width, including desktop. A square plate in a
                five-of-twelve column is 520 px tall on a 1440 grid, which on
                its own is more than half the height budget this section has. */}
						<div className="relative aspect-4/3 overflow-hidden rounded-panel bg-canvas-3 shadow-card">
							<Media
								src={image}
								alt={imageAlt}
								sizes="(min-width: 1024px) 38vw, 92vw"
								className="transition-transform duration-1000 ease-out-expo hover:scale-105"
							/>
							<span
								className="pointer-events-none absolute inset-0 rounded-panel ring-1 ring-ink/10 ring-inset"
								aria-hidden="true"
							/>
							{/* The company's colour, struck along the foot of the plate — the
                  same device the page masthead uses at the foot of its band. */}
							<span
								className="absolute inset-x-0 bottom-0 h-1"
								style={{ background: accent }}
								aria-hidden="true"
							/>
						</div>
					</ScaleIn>

					<Reveal
						direction="right"
						delay={0.1}
						className="lg:col-span-7">
						<p className="t-lead text-body">{body}</p>

						<Stagger
							as="ul"
							className="mt-8 flex flex-wrap gap-2.5"
							each={0.05}>
							{values.map((value) => (
								<StaggerItem
									as="li"
									key={value}
									className="rounded-pill border border-line bg-canvas px-4 py-2 t-label text-muted transition-[border-color,color,transform] duration-400 ease-out-expo hover:-translate-y-0.5">
									{value}
								</StaggerItem>
							))}
						</Stagger>
					</Reveal>
				</div>
			</div>
		</section>
	);
}

/* ── Stats ────────────────────────────────────────────────────────────── */

export interface Stat {
	value: number;
	label: string;
	detail: string;
	icon: ReactNode;
}

/**
 * The company in four figures.
 *
 * Every value is passed in as a live tally of `data/projects.ts` or
 * `data/certifications.ts` rather than typed as a literal, so none of them can
 * drift away from the records they summarise — the same rule the group-level
 * `Stats` section follows.
 */
export function StatRail({
	id,
	eyebrow,
	lines,
	accent,
	stats,
}: {
	id: string;
	eyebrow: string;
	lines: string[];
	/** Reading beside the marker. Optional: not every opener carries one. */
	meta?: string;
	accent: string;
	stats: Stat[];
}) {
	return (
		<section
			className="section-y ground-tint"
			aria-labelledby={id}>
			<div className="shell">
				<SectionHeader
					id={id}
					eyebrow={eyebrow}
					lines={lines}
					accent={accent}
				/>

				<Stagger
					className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5"
					each={0.08}>
					{stats.map((stat) => (
						<StaggerItem key={stat.label}>
							<div className="h-full">
								<div className="card card-interactive group flex h-full flex-col p-6">
									<span
										className="flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-spring group-hover:scale-110"
										style={{
											background: `color-mix(in srgb, ${accent} 12%, transparent)`,
											color: accent,
										}}>
										{stat.icon}
									</span>
									<div>
										{/*
                      The reading is set in the company's own colour rather
                      than in ink. At this size it cannot win on scale — the
                      label under it is a serif heading and only half a step
                      smaller — so it wins on hue instead: the one coloured
                      thing in the card at a size worth reading is the figure,
                      and the eye goes there first without the type having to
                      grow. `accentOnBone` is the cut meant for type on paper,
                      so this stays well clear of the contrast floor where the
                      bright cut would not.
                    */}
										<p
											className="t-stat mt-4"
											style={{ color: accent }}>
											<Counter target={stat.value} />
										</p>
										<p className="t-h3 mt-2 text-ink">{stat.label}</p>
										<p className="t-small mt-1.5 text-muted">{stat.detail}</p>
									</div>
									<span
										className="mt-auto block h-1 w-10 origin-left rounded-pill transition-transform duration-500 ease-out-expo group-hover:scale-x-[2.4]"
										style={{ background: accent, marginTop: "1rem" }}
										aria-hidden="true"
									/>
								</div>
							</div>
						</StaggerItem>
					))}
				</Stagger>
			</div>
		</section>
	);
}

/**
 * A figure that counts up on first sight.
 *
 * `useCountUp` renders the final value immediately under reduced motion, so
 * the number is never withheld from anyone who asked for less movement.
 */
function Counter({ target }: { target: number }) {
	const { ref, value } = useCountUp(target, 1400);
	return <span ref={ref}>{value}</span>;
}

/* ── What we do ───────────────────────────────────────────────────────── */

export interface Capability {
	icon: ReactNode;
	title: string;
	detail: string;
	/**
	 * Registry key for the card's photograph. Required, not optional: a grid
	 * where four cards carry a picture and two carry a grey box reads as a
	 * loading state, so a line of work without a photograph on file does not
	 * belong in this section at all.
	 */
	image: string;
	/** Alt text. Falls back to the wording recorded with the asset. */
	imageAlt?: string;
}

/**
 * What the company actually does, one card per line of work.
 *
 * Three to a row and capped at six: the pages this replaces printed the whole
 * capability schedule from the profiles — thirty-odd bullet points under nine
 * headings, twice over — which is a document, not a section. The detail line
 * on each card is the summary; the register below it is the evidence.
 *
 * Every card carries a photograph of that line of work. The words on their own
 * asked the reader to picture six kinds of construction from a noun and a
 * sentence; the picture does that job before the sentence is read.
 *
 * The icon is kept, and sits **inside** the photograph's graded foot rather
 * than on the seam below it. Straddling the seam was the obvious placement and
 * the wrong one: half of the tile fell on the photograph and half on the
 * paper, so its own edge was the only thing holding it together, and it read
 * as a misalignment rather than as a badge. Fully inside the frame it has the
 * grade to sit on — which is what the grade is there for — and the copy below
 * can start on its title.
 */
export function CapabilityGrid({
	id,
	eyebrow,
	lines,
	intro,
	accent,
	frame,
	items,
}: {
	id: string;
	eyebrow: string;
	lines: string[];
	/** Reading beside the marker. Optional: not every opener carries one. */
	meta?: string;
	intro: ReactNode;
	/** Ink cut of the company colour, for type. */
	accent: string;
	/** Bright cut, for the card frame and the icon well. */
	frame: string;
	items: Capability[];
}) {
	return (
		<section
			className="section-y ground-paper band-top"
			aria-labelledby={id}>
			<div className="shell">
				<SectionHeader
					id={id}
					eyebrow={eyebrow}
					lines={lines}
					intro={intro}
					accent={accent}
					align="wide"
				/>

				<Stagger
					className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5"
					each={0.07}>
					{items.map((item) => (
						<StaggerItem key={item.title}>
							{/* The moving specular highlight is for bare surfaces. On a
							    card that is mostly photograph it lands as a white blob
							    sliding across the image, so it is off here as it is on
							    every other card the site gives a picture to. */}
							<div className="h-full">
								<div
									className="card-frame group flex h-full flex-col overflow-hidden"
									style={{ "--frame": frame } as React.CSSProperties}>
									<div className="relative aspect-3/2 shrink-0 overflow-hidden bg-canvas-3">
										<Media
											src={item.image}
											alt={
												item.imageAlt ??
												`${item.title} on a Sangam project site`
											}
											sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 90vw"
											className="transition-transform duration-1000 ease-out-expo group-hover:scale-105"
										/>
										{/* Graded at the foot, which is what the icon sits on. */}
										<div
											className="absolute inset-0 bg-linear-to-t from-deep/55 via-deep/5 to-transparent"
											aria-hidden="true"
										/>
										<span
											className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-tile shadow-lift transition-transform duration-500 ease-spring group-hover:scale-110"
											style={{
												background: `color-mix(in srgb, ${frame} 14%, var(--color-paper))`,
												color: accent,
											}}>
											{item.icon}
										</span>
									</div>

									<div className="flex flex-1 flex-col p-6 md:p-7">
										<div>
											<h3 className="t-h3 text-ink">{item.title}</h3>
											<p className="t-small mt-2 text-muted">{item.detail}</p>
										</div>
									</div>
								</div>
							</div>
						</StaggerItem>
					))}
				</Stagger>
			</div>
		</section>
	);
}

/* ── Vision & mission ─────────────────────────────────────────────────── */

/**
 * The page's closing statement.
 *
 * Two bands, alternating: a disc carrying the glyph, and a panel carrying the
 * words, with the disc set on the seam so the pair reads as one object rather
 * than as an icon parked beside a box. Mission leads and vision answers it
 * from the opposite side, which is what gives the section its rhythm — the
 * reader's eye crosses the page once rather than running down two identical
 * columns.
 *
 * It sits on paper rather than on the group's dark. That costs the page its
 * one dark ending, and buys the two statements the only treatment on the site
 * that is built around them: on the dark they were two cards among the many
 * card grids above, and these are the two sentences the company wrote about
 * itself.
 *
 * `accent` is the deep cut, not the bright one. Everything here is type or a
 * tint on white, and the bright cuts sit at 2.8:1 and 3.3:1 on paper — fine
 * for a rule, not for a heading.
 */
export function VisionMission({
	id,
	eyebrow,
	lines,
	accent,
	vision,
	mission,
}: {
	id: string;
	eyebrow: string;
	lines: string[];
	/** Deep cut of the company colour — this section sits on paper. */
	accent: string;
	vision: string;
	mission: string;
}) {
	return (
		<section
			className="section-y ground-paper band-top"
			aria-labelledby={id}>
			<div className="shell">
				<SectionHeader
					id={id}
					eyebrow={eyebrow}
					lines={lines}
					accent={accent}
				/>

				<div className="mt-12 flex flex-col gap-10 lg:mt-14 lg:gap-8">
					<Statement
						icon="/icons/mission.png"
						label="Our mission"
						body={mission}
						accent={accent}
					/>
					<Statement
						icon="/icons/vision.png"
						label="Our vision"
						body={vision}
						accent={accent}
						flip
						delay={0.1}
					/>
				</div>
			</div>
		</section>
	);
}

/**
 * One band.
 *
 * The band is held to a share of the shell and pushed to one side, rather than
 * running the full measure. That is what makes the composition: two blocks
 * offset against each other, with the heading sitting on the panel it belongs
 * to. Run full width, a two-line statement flattens into a strip and the disc
 * beside it has nothing to sit against.
 *
 * `flip` mirrors the whole band: which side it is pushed to, which side the
 * disc takes, which way the panel overlaps, and which edge the heading aligns
 * to. All four have to move together or the crossing breaks.
 *
 * The overlap is only asked for from `lg`. Below it the disc sits above the
 * panel and the band takes the full width, because at that size there is no
 * room to offset anything.
 */
function Statement({
	icon,
	label,
	body,
	accent,
	flip = false,
	delay = 0,
}: {
	/** Path to the glyph. Drawn as a mask, so the file's own colour is ignored. */
	icon: string;
	label: string;
	body: string;
	accent: string;
	flip?: boolean;
	delay?: number;
}) {
	const tint = `color-mix(in srgb, ${accent} 9%, var(--color-paper))`;
	const edge = `color-mix(in srgb, ${accent} 24%, var(--color-paper))`;

	return (
		<Reveal
			direction={flip ? "right" : "left"}
			delay={delay}
			className={`group lg:w-[76%] ${flip ? "" : "lg:ml-auto"}`}>
			<h3
				className={`t-h2 uppercase ${flip ? "" : "lg:text-right"}`}
				style={{ color: accent, letterSpacing: "0.03em" }}>
				{label}
			</h3>

			<div
				className={`mt-3 flex flex-col items-start gap-5 lg:mt-4 lg:flex-row lg:items-center lg:gap-0 ${
					flip ? "lg:flex-row-reverse" : ""
				}`}>
				<span
					className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-paper shadow-lift transition-transform duration-500 ease-spring group-hover:scale-105 lg:h-36 lg:w-36"
					style={{ border: `1px solid ${edge}` }}>
					{/*
            The glyph is a black PNG, so it is used as a mask rather than as an
            image: the alpha gives the shape and the accent paints it. One file
            serves both companies, in green on one page and blue on the other,
            instead of shipping a tinted copy of each icon per company.
          */}
					<span
						className="block h-11 w-11 lg:h-20 lg:w-20"
						style={{
							backgroundColor: accent,
							maskImage: `url("${icon}")`,
							WebkitMaskImage: `url("${icon}")`,
							maskSize: "contain",
							WebkitMaskSize: "contain",
							maskRepeat: "no-repeat",
							WebkitMaskRepeat: "no-repeat",
							maskPosition: "center",
							WebkitMaskPosition: "center",
						}}
						aria-hidden="true"
					/>
				</span>

				<div
					className={`flex w-full items-center rounded-panel p-6 md:p-8 lg:min-h-28 ${
						flip ? "lg:-mr-18 lg:pr-28" : "lg:-ml-18 lg:pl-28"
					}`}
					style={{ background: tint }}>
					{/*
            The panel is wide so the two bands meet across the middle of the
            section; the measure is not, or the shorter of the two statements
            sets on one line and goes back to reading as a strip. 62ch keeps
            every statement on the page at two or three lines.
          */}
					<p className="t-lead max-w-[62ch] text-ink">{body}</p>
				</div>
			</div>
		</Reveal>
	);
}
