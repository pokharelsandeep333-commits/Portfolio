// ============================================================
//  DATA — Projects
//  Sourced from LLM-Wiki analysis, Molecular Zettelkasten
//  codebase, SandeepCloud documentation, and GitHub repos.
//  Only real, built/shipped projects. No planned or group work.
// ============================================================

export const projects = [
  {
    title: "Molecular Zettelkasten",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "AI-powered 'Second Brain' web app with a JARVIS/E.D.I.T.H.-inspired interface — users converse directly with their Obsidian vault using Google Gemini's Interactions API with native multi-turn memory.",
      "HyDE-driven Semantic RAG pipeline: Gemini generates hypothetical keywords, Transformers.js runs local vector searches against pre-computed .smart-env embeddings, and the top 5 notes are injected as context — no external database required.",
      "Full CI/CD with GitHub Actions (ESLint purity checks, npm audit, Gitleaks secret scanning, Vitest), Docker Hub push, and Watchtower zero-downtime auto-deployment on AWS EC2.",
      "Firebase Auth + Firestore for secure single-tenant access and cross-device chat synchronization with a dual-sync (localStorage + cloud) strategy.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Google Gemini API", "Transformers.js", "Firebase", "Docker", "GitHub Actions", "AWS EC2", "Tailwind CSS 4", "Framer Motion"],
    github: "https://github.com/pokharelsandeep333/Molecular-Zettelkasten.git",
    demo: null,
    resumeHighlights: [
      "Architected and deployed a full-stack AI knowledge management platform using Next.js 16, Google Gemini Interactions API, and Firebase, with a zero-database Semantic RAG pipeline powered by Transformers.js vector embeddings.",
      "Built an end-to-end CI/CD pipeline using GitHub Actions (lint, audit, secret scan, test gates) with Docker Hub auto-push and Watchtower zero-downtime deployment on AWS EC2.",
    ],
  },
  {
    title: "SandeepCloud",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "Self-hosted Nextcloud instance on an AWS EC2 t3.small (Ubuntu 24.04 LTS) with 30GB gp3 SSD, serving as a personal enterprise-grade cloud storage platform.",
      "Docker Compose V2 stack orchestrating three containers: Nextcloud (Apache + PHP), MariaDB, and Nginx reverse proxy — with persistent Docker Volumes for data safety.",
      "Custom domain sandeeppokharel.com.np routed through Cloudflare CDN with Full (Strict) SSL using a 15-year Origin Certificate, hiding the true server IP behind Cloudflare's edge network.",
      "Resolved real-world production bugs: trusted_domains DNS rebinding fix, Docker Compose V1→V2 migration (Python→Go), and Cloudflare SSL redirect loop (Flexible→Full Strict).",
    ],
    stack: ["AWS EC2", "Docker Compose", "Nextcloud", "MariaDB", "Nginx", "Cloudflare CDN", "Let's Encrypt → Origin Certificate", "Ubuntu 24.04", "UFW"],
    github: null,
    demo: null,
    resumeHighlights: [
      "Deployed and maintained a self-hosted Nextcloud cloud platform on AWS EC2 using Docker Compose (Nextcloud + MariaDB + Nginx), with Cloudflare CDN, Full Strict SSL, and Elastic IP for production-grade stability.",
      "Diagnosed and resolved critical production issues including DNS rebinding attacks, Docker Compose V1→V2 migration, and infinite SSL redirect loops between Cloudflare and Nginx.",
    ],
  },
  {
    title: "DQA Automation Suite",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "Zero-prompt hardware auto-detection: serial number and battery status pulled from BIOS on technician email entry — no manual input at any step.",
      "Non-blocking audio pipeline: records, plays back, and prompts the technician without freezing the WPF UI thread (async DispatcherTimer + C# COM interop).",
      "Self-modifying persistence engine: inspection records written directly into the .ps1 script — fully portable, zero external database or installer required.",
      "Iterated through 11 versions (v7–v11) with progressive UX refinements including SQLite history tracking, color-coded results, and smart CSV exports.",
    ],
    stack: ["PowerShell 5.1", "WPF / XAML", "C# COM Interop", "Core Audio API", "WMI / CIM", "SQLite", "Windows Forms"],
    github: "https://github.com/pokharelsandeep333-commits/DQA-Automation.git",
    demo: null,
    resumeHighlights: [
      "Zero-prompt hardware auto-detection: serial number pulled from BIOS via Win32_BIOS and charging status via Win32_Battery, triggered automatically on technician email entry — no manual input required.",
      "CSV export strictly excludes 'Id', 'Start Date', and 'Status' columns; auto-detects connected USB drives and routes output there, falling back to Desktop.",
    ],
  },
  {
    title: "LLM-Wiki",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "AI-agent-powered personal knowledge base: raw source materials (articles, transcripts, documentation) are ingested by an AI agent that autonomously extracts atomic Zettelkasten notes with proper YAML frontmatter and bidirectional links.",
      "Custom Python CLI tooling (wiki_tool.py) for building a searchable JSONL catalog, linting frontmatter, and scanning source-to-concept link integrity — fully Git-versioned with 125+ concept notes across 30+ raw sources.",
      "Covers deeply researched domains: Docker networking (6 network types), Kubernetes architecture (pods, services, RBAC, autoscaling), CI/CD pipelines, AWS VPC networking, Cloudflare edge security, and AI/LLM engineering.",
    ],
    stack: ["Python", "Obsidian", "YAML", "JSONL", "Git", "Markdown", "AI Agent Workflows"],
    github: "https://github.com/pokharelsandeep333-commits/LLM-Wiki",
    demo: null,
    resumeHighlights: [
      "Built an AI-agent-driven knowledge management system processing 30+ raw technical sources into 125+ atomic Zettelkasten concept notes with automated frontmatter injection, bidirectional linking, and JSONL catalog generation.",
    ],
  },
  {
    title: "Personal Portfolio",
    status: "Production",
    badge: "badge-production",
    description:
      "This website — a modern, interactive portfolio built with React 19 and Vite, featuring cinematic video hero backgrounds, custom cursor effects, magnetic buttons, and GSAP scroll-triggered animations. Containerized with a multi-stage Docker build (Alpine Node + Nginx) and deployed to Vercel with analytics.",
    stack: ["React 19", "Vite 8", "Tailwind CSS", "GSAP", "Docker", "Nginx", "Vercel Analytics"],
    github: "https://github.com/pokharelsandeep333-commits/Portfolio",
    demo: "https://portfolio-phi-pearl-16.vercel.app/",
  },
];
