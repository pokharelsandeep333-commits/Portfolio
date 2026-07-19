# 01 — Basic Terminal UI & API Skeleton

**What to build:** A working React Terminal UI that accepts user input, displays a blinking cursor (loading state), and sends the request to a skeleton Vercel serverless function (`/api/chat.js`). The API simply returns a hardcoded "Hello" response to prove the frontend-to-backend connection works.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Terminal UI component is built and matches the portfolio's aesthetics (Tailwind/GSAP).
- [x] Terminal accepts user input and displays it in a chat-log format.
- [x] A skeleton Vercel API route exists at `api/chat.js` returning a static string.
- [x] The React component successfully fetches from `/api/chat` and displays the response.
- [x] Frontend tests (Vitest/RTL) mock `fetch()` and verify the UI rendering.
