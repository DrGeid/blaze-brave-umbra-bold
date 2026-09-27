import { o as __toESM } from "../_runtime.mjs";
import { a as FACTOR_META, c as PHENOTYPES, l as PHENOTYPE_META, r as EVIDENCE_COPY, s as LOAD_MAX } from "./types-C-WbLUyQ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as cn } from "./utils-DsX51Y8I.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./app-shell-DhT8JhRP.mjs";
import { i as Route$5 } from "./router-B9s5l1vK.mjs";
import { t as Badge } from "./badge-ab6HSoR0.mjs";
import { i as formatShortDate, n as formatLongDate, t as bandLabel } from "./format-mN0Orl5G.mjs";
import { n as nowcastCopy } from "./briefing-Bh_5-0Pa.mjs";
import { t as buildDayResult } from "./scoring-B5AAAlY-.mjs";
import { i as useLearned } from "./journal-store-DfqbgwP7.mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BZF9Cl2l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FactorList({ factors, lift }) {
	const ranked = [...factors].sort((a, b) => b.score - a.score);
	const sum = factors.reduce((a, f) => a + f.score, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-faint",
				children: "Factors"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl",
				children: "Each term, then the sum"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tabular-nums leading-none",
					children: sum
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-faint",
					children: [
						"of ",
						LOAD_MAX.toLocaleString(),
						" load"
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-6 space-y-4",
			children: ranked.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: FACTOR_META[f.id].label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: f.evidence,
								children: EVIDENCE_COPY[f.evidence]
							}),
							lift?.[f.id] != null && Math.abs(lift[f.id]) >= .12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "strong",
								children: lift[f.id] > 0 ? "Your journal +" : "Your journal −"
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tabular-nums",
						children: f.score
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-full rounded-full", f.evidence === "strong" ? "bg-primary" : f.evidence === "mixed" ? "bg-watch/70" : "bg-faint/50"),
						style: { width: `${f.score}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1.5 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: f.observed
						}),
						" · ",
						f.note
					]
				})
			] }, f.id))
		})]
	});
}
function ScoreGauge({ score, band, label, size = "lg" }) {
	const r = size === "lg" ? 54 : 36;
	const c = 2 * Math.PI * r;
	const dash = score / 100 * c;
	const dim = size === "lg" ? 140 : 96;
	const tone = band === "quiet" ? "text-calm" : band === "watch" || band === "elevated" ? "text-watch" : "text-high";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative", size === "lg" ? "size-[140px]" : "size-24"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 ${dim} ${dim}`,
				className: "size-full -rotate-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: dim / 2,
					cy: dim / 2,
					r,
					fill: "none",
					stroke: "currentColor",
					className: "text-surface-2",
					strokeWidth: size === "lg" ? 8 : 6
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: dim / 2,
					cy: dim / 2,
					r,
					fill: "none",
					stroke: "currentColor",
					className: tone,
					strokeWidth: size === "lg" ? 8 : 6,
					strokeLinecap: "round",
					strokeDasharray: `${dash} ${c}`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("font-display tabular-nums leading-none", size === "lg" ? "text-4xl" : "text-2xl"),
					children: score
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs uppercase tracking-[0.14em] text-faint",
					children: bandLabel(band)
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [
					label,
					" ",
					score
				]
			})
		]
	});
}
function PhenotypeCard({ score, active, onSelect }) {
	const meta = PHENOTYPE_META[score.id];
	const top = score.contributions[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("flex w-full flex-col items-start gap-4 rounded-xl bg-surface p-5 text-left shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200", active && "ring-1 ring-primary/30"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] text-faint",
					children: score.id
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-2xl",
					children: meta.label
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: score.band,
					children: bandLabel(score.band)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
					score: score.score,
					band: score.band,
					label: meta.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 flex-1 text-sm text-muted",
					children: meta.feel
				})]
			}),
			top ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-faint",
				children: ["Loudest term · ", FACTOR_META[top.id].label]
			}) : null
		]
	});
}
function PressureChart({ hourly }) {
	const data = (0, import_react.useMemo)(() => hourly.filter((h) => h.pressure != null).map((h) => ({
		t: h.time.slice(5, 13).replace("T", " "),
		p: h.pressure,
		h: h.humidity
	})), [hourly]);
	if (data.length < 4) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-faint",
				children: "Barometer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl",
				children: "Sea-level pressure"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Halton midpoint · last two days and the week ahead"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-52 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tick: {
									fill: "var(--color-faint)",
									fontSize: 11
								},
								tickLine: false,
								axisLine: false,
								minTickGap: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: ["dataMin - 2", "dataMax + 2"],
								tick: {
									fill: "var(--color-faint)",
									fontSize: 11
								},
								tickLine: false,
								axisLine: false,
								width: 42,
								unit: " hPa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-border)",
									borderRadius: 12,
									fontSize: 12
								},
								formatter: (value, name) => [name === "p" ? `${Number(value).toFixed(1)} hPa` : `${Number(value).toFixed(0)}%`, name === "p" ? "Pressure" : "Humidity"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "p",
								stroke: "var(--color-primary)",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			})
		]
	});
}
function WeekStrip({ days, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7",
		children: days.map((d, i) => {
			const active = d.date === selected;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(d.date),
				className: cn("rounded-lg bg-surface px-3 py-3 text-left shadow-[var(--shadow-border)] transition-transform duration-150", active && "ring-1 ring-primary/35"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: i === 0 ? "Today" : formatShortDate(d.date)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl tabular-nums leading-none",
						children: d.opportunity
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: d.band,
							children: bandLabel(d.band)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[11px] leading-snug text-muted",
						children: [
							"T ",
							d.phenotypes.temple.score,
							" · E ",
							d.phenotypes.ocular.score,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"N ",
							d.phenotypes.occipital.score,
							" · S ",
							d.phenotypes.sleep.score
						]
					})
				]
			}, d.date);
		})
	});
}
function Home() {
	const data = Route$5.useLoaderData();
	const [date, setDate] = (0, import_react.useState)(data.today.date);
	const [focus, setFocus] = (0, import_react.useState)("temple");
	const learned = useLearned();
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setHydrated(true), []);
	const selected = (0, import_react.useMemo)(() => {
		const raw = data.days.find((d) => d.date === date) ?? data.today;
		if (!hydrated || !learned.ready) return raw;
		const idx = data.days.findIndex((d) => d.date === raw.date);
		const prevMean = idx > 0 ? data.days[idx - 1].weather.tempMean : null;
		return buildDayResult(raw.weather, raw.sky, prevMean, learned.weights);
	}, [
		data,
		date,
		learned,
		hydrated
	]);
	const lift = {};
	for (const i of learned.insights) {
		const prev = lift[i.factor] ?? 0;
		if (Math.abs(i.lift) > Math.abs(prev)) lift[i.factor] = i.lift;
	}
	const lead = PHENOTYPES.map((id) => selected.phenotypes[id]).sort((a, b) => b.score - a.score)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-faint",
				children: data.location.region
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl sm:text-5xl",
							children: formatLongDate(selected.date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-lg text-muted",
							children: selected.headline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-faint",
							children: nowcastCopy(selected)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-5 rounded-xl bg-surface px-5 py-4 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, {
						score: selected.opportunity,
						band: selected.band,
						label: "Opportunity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.16em] text-faint",
							children: "Opportunity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg",
							children: bandLabel(selected.band)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Load ",
								selected.load,
								" / ",
								selected.loadMax
							]
						}),
						learned.ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "strong",
							className: "mt-2",
							children: "Tuned by journal"
						}) : null
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekStrip, {
					days: data.days,
					selected: selected.date,
					onSelect: setDate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: PHENOTYPES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhenotypeCard, {
					score: selected.phenotypes[id],
					active: focus === id,
					onSelect: () => setFocus(id)
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-xl bg-primary px-5 py-5 text-primary-fg sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.16em] opacity-70",
					children: PHENOTYPE_META[focus].label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-3xl text-sm leading-relaxed opacity-90",
					children: [PHENOTYPE_META[focus].detail, " Default weights favour published weather and air-quality signals. Anecdotal sky terms stay small until enough quiet-versus-attack days are logged on this device. Sleep is scored as disruption risk — a high number means a harder night, which can open the door to an attack."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorList, {
					factors: selected.factors,
					lift
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressureChart, { hourly: data.hourly })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-xs text-faint",
				children: [
					data.source,
					". ",
					data.disclaimer
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "sr-only",
				children: ["Lead phenotype ", lead.id]
			})
		]
	}) });
}
//#endregion
export { Home as component };
