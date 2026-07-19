Status: ready-for-agent

## Problem Statement

The portfolio currently serves as a static resume. While the UI is polished, it lacks a highly interactive, showcase-level feature that actively demonstrates Sandeep's deep engineering and AI integration skills to recruiters and hiring managers. 

## Solution

An interactive "Digital Sandeep" AI Terminal. This terminal-themed UI component will act as a virtual representative of Sandeep, securely backed by a Vercel Serverless Function and the Gemini API, and protected by Upstash Redis rate-limiting.

## User Stories

1. As a recruiter, I want to type questions into a hacker-themed terminal UI, so that I can learn about Sandeep's skills in a format that reinforces his IT Support/PowerShell background.
2. As a recruiter, I want the AI to answer specifically about Sandeep's resume, tech stack, and projects, so that I don't get generic ChatGPT responses.
3. As Sandeep, I want the Gemini API key to be stored strictly in a Vercel serverless function, so that malicious actors cannot scrape it from the frontend code.
4. As Sandeep, I want the API endpoint to be strictly rate-limited globally to 10 requests per minute via Upstash Redis, so that my Gemini billing quota is protected from spam and abuse.
5. As Sandeep, I want my self-hosted EC2 Docker deployment to securely route chat requests to the Vercel function using a `VITE_API_URL` environment variable, so that I do not have to manage an additional Node.js backend container on EC2.
6. As a user, I want to see a loading indicator (like a blinking terminal cursor) while the AI thinks, so that I know the system is processing my question.

## Implementation Decisions

- **Frontend Component:** A new React component mimicking a command-line interface, integrating with the existing Tailwind/GSAP styling.
- **Backend Architecture:** An `api/chat.js` (or `.ts`) Vercel serverless function using the official Gemini SDK.
- **Security & Rate Limiting:** Integration of `@upstash/redis` in the serverless function to track IPs and strictly enforce the 10 req/min limit.
- **System Prompt:** A hardcoded system prompt injected on the backend containing the exact project details, constraints, and professional tone rules outlined in `CONTEXT.md` and `AGENTS.md`.
- **Cross-Origin Configuration:** The Vercel function will configure CORS to accept incoming requests from the EC2 origin (`portfolio.sandeeppokharel.com.np`).

## Testing Decisions

- A good test will focus on external behavior: Does the UI render the AI's response? Does the API return a 429 Too Many Requests status when the limit is breached?
- **Modules tested:** The React Terminal component and the Vercel serverless handler.
- **Seams:** We will use `vitest` and `@testing-library/react`. We will mock `fetch()` on the frontend, and we will mock the Redis and Gemini clients on the backend to test rate-limiting logic without actual network overhead.

## Out of Scope

- A dedicated backend Docker container for EC2.
- Vector databases or RAG (Retrieval-Augmented Generation); all data fits securely in the system prompt.
- User authentication (the route is public but globally rate-limited).

## Further Notes

Ensure the terminal UI matches the font and aesthetics of the existing portfolio. The tone of the AI should match the strict humanized, factual, engineering-focused tone defined in the project's global rules.
