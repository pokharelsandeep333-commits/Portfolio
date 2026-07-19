# Glossary

## Digital Sandeep (AI Terminal)
An interactive, terminal-themed UI component on the portfolio that acts as a virtual representative of Sandeep Pokharel. It answers questions strictly constrained to Sandeep's skills, experience, and projects.

## Vercel Proxy Backend
The serverless function (`/api/chat`) responsible for securely holding the Gemini API key, executing the system prompt, and applying rate limits via Upstash Redis before passing the request to the LLM.
