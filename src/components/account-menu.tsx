import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, UserRoundPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AccountMenu() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="size-11 animate-pulse rounded-full bg-surface-2" />;
  if (!user || user.isDevFallback)
    return (
      <div className="flex shrink-0 items-center gap-1">
        <Link to="/login" className="rounded-full px-3 py-3 text-sm hover:bg-surface-2">
          Sign in
        </Link>
        <Link
          to="/register"
          className="hidden rounded-full bg-primary px-3 py-3 text-sm text-primary-fg sm:block"
        >
          Register
        </Link>
      </div>
    );
  const label = user.displayName || user.primaryEmail || "Account";
  const exit = (path: string) =>
    void signOut(path).catch(() => toast.error("Could not sign out. Please try again."));
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-full px-2 hover:bg-surface-2"
        aria-label={`Account: ${label}`}
      >
        <span className="grid size-8 place-items-center rounded-full bg-surface-2 text-sm">
          {label.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-32 truncate text-sm sm:block">{label}</span>
        <ChevronDown className="size-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-xl border border-border bg-surface p-2 text-fg shadow-lg"
        >
          <DropdownMenu.Label className="px-3 py-3">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="mt-1 truncate text-xs text-muted">{user.primaryEmail}</p>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={() => exit("/login")}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 text-sm outline-none focus:bg-surface-2"
          >
            <LogOut className="size-4" /> Sign out
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => exit("/register")}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-3 text-sm outline-none focus:bg-surface-2"
          >
            <UserRoundPlus className="size-4" /> Register a new user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
