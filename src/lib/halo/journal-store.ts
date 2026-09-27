import { create } from "zustand";
import { persist } from "zustand/middleware";
import { learnedWeights } from "./learn";
import type { JournalEntry, Intensity } from "./types";

type NewEntry = Omit<JournalEntry, "id" | "createdAt">;

type JournalState = {
  entries: JournalEntry[];
  add: (entry: NewEntry) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<JournalEntry>) => void;
};

export const useJournal = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      add: (entry) =>
        set({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...get().entries.filter((e) => e.date !== entry.date),
          ],
        }),
      remove: (id) => set({ entries: get().entries.filter((e) => e.id !== id) }),
      update: (id, patch) =>
        set({
          entries: get().entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
    }),
    { name: "halo-journal-v1", skipHydration: true },
  ),
);

export function useLearned() {
  const entries = useJournal((s) => s.entries);
  return learnedWeights(entries);
}

export const INTENSITY_LABEL: Record<Intensity, string> = {
  0: "None",
  1: "Mild",
  2: "Moderate",
  3: "Strong",
};

export const SLEEP_LABEL: Record<Intensity, string> = {
  0: "Fine",
  1: "Restless",
  2: "Broken",
  3: "Almost none",
};
