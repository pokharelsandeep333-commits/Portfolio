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
    hideOnResume: true,
    description:
      "I got tired of trusting Google and Microsoft with my files, so I built my own cloud drive. It runs Nextcloud on an AWS EC2 instance I manage, in a Docker Compose stack with MariaDB and Nginx, behind Cloudflare with Full Strict SSL. I use it every day from my laptop and phone. It works like Google Drive, except the files stay on my own server.",
    highlights: [
      "Deployed a Docker Compose stack with Nextcloud, MariaDB, and Nginx on an AWS EC2 instance.",
      "Configured Cloudflare CDN with Full Strict SSL and an Origin Certificate, with DDoS protection at Cloudflare's edge.",
      "Hid the server's real IP address behind Cloudflare so attackers can't target it directly.",
      "Synced files between my laptop and phone every day with the native Nextcloud clients.",
      "Managed accounts and permissions for multiple users on one server.",
    ],
    stack: ["AWS EC2", "Docker Compose", "Nextcloud", "MariaDB", "Nginx", "Cloudflare CDN", "Let's Encrypt → Origin Certificate", "Ubuntu 24.04", "UFW"],
    github: null,
    demo: "https://sandeeppokharel.com.np/",
    resumeStack: ["AWS EC2", "Docker Compose", "Nextcloud", "Cloudflare CDN"],
    resumeDescription: "Built and operate a self-hosted Nextcloud file server on AWS EC2, replacing third-party cloud storage with infrastructure I fully control.",
    resumeHighlights: [
      "Deployed a self-hosted 1TB Nextcloud server on AWS EC2, cutting $120/year in third-party storage costs.",
      "Architected a Docker Compose stack (Nextcloud, MariaDB, Nginx) on Ubuntu 24.04.",
      "Configured Cloudflare CDN with Full Strict SSL and an Origin Certificate, hiding the server IP from attackers.",
    ],
  },
  {
    title: "Home SOC Lab (Wazuh SIEM)",
    status: "Production",
    badge: "badge-production",
    description:
      "Once I had two servers and an AWS account on the public internet, I realized I would only find a break-in by luck. So I built my own home SOC. Wazuh runs in Docker on an always-on homelab machine as the manager, indexer, and dashboard, and agents on both of my EC2 servers report to it over a private Tailscale network. It also reads my AWS account's CloudTrail logs and watches the Docker containers on each server. I wrote my own detection rules for the risks in my setup, tuned out the false alarms, and every serious alert lands in a private Discord channel. The whole setup is public on GitHub, so anyone can check the rules or rebuild it.",
    highlights: [
      "Deployed a single-node Wazuh 4.14.8 stack in Docker and enrolled agents on two AWS EC2 servers, which reach it over Tailscale on TCP 1514 and nothing else.",
      "Integrated AWS CloudTrail through a read-only IAM user and wrote rules for root console logins, new IAM users and keys, MFA removal, and CloudTrail tampering.",
      "Built custom detections for bots probing for .env and .git secrets, escalating when a probe gets a 2xx response or one IP keeps trying.",
      "Tuned out false positives (AppArmor denials, a Rust coreutils rootcheck flag, about 14,000 Docker health-check alerts a day) only after proving each was harmless, with tests showing real attacks still alert.",
      "Tested detection by attacking my own servers: an SSH brute force followed by a new user correlated into one level-15 alert, and an AWS root sign-in alerted within minutes.",
      "Raised the SandeepCloud CIS benchmark score from 53% to 65%, added real-time file integrity monitoring, and routed every level 10+ alert to Discord with a written triage playbook.",
      "Published the setup as an MIT-licensed repo: 32 custom rules, setup scripts, and 8 rebuild guides, with GitHub Actions replaying 36 test events through a clean Wazuh manager on every push.",
      "Found a bug in Wazuh's own CIS policy (a check that can never pass) and reported it upstream as wazuh/wazuh#40275.",
    ],
    stack: ["Wazuh 4.14.8", "Docker", "Tailscale", "AWS CloudTrail", "AWS S3", "AWS IAM", "CloudFormation", "Ubuntu", "CIS Benchmarks", "MITRE ATT&CK", "Discord Webhooks", "GitHub Actions", "WSL2"],
    github: "https://github.com/pokharelsandeep333-commits/wazuh-home-soc",
    // The dashboard is bound to localhost on purpose, so there is nothing public to link.
    demo: null,
    resumeStack: ["Wazuh", "Tailscale", "AWS CloudTrail", "Docker"],
    resumeDescription: "Built a home SOC with Wazuh SIEM monitoring two AWS EC2 servers, the AWS account through CloudTrail, and Docker containers over a zero-trust Tailscale network.",
    resumeHighlights: [
      "Deployed Wazuh SIEM in Docker, monitoring two AWS EC2 servers over a zero-trust Tailscale network.",
      "Wrote custom detection rules for AWS root logins, IAM changes, and .env secret probes via CloudTrail.",
      "Tuned out ~14,000 daily false-positive alerts and raised the server's CIS benchmark score from 53% to 65%.",
    ],
  },
  {
    title: "ShiftSentry",
    status: "Production",
    badge: "badge-production",
    description:
      "I work multiple jobs on campus and kept losing track of how close I was to my weekly hour cap until it was already too late, so I built ShiftSentry. It tracks scheduled and completed shifts across multiple jobs, projects the week's total before it happens, and warns at 80%, 90%, and 100% of the limit. It also works out gross pay, taxes, and deductions so I know what actually lands in my account. It installs as a web app or as a signed Android build.",
    highlights: [
      "Tracked scheduled and completed shifts across multiple jobs, each with its own pay rate, deductions, and weekly hour cap.",
      "Projected the week's total before it happens and warned at 80%, 90%, and 100% of the cap, so a limit never gets crossed by surprise.",
      "Calculated gross pay, taxes, and deductions per job, then charted net earnings history over time with Recharts.",
      "Kept every user's data private to their own account with Supabase Row Level Security, which Postgres enforces on every query.",
      "Ran a GitHub Actions CI/CD pipeline on every push (unit tests, type-checking, linting, secret scanning, and CodeQL security analysis) before any release ships.",
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
      "I wanted an AI that answers from my own notes. This app reads my private Obsidian vault on EC2, runs semantic search over it with local vector embeddings, and passes the matching notes to Gemini, so every answer is grounded in something I wrote. It deploys itself through GitHub Actions and Watchtower: I push code, and it's live in five minutes.",
    highlights: [
      "Built a RAG pipeline with no database: retrieval runs in-process on the server.",
      "Embedded search queries locally with Transformers.js and matched them against vectors precomputed from the vault.",
      "Automated zero-downtime container updates on EC2 via Docker Hub and Watchtower.",
      "Ran four automated quality gates in GitHub Actions before every deployment.",
      "Synced chat sessions across devices in real time with Firestore and Firebase Auth.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Google Gemini API", "Transformers.js", "Firebase", "Docker", "GitHub Actions", "AWS EC2", "Tailwind CSS 4", "Framer Motion"],
    github: "https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten",
    demo: "https://wiki.sandeeppokharel.com.np/",
    resumeStack: ["Next.js 16", "Google Gemini API", "Docker", "AWS EC2"],
    resumeTitle: "Private RAG Search Engine",
    resumeDescription: "Engineered a self-hosted AI chat platform on AWS EC2 that queries my personal Obsidian vault using Gemini API and local vector search, with no external databases.",
    resumeHighlights: [
      "Engineered a zero-database RAG pipeline on AWS EC2, embedding queries locally with Transformers.js.",
      "Secured sign-in and protected API routes with Firebase Auth and server-side JWT validation.",
      "Configured a GitHub Actions CI/CD pipeline with zero-downtime container updates via Watchtower.",
    ],
  },
  {
    title: "Private Encrypted DNS Server",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "Standard DNS queries travel in plaintext over UDP port 53, so an ISP or anyone on the same public Wi-Fi can intercept, log, or hijack them. I run a private DNS-over-HTTPS (DoH) server on AWS EC2 with AdGuard Home. My devices send their DNS lookups inside ordinary HTTPS, so the local network can't see which sites I look up, and AdGuard blocks ads and trackers before they load.",
    highlights: [
      "Deployed AdGuard Home in Docker on an AWS EC2 instance as a private, network-wide ad blocker.",
      "Configured DNS-over-HTTPS (DoH) to carry encrypted DNS queries over port 443, which gets around networks that restrict port 53.",
      "Secured the DoH endpoint with Let's Encrypt certificates from Certbot, with its record on Cloudflare in DNS-only mode.",
      "Configured Windows and iOS devices to send their DNS traffic to the DoH server natively.",
      "Closed the SNI leak with Encrypted Client Hello (ECH) and confirmed in Wireshark that no plaintext DNS packets were sent.",
      "Opened the server to the public: set your DNS to 3.222.237.91 and use the DoH template https://dns.sandeeppokharel.com.np/dns-query to encrypt your own lookups.",
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
      "Laptop inspections at the DSU helpdesk used to be fully manual: technicians typed serial numbers, battery stats, and storage info by hand for every machine. I wrote a PowerShell tool with a WPF interface that reads all of that from WMI as soon as it launches. It is a single file with no installer and no database, and it saves its inspection records inside the script itself.",
    highlights: [
      "Automated hardware detection with WMI/CIM queries, so technicians no longer type it in by hand.",
      "Compiled inline C# at runtime to call the Windows Core Audio API for audio hardware tests.",
      "Ran hardware diagnostics on background threads so the WPF interface stays responsive.",
      "Built self-modifying persistence: the script writes inspection records into its own file.",
      "Packaged the whole app and its data as one PowerShell file with zero dependencies.",
    ],
    stack: ["PowerShell 5.1", "WPF / XAML", "C# COM Interop", "Core Audio API", "WMI / CIM", "Windows Forms"],
    github: "https://github.com/pokharelsandeep333-commits/DQA-Automation.git",
    demo: null,
    resumeStack: ["PowerShell 5.1", "WPF / XAML", "WMI / CIM", "C# COM Interop"],
    resumeHighlights: [
      "Automated laptop intake for DSU IT technicians with PowerShell scripts that read hardware and BIOS data from WMI.",
      "Stored inspection records inside the script file itself, with no installer or database.",
    ],
  },
  {
    title: "Agentic LLM-Wiki Template",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "I open-sourced the vault structure behind Molecular Zettelkasten so anyone can clone it and get a knowledge base that AI agents can maintain. You drop raw notes into a folder, point an agent at it, and it turns them into interlinked wiki entries with frontmatter and backlinks. It comes with agent skills, Python automation scripts, and schema checks, so you don't have to write prompts or configure anything first.",
    highlights: [
      "Structured the vault to keep raw collected material apart from the notes the AI extracts from it.",
      "Automated extraction of atomic notes, each with frontmatter and wikilinks back to its source.",
      "Included agent skills so AI IDEs can work with the vault without hand-written prompts.",
      "Enforced strict Markdown schemas and a fixed directory layout so agents can find their way around the vault.",
      "Wrote Python scripts that build searchable catalogs, lint schemas, and track unprocessed files.",
    ],
    stack: ["Python", "Obsidian", "YAML", "Git", "Markdown", "AI Agent Workflows"],
    github: "https://github.com/pokharelsandeep333-commits/Personal-Wiki-Template",
    demo: null,
    resumeStack: ["Python", "Obsidian", "Git", "AI Agent Workflows"],
    resumeHighlights: [
      "Built an Obsidian vault template with strict schema checks that AI agents use to build and query knowledge bases.",
      "Included agent skills that ingest raw sources and extract atomic Zettelkasten notes with frontmatter.",
    ],
  },
  {
    title: "Personal Portfolio",
    status: "Production",
    badge: "badge-production",
    hideOnResume: true,
    description:
      "This site. It's built with React 19 and Vite, animated with GSAP, and has an AI chatbot (\"Digital Sandeep\") on Gemini that answers questions about my work. It deploys to Vercel and to my own EC2 server as a Docker container, through the same four-gate CI/CD pipeline I use on my other projects.",
    highlights: [
      "Built a Gemini-powered AI chatbot scoped strictly to my actual projects and professional experience.",
      "Validated serverless API requests with Zod and enforced per-IP rate limiting using Upstash Redis.",
      "Built scroll-triggered animations and magnetic buttons with GSAP.",
      "Served a silent lightning video loop to desktop visitors only, paused off-screen with an IntersectionObserver, while phones get a responsive WebP portrait and never download the video.",
      "Containerized the frontend with a multi-stage Docker build, deployed through an automated CI/CD pipeline.",
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
