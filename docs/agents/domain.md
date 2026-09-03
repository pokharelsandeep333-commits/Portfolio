# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`docs/adr/`** — read ADRs that touch the area you're about to work in.

This repo does not keep a `CONTEXT.md` glossary. Don't look for one, don't flag its absence, and don't suggest creating one upfront. If `/domain-modeling` later resolves terms that are worth writing down, it can introduce one then.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (Vercel serverless for the AI agent) — but worth reopening because…_
