import { BASE_WEIGHTS } from "./constants";
import { clamp } from "./math";
import type { FactorId, JournalEntry, PhenotypeId } from "./types";
import { FACTOR_IDS, PHENOTYPES } from "./types";
import type { WeightTable } from "./scoring";

export type LearnedInsight = {
  phenotype: PhenotypeId;
  factor: FactorId;
  lift: number;
  sample: number;
};

export function learnedWeights(entries: JournalEntry[]): {
  weights: WeightTable;
  insights: LearnedInsight[];
  ready: boolean;
} {
  const weights: WeightTable = {
    temple: { ...BASE_WEIGHTS.temple },
    frontal: { ...BASE_WEIGHTS.frontal },
    ocular: { ...BASE_WEIGHTS.ocular },
    occipital: { ...BASE_WEIGHTS.occipital },
    sleep: { ...BASE_WEIGHTS.sleep },
  };
  const usable = entries.filter((e) => e.factorSnapshot);
  const insights: LearnedInsight[] = [];
  if (usable.length < 4) {
    return { weights, insights, ready: false };
  }

  for (const p of PHENOTYPES) {
    for (const f of FACTOR_IDS) {
      const attack: number[] = [];
      const quiet: number[] = [];
      for (const e of usable) {
        const s = e.factorSnapshot?.[f];
        if (typeof s !== "number") continue;
        const intensity = e[p] ?? 0;
        if (intensity >= 2) attack.push(s);
        else if (intensity === 0) quiet.push(s);
      }
      if (attack.length < 2) continue;
      const attackMean = avg(attack);
      const baseline = quiet.length ? avg(quiet) : 45;
      const delta = attackMean - baseline;
      const lift = clamp(delta / 80, -0.35, 0.9);
      weights[p][f] = BASE_WEIGHTS[p][f] * (1 + lift);
      if (Math.abs(lift) >= 0.12) {
        insights.push({
          phenotype: p,
          factor: f,
          lift,
          sample: attack.length + quiet.length,
        });
      }
    }
  }
  insights.sort((a, b) => Math.abs(b.lift) - Math.abs(a.lift));
  return { weights, insights: insights.slice(0, 6), ready: true };
}

function avg(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}
