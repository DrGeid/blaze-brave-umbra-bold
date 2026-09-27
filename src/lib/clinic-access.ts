import { createServerFn } from "@tanstack/react-start";

export const getAccountAccess = createServerFn({ method: "GET" }).handler(async () => {
  const { auth, authConfigured } = await import("./auth/server");
  const { getRequest } = await import("@tanstack/react-start/server");
  const session = authConfigured
    ? await auth.api.getSession({
        headers: getRequest().headers,
        query: { disableCookieCache: true },
      })
    : null;
  const user = session?.user;
  // An unverified registration email must never grant Clinic access.
  const ownerId = process.env.HALO_CLINIC_USER_ID?.trim();
  return { userId: user?.id ?? null, canAccessClinic: Boolean(ownerId && user?.id === ownerId) };
});

export const getClinicForecast = createServerFn({ method: "GET" }).handler(async () => {
  const { assertSameSiteRequest } = await import("./auth/isolation.server");
  assertSameSiteRequest();
  const access = await getAccountAccess();
  if (!access.canAccessClinic) throw new Error("Clinic access is restricted to the owner.");
  const { getHaloForecast } = await import("./halo/fetch-forecast");
  return getHaloForecast();
});
