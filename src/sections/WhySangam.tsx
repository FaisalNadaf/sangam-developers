/** @format */

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

import { SectionHeader } from "@/components/SectionHeader";
import { ScaleIn } from "@/components/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT, stagger } from "@/lib/motion";
import { COMPANIES } from "@/data/group";
import { MARKS } from "@/data/logos";

const REASONS = [
	{
		title: "One contractor across the whole ground layer",
		detail:
			"Every layer of the ground work sits inside the group, so a site is never handed between firms as it moves from parcel to grid connection.",
		to: "/projects",
	},
	{
		title: "Repeat work from the people who own the plants",
		detail:
			"Gamesa, ReNew Power, Suzlon, Acciona and CleanMax each appear on the register more than once. In this trade, being asked back is the reference.",
		to: "/clients",
	},
	{
		title: "Certified on quality and safety, in both companies",
		detail:
			"ISO 9001:2015 and ISO 45001:2018 are held by each company in its own name, not by one company and borrowed by the other.",
		to: "/about#certificates",
	},
	{
		title: "Local to the districts the work is in",
		detail:
			"Offices in Sangli and Vijayapur. Land and right-of-way work depends on knowing the revenue offices and the landowners, which cannot be mobilised from elsewhere.",
		to: "/contact",
	},
];

/**
 * Where the wordmark sits inside each mark file.
 *
 * Both files are trimmed to their ink, so their boxes are the same shape as
 * their logos — and the two logos are not the same shape at all. Scanning the
 * alpha of each file row by row gives the band the letters occupy:
 *
 *   SD   letters fill the bottom 43% of the box; the turbine is the top 57%
 *   SR   letters fill the middle 54%; the panels sit above, the tail below
 *
 * Centring the two boxes therefore puts the SD wordmark a long way below the
 * SR one, which is what made the pair read as misaligned. `band` is the
 * letters' share of the box height and `centre` is where their midline falls
 * in it; between them the marks can be set to a common letter height and
 * hung from a common axis, which is what "aligned" means for two logos.
 */
const WORDMARK = {
	"sangam-developers": { band: 0.434, centre: 0.7802 },
	"sangam-renewables": { band: 0.539, centre: 0.5403 },
} as const;

/**
 * Where the pair has to sit, in cap units, for its centre to land on the
 * rhombus's centre — `y` down, `x` right.
 *
 * Both numbers are measured rather than tuned: scanning the alpha of the two
 * mark files gives each one's ink mass and its centre of mass, and these are
 * the offsets that put the *combined* centre of mass in the middle of the
 * shape. Neither axis lands there on its own.
 *
 * **Vertically** this replaces a value that centred the ink's **bounding
 * box** — the obvious reading of "centred", and the wrong one for these two
 * marks. The SD turbine blade is a tall, thin, pale protrusion: it claims
 * 1.8 cap of height above the letters while carrying almost none of the
 * pair's weight. Balancing the box against it pushed the actual mass 0.31 cap
 * *below* the centre — around twenty pixels at desktop size — so the box was
 * centred and the logo plainly was not.
 *
 * **Horizontally** the two lean into each other: SD's mass sits right of its
 * own box, SR's sits left of its own. That would cancel if the boxes matched,
 * but SR's is the wider, so the pair settles 3.7% of its width to the left
 * and has to be carried back.
 *
 * Both placements clear the rhombus's slanted edges by the same margin — the
 * closest approach is 0.97 of the way out either way — so this costs nothing
 * in clearance. It does move which mark is the binding one from SD's foot to
 * SR's, which is the constraint `--wc-cap` is sized against.
 */
const OPTICAL = { y: 0.1658, x: 0.2578 } as const;

const HUB = COMPANIES.map((company) => {
	const mark = MARKS[company.mark];
	const { band, centre } = WORDMARK[company.mark as keyof typeof WORDMARK];
	return {
		key: company.key,
		name: company.name,
		to: company.path,
		src: mark.src,
		w: mark.w,
		h: mark.h,
		/** Box height that lands the letters at the shared cap height. */
		height: 1 / band,
		/** Lift needed to hang those letters on the shared axis. */
		shift: OPTICAL.y - (centre - 0.5) / band,
	};
});

const GEOMETRY = {
	"--wc-d": "clamp(min(76vw, 18rem), 50vw - 12rem, 34rem)",
	"--wc-h": "calc(var(--wc-d) / 1.635)",
	/*
	  The shared cap height of the two wordmarks. Every dimension of the pair
	  is a multiple of it, and this is as large as it can be before the ink runs
	  out through one of the rhombus's slanted edges — SR's panels, at the
	  pair's optical placement, which come within 3% of the upper-right edge.
	  Together with the gap it puts the pair at about two-thirds of the shape's
	  width, which is the proportion the reference draws.
	*/
	"--wc-cap": "calc(var(--wc-d) * 0.096)",
	"--wc-gap": "calc(var(--wc-d) * 0.088)",
	/*
	  One stroke for the whole diagram, a step darker than the site's rule
	  colour. `--color-line` is drawn for a rule that separates two blocks of
	  text a few pixels apart; struck across a metre of empty paper it
	  disappears, and the composition is the argument here.
	*/
	"--wc-stroke": "color-mix(in srgb, var(--color-ink) 22%, transparent)",
	"--wc-stroke-2": "color-mix(in srgb, var(--color-ink) 30%, transparent)",
} as CSSProperties;

/**
 * When the four quadrants are asked to arrive.
 *
 * The site's shared trigger fires the moment any pixel of an element clears
 * the fold, which on this page means the diagram animates before the reader
 * has scrolled to it — the section starts barely 400 px down. Shrinking the
 * observation box from the bottom and asking for a third of the field holds
 * the reveal back until the composition is actually being looked at.
 */
const FIELD_VIEWPORT = {
	once: true,
	amount: 0.34,
	margin: "0px 0px -18% 0px",
} as const;

/** The ordered list of quadrants, and the thing that times their arrival. */
function Field({
	className,
	children,
}: {
	className: string;
	children: ReactNode;
}) {
	const reduced = useReducedMotion();

	if (reduced) return <ol className={className}>{children}</ol>;

	return (
		<motion.ol
			className={className}
			variants={stagger(0.14)}
			initial="hidden"
			whileInView="show"
			viewport={FIELD_VIEWPORT}>
			{children}
		</motion.ol>
	);
}

/**
 * One quadrant of the diagram, arriving from its own corner.
 *
 * The site's shared `slide` travels on one axis, which is right for a column
 * of rows and wrong here: these four sit around a centre, so each is given
 * both offsets and converges on the rhombus. The travel is roughly twice the
 * site's standard and the settle is longer, because a 50 px nudge under an
 * expo curve is over before the eye has found it.
 */
function Quadrant({
	x,
	y,
	className,
	children,
}: {
	x: number;
	y: number;
	className: string;
	children: ReactNode;
}) {
	const reduced = useReducedMotion();

	if (reduced) return <li className={className}>{children}</li>;

	return (
		<motion.li
			className={className}
			variants={{
				hidden: { opacity: 0, scale: 0.97, x, y },
				show: {
					opacity: 1,
					scale: 1,
					x: 0,
					y: 0,
					transition: { duration: 1.15, ease: EASE_OUT },
				},
			}}>
			{children}
		</motion.li>
	);
}

/** Hairlines, faded at both ends so they leave the sheet rather than stop. */
const RULE_X = {
	backgroundImage:
		"linear-gradient(to right, transparent, var(--wc-stroke) 6%, var(--wc-stroke) 94%, transparent)",
};
const RULE_Y = {
	backgroundImage:
		"linear-gradient(to bottom, transparent, var(--wc-stroke) 8%, var(--wc-stroke) 92%, transparent)",
};

export function WhySangam() {
	return (
		/*
		  Every vertical measure on the wide layout is a slice of the viewport
		  height rather than a fixed rem, so the whole diagram clears the fold on
		  a laptop instead of running past it.
		*/
		<section
			className="section-y ground-tint lg:py-[clamp(2.5rem,6.5vh,4.5rem)]"
			aria-labelledby="why-heading">
			<div className="shell">
				<SectionHeader
					id="why-heading"
					eyebrow="About Sangam"
					lines={["Four reasons, all checkable."]}
					accent="var(--color-sd-deep)"
					align="centre"
					intro={
						<p>
							Each can be verified against the register and the certificates
							published on this site.
						</p>
					}
				/>

				{/*
					The composition. Its height is the quadrant field's height, because
					on a wide screen the hub is lifted out of flow and centred on it —
					which is what puts the rhombus exactly where the two rules cross.
				*/}
				<div
					className="relative mx-auto mt-12 w-full md:mt-16 lg:mt-[clamp(1.5rem,4.5vh,3rem)]"
					style={GEOMETRY}>
					{/*
						The four rules struck out from the vertices: one horizontal, run
						the full width of the viewport, and one vertical carried a little
						past the field at either end — on the reference they reach the
						edge of the sheet, not the edge of the content.
					*/}
					<div
						className="pointer-events-none absolute inset-0 hidden lg:block"
						aria-hidden="true">
						<span
							className="absolute top-1/2 left-1/2 h-px w-screen -translate-x-1/2 -translate-y-1/2"
							style={RULE_X}
						/>
						<span
							className="absolute left-1/2 w-px -translate-x-1/2"
							style={{ ...RULE_Y, top: "-2rem", height: "calc(100% + 4rem)" }}
						/>
					</div>

					{/*
						The hub. In flow above the field until there is room to sit in the
						middle of one, at which point it is centred on the crossing and
						covers the stretch of rule that would otherwise run under it.
					*/}
					<div className="flex justify-center lg:pointer-events-none lg:absolute lg:inset-0 lg:z-10 lg:items-center">
						<ScaleIn className="pointer-events-auto">
							<div
								className="relative"
								style={{ width: "var(--wc-d)", height: "var(--wc-h)" }}>
								{/*
									Drawn, not rotated. A square turned 45° is always as tall as
									it is wide; this rhombus is not, and a polygon in a stretched
									viewBox takes whatever proportion the geometry asks for.
									`non-scaling-stroke` holds the hairline at one pixel on both
									axes despite that stretch.

									The fill is paper white rather than the section's ground, so
									the shape reads as a plate laid over the tinted band — and it
									is what masks the two rules where they would otherwise run
									straight through the middle of it.
								*/}
								<svg
									viewBox="0 0 100 100"
									preserveAspectRatio="none"
									className="absolute inset-0 h-full w-full"
									style={{
										filter:
											"drop-shadow(0 18px 34px rgba(16, 24, 20, 0.09))",
									}}
									aria-hidden="true">
									<polygon
										points="50,0.7 99.3,50 50,99.3 0.7,50"
										fill="var(--color-paper)"
										stroke="var(--wc-stroke-2)"
										strokeWidth="1"
										vectorEffect="non-scaling-stroke"
									/>
								</svg>

								{/*
									`justify-center` centres the two *boxes*; the translate
									carries the pair over to where its ink is centred instead.
								*/}
								<div
									className="absolute inset-0 flex items-center justify-center"
									style={{
										gap: "var(--wc-gap)",
										transform: `translateX(calc(var(--wc-cap) * ${OPTICAL.x}))`,
									}}>
									{HUB.map((company) => (
										<Link
											key={company.key}
											to={company.to}
											aria-label={`${company.name} company page`}
											className="group inline-flex shrink-0 items-center justify-center transition-transform duration-500 ease-out-expo hover:-translate-y-1">
											{/*
												Three transforms, three elements, so none of them
												fights the others: the link carries the hover lift,
												this span carries the fixed alignment shift, and the
												image carries the hover scale.
											*/}
											<span
												className="block"
												style={{
													transform: `translateY(calc(var(--wc-cap) * ${company.shift.toFixed(4)}))`,
												}}>
												{/*
													The marks stand on the plate rather than in a disc.
													A ring drawn on white had nothing to separate it
													from the white behind it and read as a seam; a
													shadow cast by the mark itself lifts the logo off
													the plate and leaves the rhombus the only drawn
													shape in the middle.
												*/}
												<img
													src={company.src}
													width={company.w}
													height={company.h}
													alt=""
													loading="lazy"
													decoding="async"
													className="w-auto object-contain transition-[transform,filter] duration-500 ease-out-expo group-hover:scale-105"
													style={{
														height: `calc(var(--wc-cap) * ${company.height.toFixed(4)})`,
														filter:
															"drop-shadow(0 3px 7px rgba(16, 24, 20, 0.12)) drop-shadow(0 14px 26px rgba(16, 24, 20, 0.09))",
													}}
												/>
											</span>
										</Link>
									))}
								</div>
							</div>
						</ScaleIn>
					</div>

					{/* Carries the hub down into the field while the two are stacked. */}
					<div
						className="mx-auto h-10 w-px lg:hidden"
						style={RULE_Y}
						aria-hidden="true"
					/>

					<div className="relative">
						{/*
							The same crossing, at the one width where the hub has moved to
							the top but the four reasons still read as quadrants.
						*/}
						<div
							className="pointer-events-none absolute inset-0 hidden md:block lg:hidden"
							aria-hidden="true">
							<span
								className="absolute top-1/2 left-1/2 h-px w-screen -translate-x-1/2 -translate-y-1/2"
								style={RULE_X}
							/>
							<span
								className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2"
								style={RULE_Y}
							/>
						</div>

						<Field className="grid grid-cols-1 divide-y divide-line md:grid-cols-2 md:grid-rows-2 md:gap-x-10 md:gap-y-12 md:divide-y-0 lg:grid-cols-[minmax(0,1fr)_var(--wc-d)_minmax(0,1fr)] lg:grid-rows-2 lg:gap-x-6 lg:gap-y-[clamp(2rem,7vh,4.5rem)] xl:gap-x-10">
							{REASONS.map((reason, i) => {
								const right = i % 2 === 1;
								const lower = i > 1;

								return (
									<Quadrant
										key={reason.title}
										x={right ? 104 : -104}
										y={lower ? 76 : -76}
										className={[
											"py-8 first:pt-0 last:pb-0 md:py-0",
											lower
												? "md:self-end lg:row-start-2"
												: "md:self-start lg:row-start-1",
											// Centred in its half on the wide layout: pinned to the
											// outer edge, each block left a wedge of empty paper
											// against the rhombus that nothing filled.
											"lg:self-center",
											right ? "lg:col-start-3" : "lg:col-start-1",
										].join(" ")}>
										{/*
											The claim and its explanation, and nothing else. The
											whole block is the link to the page that holds the
											proof — the register, the client list, the certificates,
											the offices — so the heading answers on hover rather
											than carrying a label of its own.
										*/}
										<Link
											to={reason.to}
											className={`group flex flex-col ${
												right ? "lg:items-end lg:text-right" : ""
											}`}>
											<h3 className="t-h3 text-ink transition-colors duration-400 ease-out-expo group-hover:text-brand">
												{reason.title}
											</h3>
											<p className="t-body mt-4 text-muted">
												{reason.detail}
											</p>
										</Link>
									</Quadrant>
								);
							})}
						</Field>
						</div>
				</div>
			</div>
		</section>
	);
}
