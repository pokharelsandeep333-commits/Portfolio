# 03 — Rate Limiting & EC2 Production Security

**What to build:** Integration of Upstash Redis into the Vercel API to enforce the strict 10 req/min limit, returning a `429 Too Many Requests` status if breached (which the Terminal UI handles gracefully). It also configures CORS and the `VITE_API_URL` environment variable so the self-hosted EC2 Docker container can securely use the Vercel API.

**Blocked by:** 02 — Gemini AI Integration & System Prompt

**Status:** done

- [x] Upstash Redis client is configured in `api/chat.js`.
- [x] The API enforces a 10 requests/minute global rate limit per IP.
- [x] The Terminal UI detects HTTP 429 and displays a user-friendly error message.
- [x] The API sets CORS headers accepting requests from the EC2 origin.
- [x] The React app uses `VITE_API_URL` for the API endpoint path.
- [x] Backend tests mock the Redis client to verify the rate-limiting logic.
