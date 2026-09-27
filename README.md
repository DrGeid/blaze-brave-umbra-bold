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

Vercel hosts this TanStack Start app. The `vercel.json` file selects the framework, and `npm run build` produces the Vercel server and client output. Keep the repository root as the project root. For this public pilot, set `VITE_AUTH_ENABLED=false` in Vercel's environment variables unless Grok broker credentials and a persistent database have been configured for sign-in.

The first production deployment was made from a local checkout with the Vercel CLI. The GitHub repository is not yet connected to the Vercel project, so pushes do not deploy automatically. Connect `DrGeid/blaze-brave-umbra-bold` in the project's Git settings to enable automatic deployments. Until then, deploy updates from a checkout with `vercel deploy --prod`.

GitHub Pages cannot run this app's server functions or authentication endpoint. Its `github.io` URL currently returns 404 because the repository does not contain a static `index.html` for Pages to serve. Publishing the local development folder to GitHub Pages would have the same limitation.
