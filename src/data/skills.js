// ============================================================
//  DATA — Skills
//  Sourced from actual project usage across Molecular
//  Zettelkasten, SandeepCloud, DQA Suite, LLM-Wiki, and
//  Portfolio. No "learning" labels — these are all used skills.
//  Exception: "Security & Networking" comes from Cyber Operations
//  coursework labs, not personal projects. `coursework` makes the
//  chatbot say so, and `projectItems` lists the exceptions it must
//  not label as coursework (Wazuh runs in the Home SOC Lab project);
//  `wide` renders it full-width so the 3-column grid has no orphan card.
// ============================================================

export const skills = [
  {
    category: "Security & Networking",
    icon: "🛡",
    wide: true,
    coursework: true,
    projectItems: ["Wazuh"],
    items: ["Wazuh", "Kali Linux", "Wireshark", "Nmap", "Cisco Packet Tracer", "Metasploit", "Burp Suite", "Splunk", "Suricata", "Zeek", "Cowrie"],
    highlight: ["Wazuh", "Kali Linux", "Wireshark", "Nmap", "Cowrie"],
  },
  {
    category: "Languages",
    icon: "⌨",
    items: ["JavaScript / TypeScript", "PowerShell", "Python", "Java", "C", "C++", "HTML / CSS", "SQL", "Bash"],
    highlight: ["JavaScript / TypeScript", "PowerShell", "Python"],
  },
  {
    category: "Cloud & DevOps",
    icon: "☁",
    items: ["AWS EC2", "Docker / Docker Compose", "Nginx", "Cloudflare (CDN, SSL, DNS)", "GitHub Actions CI/CD", "Watchtower", "Linux (Ubuntu)", "UFW Firewall", "WSL2"],
    highlight: ["AWS EC2", "Docker / Docker Compose", "GitHub Actions CI/CD"],
  },
  {
    category: "Web & Frameworks",
    icon: "🌐",
    items: ["Next.js 16", "React 19", "Node.js", "Vite", "Tailwind CSS", "GSAP", "Framer Motion", "Firebase (Auth + Firestore)", "Supabase (Auth + RLS)", "Prisma", "MySQL", "PostgreSQL", "Redis", "Vercel"],
    highlight: ["Next.js 16", "React 19", "Supabase (Auth + RLS)"],
  },
  {
    category: "AI & Data",
    icon: "🧠",
    items: ["Google Gemini API", "Transformers.js", "Hugging Face", "Ollama", "VLLM", "Hermes Agent", "Open WebUI", "n8n", "Streamlit", "RAG Pipelines (HyDE)", "Vector Embeddings", "gray-matter", "Semantic Search"],
    highlight: ["Google Gemini API", "Transformers.js", "RAG Pipelines (HyDE)"],
  },
  {
    category: "IT Systems & AV",
    icon: "🖥",
    items: ["WMI / CIM", "Active Directory", "Microsoft Intune MDM", "Remote Desktop", "WPF / XAML", "FOG Project", "Windows OS", "vMix", "OBS Studio", "Stream Deck / Companion", "Live Streaming (RTMP)"],
    highlight: ["Active Directory", "Microsoft Intune MDM", "vMix"],
  },
  {
    category: "Tools & Platforms",
    icon: "🔧",
    items: ["Git / GitHub", "VS Code", "SQLite", "Docker Hub", "Obsidian", "Vitest", "ESLint", "Postman", "Google Stitch", "AdGuard Home", "Raspberry Pi", "Tailscale", "Proxmox"],
    highlight: ["Git / GitHub", "Docker Hub"],
  },
];

// ============================================================
//  DATA — Resume-only Skills (7 strict 1-line categories)
//  Used exclusively by ResumeView.jsx.
// ============================================================
export const resumeSkills = [
  {
    category: "Languages",
    items: ["JavaScript / TypeScript", "PowerShell", "Python", "Java", "C/C++", "SQL", "HTML / CSS"],
  },
  {
    category: "Security",
    // Short names keep this row on one line; the web card spells them out.
    items: ["Wazuh", "Kali", "Wireshark", "Nmap", "Packet Tracer", "Metasploit", "Burp Suite", "Cowrie"],
  },
  {
    category: "Tools",
    items: ["Git / GitHub", "Docker", "Vitest", "Obsidian", "Tailscale", "AdGuard Home", "Proxmox"],
  },
  {
    category: "Lib & Frameworks",
    items: ["Next.js", "React", "Node.js", "Vite", "Tailwind CSS", "GSAP", "Prisma"],
  },
  {
    category: "Cloud",
    items: ["AWS EC2", "Nginx", "Cloudflare", "GitHub Actions", "Vercel", "Supabase", "Redis"],
  },
  {
    category: "AI & Automation",
    items: ["RAG", "Ollama", "Hugging Face", "n8n", "VLLM", "Hermes Agent", "Streamlit", "Open WebUI"],
  },
  {
    category: "IT Systems & AV",
    items: ["Active Directory", "Microsoft Intune", "Device Imaging", "MFA", "vMix", "OBS", "Stream Deck", "Live Streaming"],
  },
];

export const about = {
  name: "Sandeep Pokharel",
  title: "IT Support Desk Technician",
  subtitle: "Cyber Operations · Dakota State University",
  bio: [
    "Cyber Operations sophomore at Dakota State University, originally from Kathmandu, Nepal. I like building things that work and figuring out why things break.",
    "My day job is IT Support at DSU: deploying hardware, troubleshooting networks, managing Intune enrollment, and making sure students and faculty can actually get work done. I also run the live broadcasts for DSU athletics and esports: switching cameras, mixing audio, and keeping the stream up while the game is happening.",
    "After hours I build my own infrastructure: self-hosted cloud storage on AWS, an AI platform that answers from my personal notes, automation tools for the helpdesk, and a home SOC that watches my servers. Most of it runs in Docker on servers I manage.",
  ],
  details: [
    { label: "Education", val: "B.S. Cyber Operations", sub: "Dakota State University · Fall 2025 to Present" },
    { label: "Current Role", val: "IT Support Desk Technician", sub: "DSU Information Technology Services · May 2026 to Present" },
    { label: "Also At DSU", val: "Multimedia Streaming Technician", sub: "DSU Information Technology Services · August 2026 to Present" },
    { label: "Location", val: "Madison, South Dakota", sub: "Originally from Kathmandu, Nepal" },
    { label: "Languages", val: "English · Nepali · Hindi", sub: "Trilingual" },
    { label: "Interests", val: "DevOps · Cloud · DevSecOps · SOC · AI · Network Engineering", sub: "Career focus areas" },
  ],
  tags: ["IT Support", "Security-Minded", "Self-Taught Builder", "Cross-Cultural Communicator"],
  contact: {
    email: "contact@sandeeppokharel.com.np",
    linkedin: "https://www.linkedin.com/in/sandeeppokharel333",
    github: "https://github.com/pokharelsandeep333-commits",
    portfolio: "https://portfolio.sandeeppokharel.com.np/",
    location: "Madison, South Dakota",
  },
};

// ============================================================
//  DATA — Work Experience
// ============================================================
export const experience = [
  {
    role: "IT Support Desk Technician",
    org: "DSU Information Technology Services",
    orgLink: "https://support.dsu.edu/",
    period: "May 2026 to Present",
    location: "Madison, SD",
    type: "Part-time",
    bullets: [
      "Provide technical support for students and faculty, troubleshooting hardware, software, and network connectivity issues across university devices.",
      "Image, configure, and enroll workstations securely with FOG Project and Microsoft Intune.",
      "Administer Active Directory user accounts, set up multi-factor authentication (MFA), and reset passwords securely.",
    ],
    resumeBullets: [
      "Troubleshoot hardware, software, and network issues for students and faculty across university devices.",
      "Image and enroll workstations securely using FOG Project and Microsoft Intune device management.",
      "Administer Active Directory accounts, multi-factor authentication, and secure password resets.",
    ],
  },
  {
    role: "Multimedia Streaming Technician",
    org: "DSU Information Technology Services",
    orgLink: "https://support.dsu.edu/",
    period: "August 2026 to Present",
    location: "Madison, SD",
    type: "Part-time",
    bullets: [
      "Operate live broadcasts for DSU athletics and esports with vMix, OBS, Companion, and Stream Deck.",
      "Run video switching, audio mixing, cameras, graphics, and crew communications during each broadcast.",
      "Build reusable vMix and OBS scenes and Stream Deck layouts so each event takes less time to set up.",
      "Set up and troubleshoot cameras, cabling, capture, encoding, and streaming equipment before and during live events.",
    ],
    // Condensed to three single-line bullets so the PDF resume stays on one page.
    resumeBullets: [
      "Operate live vMix and OBS broadcasts for DSU athletics and esports, switching video and mixing audio live.",
      "Build reusable vMix scenes and Stream Deck layouts that cut event setup time and standardize production.",
      "Set up and troubleshoot cameras, cabling, capture cards, encoders, and streaming hardware during events.",
    ],
  },
];

// ============================================================
//  DATA — Education
// ============================================================
export const education = [
  {
    degree: "B.S. Cyber Operations",
    school: "Dakota State University",
    period: "Fall 2025 to Present",
    location: "Madison, SD",
    bullets: [
      "Pursuing a B.S. in Cyber Operations with a minor in Network Security Administration (4.0 GPA). Interests: DevOps, cloud, DevSecOps, security operations (SOC), AI, and network engineering.",
      "Relevant Coursework: Networking, Reverse Engineering, Malware Analysis, Routing and Switching, Windows and Linux Administration, Operating Environments",
    ],
  },
];

// ============================================================
//  DATA — Certifications & Courses (UNTOUCHED per user request)
// ============================================================
export const certifications = [
  // Removed certifications for now as requested.
];
