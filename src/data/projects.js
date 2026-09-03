// ============================================================
//  DATA — Projects
//  Sourced from LLM-Wiki analysis, Molecular Zettelkasten
//  codebase, SandeepCloud documentation, and GitHub repos.
//  Only real, built/shipped projects. No planned or group work.
// ============================================================

export const projects = [
  {
    title: "SandeepCloud",
    status: "Production",
    badge: "badge-production",
    description:
      "I got tired of trusting Google and Microsoft with my files, so I built my own cloud drive. It runs Nextcloud on an AWS EC2 instance I manage, backed by a Docker Compose stack with MariaDB and Nginx, all routed through Cloudflare with strict end-to-end encryption. I use it daily from my laptop and phone — same workflow as Google Drive, except every byte stays on my own server.",
    highlights: [
      "Deployed a Docker Compose stack containing Nextcloud, MariaDB, and Nginx on an AWS EC2 instance.",
      "Configured Cloudflare CDN with Full Strict SSL and an Origin Certificate for edge-level DDoS protection.",
      "Obfuscated the true server IP address behind Cloudflare to mitigate direct infrastructure attacks.",
      "Synced files across laptop and mobile devices daily using native Nextcloud clients.",
      "Managed user accounts and access controls for multi-tenant usage on a single server.",
    ],
    stack: ["AWS EC2", "Docker Compose", "Nextcloud", "MariaDB", "Nginx", "Cloudflare CDN", "Let's Encrypt → Origin Certificate", "Ubuntu 24.04", "UFW"],
    github: null,
    demo: "https://sandeeppokharel.com.np/",
    resumeStack: ["AWS EC2", "Docker Compose", "Nextcloud", "Cloudflare CDN"],
    resumeDescription: "Built and operate a self-hosted Nextcloud file server on AWS EC2, replacing third-party cloud storage with infrastructure I fully control.",
    resumeHighlights: [
      "Deployed a self-hosted 1TB Nextcloud server on AWS EC2, cutting $120/year in third-party storage costs.",
      "Architected a Docker Compose stack (Nextcloud, MariaDB, Nginx) on Ubuntu 24.04 with automated orchestration.",
      "Configured Cloudflare CDN with Full Strict SSL and an Origin Certificate, hiding the server IP from attackers.",
    ],
  },
  {
    title: "ShiftSentry",
    status: "Production",
    badge: "badge-production",
    description:
      "I work multiple jobs on campus and kept losing track of how close I was to my weekly hour cap until it was already too late. So I built the tool I needed. ShiftSentry tracks scheduled and completed shifts across multiple jobs, projects the week's total before it happens, and warns at 80%, 90%, and 100% of the limit. It also works out gross pay, taxes, and deductions so I know what actually lands in my account. It installs as a web app or as a signed Android build.",
    highlights: [
      "Tracked scheduled and completed shifts across multiple jobs, each with its own pay rate, deductions, and weekly hour cap.",
      "Projected the week's total before it happens and warned at 80%, 90%, and 100% of the cap, so a limit never gets crossed by surprise.",
      "Calculated gross pay, taxes, and deductions per job, then charted net earnings history over time with Recharts.",
      "Kept every user's data private to their own account with Supabase Row Level Security, enforced by the database itself rather than by app code.",
      "Ran a GitHub Actions CI/CD pipeline on every push — unit tests, type-checking, linting, secret scanning, and CodeQL security analysis — before any release ships.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase Auth", "PostgreSQL", "Row Level Security", "Prisma 7", "Tailwind CSS v4", "Recharts", "Zod", "Docker", "GitHub Actions", "CodeQL", "Android TWA"],
    github: "https://github.com/pokharelsandeep333-commits/ShiftSentry",
    demo: "https://sentry.sandeeppokharel.com.np/",
    resumeStack: ["Next.js 16", "Supabase", "Prisma", "Docker"],
    resumeHighlights: [
      "Built a multi-job shift, hours, and earnings tracker with Next.js 16, TypeScript, and Supabase Postgres.",
      "Enforced per-user data isolation with Supabase Row Level Security, keeping admin access server-side via Prisma.",
      "Automated a seven-gate CI/CD pipeline (Gitleaks, tests, CodeQL, Docker) promoting signed, SBOM-attested images.",
    ],
  },
  {
    title: "Private RAG Search Engine",
    status: "Production",
    badge: "badge-production",
    description:
      "I wanted an AI that actually knows what I know — not the internet's version of it. This app reads my private Obsidian vault on EC2, runs semantic search against my notes using local vector embeddings, and feeds the matched context to Gemini so every answer is grounded in things I've actually written. The whole stack auto-deploys through GitHub Actions and Watchtower — push code, and it's live in five minutes.",
    highlights: [
      "Engineered a zero-database RAG pipeline running entirely in-process on the server.",
      "Embedded search keywords locally using Transformers.js to match against pre-computed Obsidian vault vectors.",
      "Automated zero-downtime container updates on EC2 via Docker Hub and Watchtower.",
      "Enforced four automated quality gates in the GitHub Actions CI/CD pipeline before every deployment.",
      "Synchronized chat sessions across devices in real time using Firestore and Firebase Auth.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Google Gemini API", "Transformers.js", "Firebase", "Docker", "GitHub Actions", "AWS EC2", "Tailwind CSS 4", "Framer Motion"],
    github: "https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten",
    demo: "https://wiki.sandeeppokharel.com.np/",
    resumeStack: ["Next.js 16", "Google Gemini API", "Docker", "AWS EC2"],
    resumeTitle: "Private RAG Search Engine",
    resumeDescription: "Engineered a self-hosted AI chat platform on AWS EC2 that queries my personal Obsidian vault using Gemini API and local vector search — no external databases.",
    resumeHighlights: [
      "Engineered a zero-database RAG pipeline on AWS EC2, embedding queries locally with Transformers.js.",
      "Implemented secure user authentication and protected API routes using Firebase Auth and JWT validation.",
      "Configured a GitHub Actions CI/CD pipeline with zero-downtime container updates via Watchtower.",
    ],
  },
  {
    title: "Private Encrypted DNS Server",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "Standard DNS queries are sent in plaintext over UDP Port 53, making them easy for ISPs and hackers on public Wi-Fi to intercept, log, or hijack. To bypass this, I engineered a private DNS-over-HTTPS (DoH) proxy on AWS EC2 running AdGuard Home. This wraps all my DNS requests securely inside standard HTTPS traffic, preventing any local network from seeing my web traffic while blocking ads and trackers at the network level.",
    highlights: [
      "Deployed AdGuard Home as a Docker container on an AWS EC2 instance to serve as a private, network-wide ad blocker.",
      "Configured a DNS-over-HTTPS (DoH) tunnel to encrypt DNS queries over Port 443, successfully bypassing Port 53 network restrictions.",
      "Secured the DoH endpoint using Let's Encrypt SSL certificates (via Certbot) and routed traffic through Cloudflare (DNS Only mode).",
      "Configured Windows and iOS devices to natively tunnel DNS traffic to the custom DoH server.",
      "Eliminated SNI leaks via Encrypted Client Hello (ECH), verifying zero plain-text DNS packets with Wireshark.",
      "Opened the server for public use. Anyone can secure their web traffic by configuring their network settings with IP 3.222.237.91 and enabling HTTPS-only DNS using the template https://dns.sandeeppokharel.com.np/dns-query.",
    ],
    stack: ["AWS EC2", "Docker", "AdGuard Home", "DNS-over-HTTPS (DoH)", "Cloudflare", "Let's Encrypt", "Wireshark"],
    github: null,
    demo: null,
    resumeStack: [],
    resumeHighlights: [],
  },
  {
    title: "Device Quality Assurance (DQA) Automation Suite",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "Laptop inspections at the DSU helpdesk used to be fully manual — technicians typed serial numbers, battery stats, and storage info by hand for every single machine. I wrote a PowerShell tool with a WPF interface that pulls all of that from WMI automatically the moment it launches. One file, no installer, no database — the script stores its own inspection records inside itself.",
    highlights: [
      "Automated hardware detection using WMI/CIM queries to eliminate manual data entry for technicians.",
      "Compiled inline C# at runtime to interact with the Windows Core Audio API for hardware testing.",
      "Executed hardware diagnostics on background threads to keep the WPF user interface responsive.",
      "Engineered a self-modifying persistence engine that stores inspection records directly inside the script file.",
      "Packaged the entire application and data store as a single executable PowerShell file with zero dependencies.",
    ],
    stack: ["PowerShell 5.1", "WPF / XAML", "C# COM Interop", "Core Audio API", "WMI / CIM", "SQLite", "Windows Forms"],
    github: "https://github.com/pokharelsandeep333-commits/DQA-Automation.git",
    demo: null,
    resumeStack: ["PowerShell 5.1", "WPF / XAML", "WMI / CIM", "SQLite"],
    resumeHighlights: [
      "Developed zero-prompt hardware auto-detection scripts pulling WMI BIOS data, automating laptop intake for DSU IT technicians to save manual diagnostic hours.",
      "Built a self-modifying persistence engine mapping hardware inspection records directly into the script.",
    ],
  },
  {
    title: "Agentic LLM-Wiki Template",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "I open-sourced the vault structure behind Molecular Zettelkasten so anyone can clone it and have a knowledge base that AI agents can read, write, and maintain out of the box. Drop raw notes into a folder, point an AI agent at it, and it processes them into clean, interlinked wiki entries with proper frontmatter and backlinks. Ships with pre-built agent skills, Python automation scripts, and strict schema enforcement — no prompt engineering or manual setup required.",
    highlights: [
      "Structured the vault to separate raw collected material from AI-extracted, polished knowledge.",
      "Automated the extraction of atomic notes with proper frontmatter and wikilinks back to original sources.",
      "Provided pre-built agent skills to allow AI IDEs to interact with the vault without manual prompt engineering.",
      "Enforced strict markdown schemas and directory layouts to guarantee AI navigability.",
      "Wrote Python automation scripts to build searchable catalogs, lint schemas, and track unprocessed files.",
    ],
    stack: ["Python", "Obsidian", "YAML", "Git", "Markdown", "AI Agent Workflows"],
    github: "https://github.com/pokharelsandeep333-commits/Personal-Wiki-Template",
    demo: null,
    resumeStack: ["Python", "Obsidian", "Git", "AI Agent Workflows"],
    resumeHighlights: [
      "Built an intelligent Obsidian Vault template with strict schema enforcement, providing a structural blueprint for AI agents to autonomously build and query knowledge bases.",
      "Pre-configured with specialized agent skills to autonomously ingest raw sources and extract atomic Zettelkasten notes with proper frontmatter.",
    ],
  },
  {
    title: "Personal Portfolio",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "This site. Built with React 19 and Vite, animated with GSAP, and includes an AI chatbot (\"Digital Sandeep\") powered by Gemini that answers questions about my work. Deployed to both Vercel and my own EC2 server as a Docker container, with the same four-gate CI/CD pipeline I use across all my projects.",
    highlights: [
      "Built a Gemini-powered AI chatbot scoped strictly to my actual projects and professional experience.",
      "Validated serverless API requests with Zod and enforced per-IP rate limiting using Upstash Redis.",
      "Orchestrated scroll-triggered animations, magnetic buttons, and custom cursor effects using GSAP.",
      "Optimized initial page load times by lazily loading a looping cinematic background video.",
      "Containerized the frontend using a multi-stage Docker build and deployed via an automated CI/CD pipeline.",
    ],
    stack: ["React 19", "Vite 8", "Google Gemini API", "Tailwind CSS", "GSAP", "Upstash Redis", "Zod", "Docker", "Nginx", "Vercel"],
    github: "https://github.com/pokharelsandeep333-commits/Portfolio",
    demo: "https://portfolio.sandeeppokharel.com.np/",
    resumeStack: ["React 19", "Vite", "GSAP", "Docker"],
    resumeHighlights: [
      "Designed and deployed an interactive, animated portfolio with GSAP, containerized via multi-stage Docker build.",
    ],
  },
];
