# Run portfolio chat on SandeepCloud

Date: 2026-11-27

The portfolio and Molecular Zettelkasten already share a Docker host and HTTPS reverse proxy. The portfolio now runs its own non-root Node service behind the existing portfolio hostname. The API packages the public profile data and sends requests to Google's Gemini Interactions API. Its runtime key is scoped to the portfolio. A dedicated Redis instance stores expiring counters on an internal network.

Nginx overwrites the client address on a network shared with the API. The browser posts to the same origin. The API limits message sizes, provider attempts and request duration. Redis outages block chat while Nginx continues serving the site.

The infrastructure repository owns Compose, proxy routing and backup configuration. The portfolio release publishes a web image and an API image, each tagged by commit. Stage the API and its route before switching the frontend. The previous frontend image and Vercel deployment provide a rollback path during cutover.
