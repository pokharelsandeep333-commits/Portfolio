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
      "Architected a Docker Compose stack (Nextcloud, MariaDB, Nginx) on Ubuntu 24.04 with automated container orchestration.",
      "Configured Cloudflare CDN with Full Strict SSL and a 15-year Origin Certificate, hiding the server IP behind edge-level DDoS protection.",
    ],
  },
  {
    title: "Molecular Zettelkasten",
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
    resumeDescription: "Engineered a self-hosted AI chat platform on AWS EC2 that queries my personal Obsidian vault using Gemini API and local vector search — no external databases.",
    resumeHighlights: [
      "Implemented a zero-database RAG pipeline: Transformers.js generates embeddings locally, cosine similarity ranks matches against pre-computed vault vectors.",
      "Configured CI/CD with four automated quality gates (ESLint, npm audit, Gitleaks, Vitest) deploying to EC2 via Docker Hub and Watchtower.",
    ],
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
