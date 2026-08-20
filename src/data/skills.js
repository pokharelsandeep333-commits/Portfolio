// ============================================================
//  DATA — Skills
//  Sourced from actual project usage across Molecular
//  Zettelkasten, SandeepCloud, DQA Suite, LLM-Wiki, and
//  Portfolio. No "learning" labels — these are all used skills.
// ============================================================

export const skills = [
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
    items: ["Next.js 16", "React 19", "Node.js", "Vite", "Tailwind CSS", "GSAP", "Framer Motion", "Firebase (Auth + Firestore)", "Supabase", "MySQL", "PostgreSQL", "Redis", "Vercel"],
    highlight: ["Next.js 16", "React 19", "Firebase (Auth + Firestore)"],
  },
  {
    category: "AI & Data",
    icon: "🧠",
    items: ["Google Gemini API", "Transformers.js", "Hugging Face", "Ollama", "VLLM", "Hermes Agent", "Open WebUI", "n8n", "Streamlit", "RAG Pipelines (HyDE)", "Vector Embeddings", "gray-matter", "Semantic Search"],
    highlight: ["Google Gemini API", "Transformers.js", "RAG Pipelines (HyDE)"],
  },
  {
    category: "IT Systems",
    icon: "🖥",
    items: ["WMI / CIM", "Active Directory", "Microsoft Intune MDM", "Remote Desktop", "WPF / XAML", "FOG Project", "Windows OS"],
    highlight: ["WMI / CIM", "Active Directory", "Microsoft Intune MDM"],
  },
  {
    category: "Tools & Platforms",
    icon: "🔧",
    items: ["Git / GitHub", "VS Code", "SQLite", "Docker Hub", "Obsidian", "Vitest", "ESLint", "Postman", "Google Stitch", "AdGuard Home", "Raspberry Pi", "Tailscale", "Proxmox"],
    highlight: ["Git / GitHub", "Docker Hub"],
  },
];

// ============================================================
//  DATA — Resume-only Skills (6 strict 1-line categories)
//  Used exclusively by ResumeView.jsx.
// ============================================================
export const resumeSkills = [
  {
    category: "Languages",
    items: ["JavaScript / TypeScript", "PowerShell", "Python", "Java", "C/C++", "SQL", "HTML / CSS"],
  },
  {
    category: "Tools",
    items: ["Git / GitHub", "Docker", "Vitest", "Obsidian", "Tailscale", "AdGuard Home", "Proxmox"],
  },
  {
    category: "Lib & Frameworks",
    items: ["Next.js", "React", "Node.js", "Vite", "Tailwind CSS", "GSAP"],
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
    category: "IT Systems",
    items: ["Active Directory", "Microsoft Intune", "Remote Desktop", "Device Imaging", "MFA"],
  },
];

export const about = {
  name: "Sandeep Pokharel",
  title: "IT Support Desk Technician",
  subtitle: "Computer Science · Dakota State University",
  bio: [
    "Computer Science sophomore at Dakota State University, originally from Kathmandu, Nepal. I like building things that work and figuring out why things break.",
    "My day job is IT Support at DSU \u2014 deploying hardware, troubleshooting networks, managing Intune enrollment, and making sure students and faculty can actually get work done. It's hands-on, fast-paced, and I learn something new every shift.",
    "After hours, I build my own infrastructure. Self-hosted cloud storage on AWS, an AI platform that talks to my personal notes, automation tools for the helpdesk \u2014 all containerized, all deployed on servers I manage. The projects section below has the details.",
  ],
  details: [
    { label: "Education", val: "B.S. Computer Science", sub: "Dakota State University · Fall 2025 to Present" },
    { label: "Current Role", val: "IT Support Desk Technician", sub: "DSU Information Technology Services · May 2026 to Present" },
    { label: "Location", val: "Madison, South Dakota", sub: "Originally from Kathmandu, Nepal" },
    { label: "Languages", val: "English · Nepali · Hindi", sub: "Trilingual" },
    { label: "Interests", val: "Web Development · Cloud · AI", sub: "Building and shipping personal projects" },
  ],
  tags: ["Problem Solver", "IT Support", "Self-Taught Builder", "Cloud Enthusiast", "Fast Learner", "Cross-Cultural Communicator"],
  contact: {
    email: "pokharelsandeep333@gmail.com",
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
      "Manage device imaging workflows using FOG Project and Microsoft Intune to securely configure and enroll workstations.",
      "Administer Active Directory user accounts, configuring multi-factor authentication (MFA) and performing secure password resets.",
    ],
  },
];

// ============================================================
//  DATA — Education
// ============================================================
export const education = [
  {
    degree: "B.S. Computer Science",
    school: "Dakota State University",
    period: "Fall 2025 to Present",
    location: "Madison, SD",
    bullets: [
      "Pursuing a B.S. in Computer Science with a minor in Mathematics (4.0 GPA), focusing on cloud infrastructure and AI.",
      "Relevant Coursework: Software Engineering, Artificial Intelligence, Data Structures, OOP, Systems Analysis & Design, Calculus",
    ],
  },
];

// ============================================================
//  DATA — Certifications & Courses (UNTOUCHED per user request)
// ============================================================
export const certifications = [
  // Removed certifications for now as requested.
];
