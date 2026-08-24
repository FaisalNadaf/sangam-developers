/** @format */

import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { MaskedLines, Reveal } from "./Reveal";

interface SectionHeaderProps {
	/** Short mono eyebrow naming the section. */
	eyebrow: string;
	/** Heading, already split into the lines you want revealed. */
	lines: string[];
	/**
	 * Accepted but not rendered. The opener is deliberately the marker and
	 * the heading alone; call sites still pass a standfirst and it is
	 * ignored, so switching it back on is a change here and nowhere else.
	 */
	intro?: ReactNode;
	/** Reading set beside the marker — a count, a source, a provenance note. */
	meta?: string;
	accent?: string;
	align?: "left" | "wide" | "centre";
	/**
	 * Set on a section that sits on `ground-deep`. The heading colour comes from
	 * that ground, but the marker has to be told: its label is darkened against
	 * the accent for paper, which on a dark band prints near-black on near-black.
	 */
	onDark?: boolean;
	/** Retained from the two-ground era; call sites do not need to change. */
	tone?: "ink" | "bone";
	className?: string;
	id?: string;
}

/**
 * Every section opens the same way: a marker, a masked heading, and the
 * standfirst beside or beneath it. Consistency here is what lets the sections
 * differ so much below it without the page coming apart.
 *
 * `meta` is rendered; `intro` is not. The opener is the marker and the heading,
 * and the standfirst each call site passes is dropped on purpose — see the note
 * on the prop. Worth knowing if a section reads thin: the copy exists and is
 * already being passed, so printing it again is a change in this file only.
 *
 * The standfirst is set in the serif, because it is still part of the
 * heading's sentence rather than the section's argument — the body copy below
 * is where the sans takes over.
 *
 * `wide` gives the heading ten of the twelve columns. It used to take seven
 * and leave the other five for the standfirst beside it; with the standfirst
 * no longer printed, seven columns held a 39-character heading to two lines
 * while five columns of the same row sat empty. Ten fits every heading on the
 * site on one line at the largest step of `t-display`, and still stops short
 * of the full measure so a heading never runs edge to edge.
 *
 * `left` stacks under a narrower measure for shorter openers; `centre` is for
 * the few sections that carry no side content and would otherwise sit
 * lopsided on a wide screen.
 *
 * Restoring the standfirst means putting this back to seven, or the two would
 * be fighting over the same row.
 */
export function SectionHeader({
	eyebrow,
	lines,
	meta,
	accent = "var(--color-brand)",
	align = "left",
	onDark = false,
	className = "",
	id,
}: SectionHeaderProps) {
	const centred = align === "centre";
	const wide = align === "wide";

	return (
		<header className={className}>
			<div
				className={
					wide ? "grid gap-x-12 gap-y-7 lg:grid-cols-12"
					: centred ?
						"mx-auto max-w-3xl text-center"
					:	"max-w-3x	l"
				}>
				<div className={wide ? "lg:col-span-10" : ""}>
					<Reveal direction="left">
						<div
							className={`mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 ${
								centred ? "justify-center" : ""
							}`}>
							<Eyebrow
								accent={accent}
								tone={onDark ? "dark" : "paper"}>
								{eyebrow}
							</Eyebrow>
							{meta && (
								<>
									<span
										className={`hidden h-3 w-px sm:block ${onDark ? "bg-white/25" : "bg-line-2"}`}
										aria-hidden="true"
									/>
									<span
										className={`t-data ${onDark ? "text-muted-inv" : "text-muted"}`}>
										{meta}
									</span>
								</>
							)}
						</div>
					</Reveal>

					<h2
						id={id}
						className="t-display">
						<MaskedLines
							lines={lines}
							className="block"
						/>
					</h2>
				</div>
			</div>
		</header>
	);
}
