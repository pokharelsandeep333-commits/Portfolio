# 1. Vercel Serverless Function with Redis for AI Agent

Date: 2026-07-19

## Status

Accepted

## Context

We are adding an interactive "Digital Sandeep" AI Terminal to the static Vite/React portfolio. The portfolio is deployed to both Vercel and an AWS EC2 instance (via a static Nginx Docker container). 

We need to securely call the Gemini API without exposing the API key on the frontend, while maintaining lightning-fast performance and adhering to the strict global security rule: LLM proxies must be rate-limited to 10 requests per minute.

We considered:
1. **Local-in-browser AI (Transformers.js)**: Too heavy for recruiters to download on initial load.
2. **Dedicated Node.js Docker Container**: Adds unnecessary DevOps overhead and infrastructure cost for a mostly static site.

## Decision

We will use a **Vercel Serverless Function** (`/api/chat`) as the secure proxy backend.
- The Vercel function will securely store the Gemini API key.
- It will enforce rate-limiting (10 req/min) globally using **Upstash Redis**, ensuring malicious actors cannot bypass limits due to Vercel's stateless container model.
- For the EC2 deployment, the Vite build process will be injected with `VITE_API_URL` pointing to the Vercel domain, and the Vercel function will be configured with CORS to accept requests from the EC2 origin.

## Consequences

- **Positive**: Zero backend infrastructure to manage on EC2. API keys remain strictly secure.
- **Positive**: Strict compliance with the 10 req/min rate limit rule via Redis.
- **Negative**: Introduces a dependency on Upstash Redis and Vercel for the backend API, slightly increasing the complexity of local development (requires setting up Redis credentials locally).
