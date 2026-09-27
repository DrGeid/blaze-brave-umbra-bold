import { o as __toESM } from "../_runtime.mjs";
import { a as FACTOR_META, c as PHENOTYPES, l as PHENOTYPE_META, r as EVIDENCE_COPY } from "./types-C-WbLUyQ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./app-shell-DhT8JhRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$4 } from "./router-B9s5l1vK.mjs";
import { t as Badge } from "./badge-ab6HSoR0.mjs";
import { t as Button } from "./button-DloCtAYY.mjs";
import { n as formatLongDate, t as bandLabel } from "./format-mN0Orl5G.mjs";
import { t as clinicBriefing } from "./briefing-Bh_5-0Pa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clinic-rgkJxDl2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Clinic() {
	const day = Route$4.useLoaderData().today;
	const text = (0, import_react.useMemo)(() => clinicBriefing(day), [day]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-faint",
				children: "Clinician desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl sm:text-5xl",
				children: "Halton briefing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted",
				children: "One regional score for Oakville and Burlington. Four phenotypes — temple, ocular, occipital, and sleep disruption. Use this as a weather and air-quality context layer, not a diagnosis. Accounts and shared patient logs come after the public pilot."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-faint",
							children: formatLongDate(day.date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl",
							children: "Today in clinic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4",
							children: PHENOTYPES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-bg px-2 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs uppercase tracking-wider text-faint",
										children: PHENOTYPE_META[id].label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-3xl tabular-nums",
										children: day.phenotypes[id].score
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: day.phenotypes[id].band,
											children: bandLabel(day.phenotypes[id].band)
										})
									})
								]
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-3 text-sm leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Facial pressure that patients call sinus is, with ordinary weather swings, more often migraine than true barosinusitis." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Temple-predominant days track falling/low pressure, humidity, and pollen. Occipital days track wind, fronts, and temperature range. Ocular days track glare (including snow), humidity, pollen, and smoke. Sleep days track heat, storms, and air quality — and a broken night can open the next-day attack." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ask what they feel, and how they slept, not only “migraine yes/no.” The journal on this device can later re-weight factors per person." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6",
							onClick: async () => {
								await navigator.clipboard.writeText(text);
								toast.success("Briefing copied");
							},
							children: "Copy talking points"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-xl bg-primary px-6 py-6 text-primary-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] opacity-70",
							children: "How to counsel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl",
							children: "A 90-second script"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed opacity-90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"Name the day: “The Halton air looks ",
									bandLabel(day.band).toLowerCase(),
									" for weather-sensitive heads.”"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Separate sinus infection from weather-migraine so they skip unneeded antibiotics." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Protect sleep, fluids, meals. Treat early if this is a known pattern. Smoke and ragweed days are real Ontario signals." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Do not over-promise on moon, tide, flare, or Mercury. Offer the journal if they want proof for themselves." })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 overflow-x-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Evidence grades we ship"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "mt-4 w-full min-w-[32rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-xs uppercase tracking-wider text-faint",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Factor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Grade"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 font-medium",
								children: "Use in room"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: day.factors.slice().sort((a, b) => b.score - a.score).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: FACTOR_META[f.id].label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: f.evidence,
									children: EVIDENCE_COPY[f.evidence]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 tabular-nums",
								children: f.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 text-muted",
								children: f.observed
							})
						]
					}, f.id)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-8 overflow-x-auto whitespace-pre-wrap rounded-xl bg-fg px-5 py-5 font-sans text-sm leading-relaxed text-primary-fg",
				children: text
			})
		]
	}) });
}
//#endregion
export { Clinic as component };
