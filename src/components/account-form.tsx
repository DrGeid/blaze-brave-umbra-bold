import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { authClient, authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";

export function AccountForm({ register = false }: { register?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputClass = "mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-fg";
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 py-10 text-fg">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-block py-3 text-sm text-muted hover:text-fg">
          Back to Halo
        </Link>
        <h1 className="mt-4 font-display text-4xl">
          {register ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {register
            ? "Register with your name, email, and a password."
            : "Sign in with your email and password."}{" "}
          Forecasts remain available without signing in.
        </p>
        {isPending ? (
          <p className="mt-6 text-muted">Checking your session…</p>
        ) : user && !user.isDevFallback ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm">You are signed in as {user.primaryEmail}.</p>
            <Button onClick={() => void signOut(register ? "/register" : "/login")}>
              Sign out to {register ? "register another user" : "switch accounts"}
            </Button>
          </div>
        ) : !authEnabled ? (
          <p className="mt-6 text-muted">
            Account registration is being prepared. Please try again shortly.
          </p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              const form = new FormData(event.currentTarget);
              setBusy(true);
              setError("");
              try {
                const email = String(form.get("email")).trim().toLowerCase();
                const password = String(form.get("password"));
                const result = register
                  ? await authClient.signUp.email({
                      email,
                      password,
                      name: String(form.get("name")).trim(),
                    })
                  : await authClient.signIn.email({ email, password });
                if (result.error) {
                  setError(result.error.message || "Unable to continue. Please try again.");
                  return;
                }
                window.location.assign("/");
              } catch {
                setError("Unable to connect. Please try again.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {register && (
              <label className="block text-sm font-medium">
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                autoComplete={register ? "new-password" : "current-password"}
                required
                minLength={register ? 12 : 1}
                maxLength={128}
                className={inputClass}
              />
            </label>
            {register && (
              <p className="text-xs text-muted">
                Use at least 12 characters. Keep your password somewhere safe.
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-fg">
                {error}
              </p>
            )}
            <Button disabled={busy} className="min-h-12 w-full" type="submit">
              {busy ? "Please wait…" : register ? "Register" : "Sign in"}
            </Button>
            <p className="text-center text-sm text-muted">
              {register ? "Already registered?" : "New to Halo?"}{" "}
              <Link
                to={register ? "/login" : "/register"}
                className="font-medium text-fg underline underline-offset-4"
              >
                {register ? "Sign in" : "Register a new user"}
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
