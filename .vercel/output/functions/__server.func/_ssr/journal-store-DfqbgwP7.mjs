import { c as PHENOTYPES, i as FACTOR_IDS, t as BASE_WEIGHTS } from "./types-C-WbLUyQ.mjs";
import { n as clamp } from "./math-BwT10IIp.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-store-DfqbgwP7.js
function learnedWeights(entries) {
	const weights = {
		temple: { ...BASE_WEIGHTS.temple },
		ocular: { ...BASE_WEIGHTS.ocular },
		occipital: { ...BASE_WEIGHTS.occipital },
		sleep: { ...BASE_WEIGHTS.sleep }
	};
	const usable = entries.filter((e) => e.factorSnapshot);
	const insights = [];
	if (usable.length < 4) return {
		weights,
		insights,
		ready: false
	};
	for (const p of PHENOTYPES) for (const f of FACTOR_IDS) {
		const attack = [];
		const quiet = [];
		for (const e of usable) {
			const s = e.factorSnapshot?.[f];
			if (typeof s !== "number") continue;
			const intensity = e[p] ?? 0;
			if (intensity >= 2) attack.push(s);
			else if (intensity === 0) quiet.push(s);
		}
		if (attack.length < 2) continue;
		const delta = avg(attack) - (quiet.length ? avg(quiet) : 45);
		const lift = clamp(delta / 80, -.35, .9);
		weights[p][f] = BASE_WEIGHTS[p][f] * (1 + lift);
		if (Math.abs(lift) >= .12) insights.push({
			phenotype: p,
			factor: f,
			lift,
			sample: attack.length + quiet.length
		});
	}
	insights.sort((a, b) => Math.abs(b.lift) - Math.abs(a.lift));
	return {
		weights,
		insights: insights.slice(0, 6),
		ready: true
	};
}
function avg(xs) {
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
var useJournal = create()(persist((set, get) => ({
	entries: [],
	add: (entry) => set({ entries: [{
		...entry,
		id: crypto.randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...get().entries.filter((e) => e.date !== entry.date)] }),
	remove: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),
	update: (id, patch) => set({ entries: get().entries.map((e) => e.id === id ? {
		...e,
		...patch
	} : e) })
}), { name: "halo-journal-v1" }));
function useLearned() {
	return learnedWeights(useJournal((s) => s.entries));
}
var INTENSITY_LABEL = {
	0: "None",
	1: "Mild",
	2: "Moderate",
	3: "Strong"
};
var SLEEP_LABEL = {
	0: "Fine",
	1: "Restless",
	2: "Broken",
	3: "Almost none"
};
//#endregion
export { useLearned as i, SLEEP_LABEL as n, useJournal as r, INTENSITY_LABEL as t };
