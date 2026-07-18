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
    highlights: [
      "Used as a secure personal cloud storage platform, running a self-hosted Nextcloud instance on an AWS EC2 t3.small (Ubuntu 24.04 LTS) with 30GB gp3 SSD.",
      "Docker Compose V2 stack orchestrating three containers: Nextcloud (Apache + PHP), MariaDB, and Nginx reverse proxy — with persistent Docker Volumes for data safety.",
      "Custom domain sandeeppokharel.com.np routed through Cloudflare CDN with Full (Strict) SSL using a 15-year Origin Certificate, hiding the true server IP behind Cloudflare's edge network.",
      "Resolved real-world production bugs: trusted_domains DNS rebinding fix, Docker Compose V1→V2 migration (Python→Go), and Cloudflare SSL redirect loop (Flexible→Full Strict).",
    ],
    stack: ["AWS EC2", "Docker Compose", "Nextcloud", "MariaDB", "Nginx", "Cloudflare CDN", "Let's Encrypt → Origin Certificate", "Ubuntu 24.04", "UFW"],
    github: null,
    demo: "https://sandeeppokharel.com.np/",
    resumeStack: ["AWS EC2", "Docker Compose", "Nextcloud", "Cloudflare CDN"],
    resumeHighlights: [
      "Deployed a self-hosted Nextcloud enterprise storage platform on AWS EC2, serving as a secure personal cloud alternative for file management and synchronization.",
      "Configured a Docker Compose stack orchestrating Nextcloud, MariaDB, and Nginx with persistent data volumes.",
    ],
  },
  {
    title: "Molecular Zettelkasten",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "Used to instantly retrieve and converse with personal research notes — an AI-powered 'Second Brain' web app where users interact directly with their Obsidian vault hosted on AWS EC2.",
      "HyDE-driven Semantic RAG pipeline: Gemini generates hypothetical keywords, Transformers.js runs local vector searches against pre-computed .smart-env embeddings, and the top 5 notes are injected as context — no external database required.",
      "Full CI/CD with GitHub Actions (ESLint purity checks, npm audit, Gitleaks secret scanning, Vitest), Docker Hub push, and Watchtower zero-downtime auto-deployment on AWS EC2.",
      "Firebase Auth + Firestore for secure single-tenant access and cross-device chat synchronization with a dual-sync (localStorage + cloud) strategy.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Google Gemini API", "Transformers.js", "Firebase", "Docker", "GitHub Actions", "AWS EC2", "Tailwind CSS 4", "Framer Motion"],
    github: "https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten",
    demo: "https://wiki.sandeeppokharel.com.np/",
    resumeStack: ["Next.js 16", "Google Gemini API", "Docker", "AWS EC2"],
    resumeHighlights: [
      "Architected a full-stack AI knowledge platform connecting directly to an Obsidian Vault on AWS EC2, enabling secure querying and natural language chat with personal research notes.",
      "Engineered an automated CI/CD pipeline via GitHub Actions with Watchtower zero-downtime deployment on AWS EC2.",
    ],
  },
  {
    title: "Device Quality Assurance (DQA) Automation Suite",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "Used daily by the DSU IT Helpdesk to automate the intake and auditing of student laptops — features zero-prompt hardware auto-detection pulling WMI BIOS data on technician email entry.",
      "Non-blocking audio pipeline: records, plays back, and prompts the technician without freezing the WPF UI thread (async DispatcherTimer + C# COM interop).",
      "Self-modifying persistence engine: inspection records written directly into the .ps1 script — fully portable, zero external database or installer required.",
      "Iterated through 11 versions (v7–v11) with progressive UX refinements including SQLite history tracking, color-coded results, and smart CSV exports.",
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
    highlights: [
      "Used as a foundational blueprint to deploy autonomous AI agents that build and manage personal knowledge bases — a fully structured, intelligent Obsidian Vault template.",
      "Features strict architectural separation of 'Raw' sources from compiled 'Wiki' knowledge, enforced by schema linting checklists and Python automation scripts.",
      "Comes pre-configured with a `.agents/` folder containing specialized agent skills (ingest, lint, query) to automate the extraction of atomic Zettelkasten notes.",
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
      "This website — used as a central hub to showcase my professional identity, deployed projects, and technical skills to recruiters and peers. Built with React 19 and Vite, featuring cinematic video hero backgrounds, custom cursor effects, magnetic buttons, and GSAP scroll-triggered animations. Containerized with a multi-stage Docker build (Alpine Node + Nginx) and deployed to Vercel with analytics.",
    stack: ["React 19", "Vite 8", "Tailwind CSS", "GSAP", "Docker", "Nginx", "Vercel Analytics"],
    github: "https://github.com/pokharelsandeep333-commits/Portfolio",
    demo: "https://portfolio.sandeeppokharel.com.np/",
    resumeStack: ["React 19", "Vite", "GSAP", "Docker"],
    resumeHighlights: [
      "Designed and deployed an interactive, animated portfolio with GSAP, containerized via multi-stage Docker build.",
    ],
  },
];
