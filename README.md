# Halo

Halo is a weather and migraine sensitivity forecast for Oakville and Burlington, Ontario.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:8080/`.

## Publish the app

Import this GitHub repository into Vercel. The `vercel.json` file selects the TanStack Start framework, and `npm run build` produces the Vercel server and client output. Keep the repository root as the project root. For this public pilot, set `VITE_AUTH_ENABLED=false` in Vercel's environment variables unless Grok broker credentials and a persistent database have been configured for sign-in.

GitHub Pages cannot run this app's server functions or authentication endpoint. Its `github.io` URL currently returns 404 because the repository does not contain a static `index.html` for Pages to serve. Publishing the local development folder to GitHub Pages would have the same limitation.

Vercel's Git integration deploys changes from the repository after the initial import.
