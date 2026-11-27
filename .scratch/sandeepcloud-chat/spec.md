# Run the portfolio chat backend on SandeepCloud

Status: Hosting migration deployed and verified on 2026-11-27. Project-specific retrieval remains a separate evaluation.

SandeepCloud will receive each chat request, select public portfolio facts, enforce usage limits, and call Google's Gemini API. The visitor will use the portfolio's existing HTTPS hostname. Google will perform model inference. The Gemini Docs MCP and development skill are tools for Codex and do not belong in the deployed containers.

## What already exists

- The portfolio Dockerfile builds React assets and serves them with Nginx. The deployment workflow supplies `VITE_API_URL` at build time. The current chat handler depends on Vercel's response helpers, Upstash's HTTP-based limiter, and the legacy Gemini SDK. This proposal reopens [ADR-0001](../../docs/adr/0001-vercel-serverless-for-ai-agent.md), which previously chose Vercel to avoid operating another service.
- SandeepCloud's Compose definition includes the static `portfolio_app`, Molecular's `arc-vault`, and the shared Nginx reverse proxy. The tunnel forwards to local HTTPS. Nginx already selects an upstream by hostname. [Compose definition](https://github.com/pokharelsandeep333-commits/SandeepCloud-IAC/blob/HEAD/server/sandeepcloud/docker-compose.yml) · [Nginx configuration](https://github.com/pokharelsandeep333-commits/SandeepCloud-IAC/blob/HEAD/server/sandeepcloud/nginx.conf)
- Molecular runs its own Node server in Docker. Its authenticated chat route can expand short queries, search its vault, read up to three matching notes, and call Gemini with deadlines and transient-error fallback. Its SDK and request lifecycle are relevant to the portfolio. The public chat should have access only to published portfolio facts. [Molecular chat route](https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten/blob/HEAD/src/app/api/chat/route.ts)

## Changes in the portfolio repository

1. Package a small non-root Node HTTP service in a separately buildable container image. Preserve the existing `POST /api/chat` JSON request and response shape, input limits, and browser history behavior. Add a private health endpoint that can report readiness without making a billable Gemini call.
2. Load the portfolio's project and profile modules on startup. Keep the first migration testable against the same facts. For a later answer-quality improvement, select the named project for a specific question, use the recent conversation to resolve follow-ups, and include multiple project records for comparisons. Evaluate this against the full-context baseline before enabling it. Fix conflicting public facts, including SandeepCloud's hosting history, before comparing generated answers.
3. Replace `@google/generative-ai` with the supported `@google/genai` SDK. Use the Interactions API with `store: false`, recent conversation turns, the portfolio system instruction, and the existing 800-token output cap. Use one overall request deadline, cancel work on disconnect, and bound transient-error fallback within the same deadline. Inject a portfolio-specific Gemini key at runtime. [Gemini libraries](https://aistudio.google.com/docs/libraries) · [Interactions API](https://aistudio.google.com/docs/interactions-overview)
4. Build and scan the API image in CI alongside the frontend. Use immutable release tags for staging and rollback. Make the drawer call relative `/api/chat` and remove the Vercel URL from build arguments and tests when switching the frontend. Add a Vite development proxy for the local API.

## Changes in SandeepCloud-IAC

1. Add a `portfolio-api` Compose service reachable by the shared Nginx proxy. Give it its own runtime secret and health check. Use a private, portfolio-scoped Redis service for the limiter and budget counters, with access restricted to the API. Leave the existing Nextcloud Redis workload separate. The current Upstash REST client requires replacement with a Redis protocol client and atomic limit checks.
2. Add an exact `location = /api/chat` in the portfolio HTTPS server block. Forward this path to the API container, keep the existing static route for other paths, and keep both API and Redis ports internal. Apply a request body limit before parsing JSON and disable response caching. The existing hostname and tunnel can serve this route. [Cloudflare Tunnel routing](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/)
3. Have trusted Nginx overwrite the visitor-IP header it passes to the API from its resolved client address. Verify the address across the actual tunnel before enabling the 10 requests/minute/IP limit. Apply per-visitor and global generation budgets, and reject model calls when the limiter cannot confirm allowance.

## Cutover and verification

1. Start the API and limiter beside the existing services. Test the private endpoint with fixtures, then verify the public proxy path with a controlled canary. Check JSON on both success and error, rate limiting, a provider timeout, and static page delivery during an API outage.
2. Check a named project question, a follow-up that refers to “it,” a comparison, and a question whose answer is absent. Record input/output tokens, latency, and fallback count without logging message contents.
3. Switch the frontend after the proxy route passes. Confirm in browser network tools that a real chat request uses the portfolio hostname. Keep the previous frontend image available for rollback, accounting for Watchtower's image selection. Retire the old Vercel function and its runtime configuration only after cutover is verified and retirement is approved.

The VM runs the images from portfolio commit `a8a9a3b` with infrastructure from `849e6ad`. Both containers passed readiness checks. Chrome sent a direct project question and a generated follow-up through the public portfolio hostname and rendered both answers. A controlled stalled-provider check in the released container reached 3.8 Flash after 10 seconds. The old Vercel deployment remains available for rollback.
