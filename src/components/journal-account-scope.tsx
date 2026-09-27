import { useEffect, useState, type ReactNode } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useJournal } from "@/lib/halo/journal-store";

export function JournalAccountScope({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const key = user && !user.isDevFallback ? `halo-journal-user-${user.id}` : "halo-journal-v1";
  const [readyKey, setReadyKey] = useState<string | null>(null);
  useEffect(() => {
    if (isPending) return;
    let active = true;
    // Clear memory before changing storage keys, so the old account's entries
    // are never persisted into or rendered for the new account.
    const storage = useJournal.persist.getOptions().storage;
    useJournal.persist.setOptions({
      storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    });
    useJournal.setState({ entries: [] });
    useJournal.persist.setOptions({ name: key, storage });
    Promise.resolve(useJournal.persist.rehydrate()).finally(() => {
      if (active) setReadyKey(key);
    });
    return () => {
      active = false;
    };
  }, [key, isPending]);
  if (isPending || readyKey !== key)
    return (
      <div className="grid min-h-dvh place-items-center text-muted" role="status">
        Opening Halo…
      </div>
    );
  return <>{children}</>;
}
