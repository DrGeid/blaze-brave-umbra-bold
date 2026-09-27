import { o as __toESM } from "../_runtime.mjs";
import { a as FACTOR_META, c as PHENOTYPES, l as PHENOTYPE_META } from "./types-C-WbLUyQ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as cn } from "./utils-DsX51Y8I.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppShell } from "./app-shell-DhT8JhRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$3 } from "./router-B9s5l1vK.mjs";
import { t as Button } from "./button-DloCtAYY.mjs";
import { r as formatMonthDay } from "./format-mN0Orl5G.mjs";
import { i as useLearned, n as SLEEP_LABEL, r as useJournal, t as INTENSITY_LABEL } from "./journal-store-DfqbgwP7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-6FhaoFMo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Journal() {
	const data = Route$3.useLoaderData();
	const entries = useJournal((s) => s.entries);
	const add = useJournal((s) => s.add);
	const remove = useJournal((s) => s.remove);
	const learned = useLearned();
	const [date, setDate] = (0, import_react.useState)(data.today.date);
	const [temple, setTemple] = (0, import_react.useState)(0);
	const [ocular, setOcular] = (0, import_react.useState)(0);
	const [occipital, setOccipital] = (0, import_react.useState)(0);
	const [sleep, setSleep] = (0, import_react.useState)(0);
	const [notes, setNotes] = (0, import_react.useState)("");
	const day = data.days.find((d) => d.date === date) ?? data.today;
	const snapshot = (0, import_react.useMemo)(() => {
		const out = {};
		for (const f of day.factors) out[f.id] = f.score;
		return out;
	}, [day]);
	const existing = entries.find((e) => e.date === date);
	const setters = {
		temple: setTemple,
		ocular: setOcular,
		occipital: setOccipital,
		sleep: setSleep
	};
	const values = {
		temple,
		ocular,
		occipital,
		sleep
	};
	function applyEntry(found) {
		if (found) {
			setTemple(found.temple);
			setOcular(found.ocular);
			setOccipital(found.occipital);
			setSleep(found.sleep ?? 0);
			setNotes(found.notes);
		} else {
			setTemple(0);
			setOcular(0);
			setOccipital(0);
			setSleep(0);
			setNotes("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-faint",
				children: "Pilot journal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl sm:text-5xl",
				children: "What did the head do?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted",
				children: "Stays on this device for the public pilot. Log quiet days as well as attacks — and how you slept. Sleep is the fourth score because a broken night can open the next-day migraine."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
					onSubmit: (e) => {
						e.preventDefault();
						add({
							date,
							temple,
							ocular,
							occipital,
							sleep,
							notes: notes.trim(),
							factorSnapshot: snapshot
						});
						toast.success(`Saved ${formatMonthDay(date)}`);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm font-medium",
							children: ["Day", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-2 h-11 w-full rounded-lg bg-bg px-3 text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
								value: date,
								onChange: (e) => {
									setDate(e.target.value);
									applyEntry(entries.find((x) => x.date === e.target.value));
								},
								children: data.days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: d.date,
									children: [d.date, d.date === data.today.date ? " · today" : ""]
								}, d.date))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-5",
							children: PHENOTYPES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntensityRow, {
								id,
								value: values[id],
								onChange: setters[id]
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-6 block text-sm font-medium",
							children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								rows: 3,
								className: "mt-2 w-full rounded-lg bg-bg px-3 py-2 text-sm text-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_12%,transparent)]",
								placeholder: "Sleep, meals, screen time, smoke in the air, what it felt like…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: existing ? "Update this day" : "Save this day"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									applyEntry(void 0);
									add({
										date,
										temple: 0,
										ocular: 0,
										occipital: 0,
										sleep: 0,
										notes: "",
										factorSnapshot: snapshot
									});
									toast.success("Logged a quiet day");
								},
								children: "Quiet day"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Learning"
						}), !learned.ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [entries.length, "/4 days logged. After four days with attached weather, Halo starts lifting weights that were high on your attack or poor-sleep days."]
						}) : learned.insights.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Not enough contrast yet. Keep logging both flare and quiet days."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: learned.insights.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: PHENOTYPE_META[i.phenotype].label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: [
											" ",
											i.lift > 0 ? "rises with" : "falls with",
											" "
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: FACTOR_META[i.factor].label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-faint",
										children: [" · n=", i.sample]
									})
								]
							}, `${i.phenotype}-${i.factor}`))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "On this device"
						}), entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "No days yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 divide-y divide-border",
							children: entries.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 py-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: formatMonthDay(e.date)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-faint",
									children: [
										"T",
										e.temple,
										" · E",
										e.ocular,
										" · N",
										e.occipital,
										" · S",
										e.sleep ?? 0
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted underline-offset-4 hover:underline",
									onClick: () => remove(e.id),
									children: "Remove"
								})]
							}, e.id))
						})]
					})]
				})]
			})
		]
	}) });
}
function IntensityRow({ id, value, onChange }) {
	const labels = id === "sleep" ? SLEEP_LABEL : INTENSITY_LABEL;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-sm font-medium",
			children: PHENOTYPE_META[id].label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-xs text-faint",
			children: PHENOTYPE_META[id].feel
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-4 gap-1.5",
			children: [
				0,
				1,
				2,
				3
			].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(n),
				className: cn("h-11 rounded-lg text-xs font-medium", value === n ? "bg-primary text-primary-fg" : "bg-bg text-muted"),
				children: labels[n]
			}, n))
		})
	] });
}
//#endregion
export { Journal as component };
