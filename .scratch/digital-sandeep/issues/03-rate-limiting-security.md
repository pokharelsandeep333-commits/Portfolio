# 03 — Rate Limiting & EC2 Production Security

**What to build:** Integration of Upstash Redis into the Vercel API to enforce the strict 10 req/min limit, returning a `429 Too Many Requests` status if breached (which the Terminal UI handles gracefully). It also configures CORS and the `VITE_API_URL` environment variable so the self-hosted EC2 Docker container can securely use the Vercel API.

**Blocked by:** 02 — Gemini AI Integration & System Prompt

**Status:** ready-for-agent

- [ ] Upstash Redis client is configured in `api/chat.js`.
- [ ] The API enforces a 10 requests/minute global rate limit per IP.
- [ ] The Terminal UI detects HTTP 429 and displays a user-friendly error message.
- [ ] The API sets CORS headers accepting requests from the EC2 origin.
- [ ] The React app uses `VITE_API_URL` for the API endpoint path.
- [ ] Backend tests mock the Redis client to verify the rate-limiting logic.
