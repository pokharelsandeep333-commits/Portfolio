# 02 — Gemini AI Integration & System Prompt

**What to build:** The `/api/chat.js` function is upgraded to call the real Gemini API using the official SDK. We inject a hardcoded system prompt detailing the user's resume and rules. The Terminal UI now displays actual AI-generated answers about the portfolio.

**Blocked by:** 01 — Basic Terminal UI & API Skeleton

**Status:** done

- [x] The Vercel function utilizes the Gemini SDK to generate content.
- [x] A detailed system prompt is defined in the backend restricting the AI to portfolio context.
- [x] The Terminal UI properly displays the Markdown/text returned by Gemini.
- [x] Backend tests mock the Gemini SDK to verify prompt injection works without real network calls.
