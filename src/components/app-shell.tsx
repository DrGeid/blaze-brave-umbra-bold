import { Link, useRouterState, useRouteContext } from "@tanstack/react-router";
import { AccountMenu } from "./account-menu";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Today" },
  { to: "/clinic", label: "Clinic" },
  { to: "/journal", label: "Journal" },
  { to: "/science", label: "Science" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { accountAccess } = useRouteContext({ from: "__root__" });
  const { user } = useCurrentUserState();
  const clinicAllowed = accountAccess.canAccessClinic && accountAccess.userId === user?.id;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 sm:flex sm:gap-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 pr-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-fg">
              <HaloMark />
            </span>
            <span className="font-display text-lg tracking-tight">Halo</span>
          </Link>
          <nav className="order-last col-span-2 flex items-center justify-center gap-0.5 sm:order-none sm:flex-1 sm:justify-start">
            {LINKS.filter((l) => l.to !== "/clinic" || clinicAllowed).map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors duration-150",
                    active ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <AccountMenu />
        </div>
      </header>
      {children}
      <footer className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="max-w-2xl text-xs leading-relaxed text-faint">
          Educational forecast for Halton Region (Oakville and Burlington). Not a diagnosis.
          Weather, smoke, and pollen are the strongest terms; moon, spring tide, magnetic field,
          flare, eclipse, and Mercury stay low-weight unless your journal says otherwise. Sleep is
          scored as disruption risk — a pathway into migraine, not a sleep-lab reading.
        </p>
      </footer>
    </div>
  );
}

function HaloMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
