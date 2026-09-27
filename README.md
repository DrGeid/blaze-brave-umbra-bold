# Halo

Halo is a weather and migraine sensitivity forecast for Oakville and Burlington, Ontario.

Live app: https://blaze-brave-umbra-bold.vercel.app/

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:8080/`.

## Publish the app

Vercel hosts this TanStack Start app. The `vercel.json` file selects the framework, and `npm run build` produces the Vercel server and client output and applies database migrations. Keep the repository root as the project root.

Connect `DrGeid/blaze-brave-umbra-bold` in the project's Git settings for automatic deployments from `main`. A checkout can also be published with `vercel deploy --prod`.

GitHub Pages cannot run this app's server functions or authentication endpoint. Its `github.io` URL currently returns 404 because the repository does not contain a static `index.html` for Pages to serve. Publishing the local development folder to GitHub Pages would have the same limitation.

## Accounts and Clinic

Email/password registration and sign-in use Better Auth and a persistent Neon Postgres database. Forecasts remain public. Set these server environment variables in Vercel:

- `VITE_AUTH_ENABLED=true`
- `DATABASE_URL`: supplied by the connected Neon integration
- `BETTER_AUTH_URL`: the deployment's canonical HTTPS origin
- `BETTER_AUTH_SECRET`: a stable random secret of at least 32 bytes
- `HALO_CLINIC_USER_ID`: the exact Better Auth user ID of the owner

Clinic is locked until the owner ID is configured. Register the owner account first, confirm ownership with the operator, then set its ID and redeploy. An email address alone never grants access. Both the route and the server function check the active session and owner ID. Sign-out and registration of another user are available in the account menu.

Email verification and password recovery email delivery are not configured. Journals are stored on the current device, separately for each account; guest entries retain the original guest storage key. They do not synchronize between devices. Local browser storage is not a substitute for a clinical records system.

For local account testing, use an ignored `.env.local` with database settings and set `BETTER_AUTH_URL=http://localhost:8080`. Never commit environment files, CLI credentials, or generated deployment output.

## Date window

The forecast includes today, seven days ahead, and seven days back. Past scores are recalculated from Open-Meteo's archived weather model estimates; they are not saved forecasts or direct station observations. Optional missing inputs use labeled baseline estimates. If the fallback provider cannot supply a date, the date is marked unavailable.

## Checks

```sh
npm run typecheck
node --test scripts/halo-dates.test.mjs
node --env-file=.env.local scripts/halo-auth-smoke.mjs http://localhost:8080
```

The account smoke check creates a disposable account and removes that exact account after testing. Run it only against the intended test deployment/database.
