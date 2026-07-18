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
    items: ["Next.js 16", "React 19", "Vite", "Tailwind CSS", "GSAP", "Framer Motion", "Firebase (Auth + Firestore)", "Vercel"],
    highlight: ["Next.js 16", "React 19", "Firebase (Auth + Firestore)"],
  },
  {
    category: "AI & Data",
    icon: "🧠",
    items: ["Google Gemini API", "Transformers.js", "RAG Pipelines (HyDE)", "Vector Embeddings", "gray-matter", "Semantic Search"],
    highlight: ["Google Gemini API", "Transformers.js", "RAG Pipelines (HyDE)"],
  },
  {
    category: "IT Systems",
    icon: "🖥",
    items: ["WMI / CIM", "Active Directory", "Microsoft Intune MDM", "Remote Desktop", "WPF / XAML", "Device Imaging", "Windows OS"],
    highlight: ["WMI / CIM", "Active Directory", "Microsoft Intune MDM"],
  },
  {
    category: "Tools & Platforms",
    icon: "🔧",
    items: ["Git / GitHub", "VS Code", "SQLite", "Docker Hub", "Obsidian", "Vitest", "ESLint"],
    highlight: ["Git / GitHub", "Docker Hub"],
  },
];

export const about = {
  name: "Sandeep Pokharel",
  title: "IT Support Desk Technician",
  subtitle: "Computer Science · Dakota State University",
  bio: [
    "I am a Computer Science sophomore at Dakota State University, originally from Kathmandu, Nepal. I have a strong passion for problem-solving and building systems that improve operational efficiency.",
    "In my current role as an IT Support Desk Technician for DSU Information Technology Services, I provide front-line technical support — deploying hardware, troubleshooting connectivity, configuring operating systems, and ensuring students and faculty have reliable access to university resources.",
    "Outside of work, I enjoy building personal projects involving web development, cloud infrastructure, and AI integration. My projects section below showcases the tools and platforms I've built and deployed on my own time.",
  ],
  details: [
    { label: "Education", val: "B.S. Computer Science", sub: "Dakota State University · Fall 2025–Present" },
    { label: "Current Role", val: "IT Support Desk Technician", sub: "DSU Information Technology Services · May 2026–Present" },
    { label: "Location", val: "Madison, South Dakota", sub: "Originally from Kathmandu, Nepal" },
    { label: "Languages", val: "English · Nepali · Hindi", sub: "Trilingual" },
    { label: "Interests", val: "Web Development · Cloud · AI", sub: "Building and shipping personal projects" },
  ],
  tags: ["Problem Solver", "IT Support", "Self-Taught Builder", "Cloud Enthusiast", "Fast Learner", "Cross-Cultural Communicator"],
  contact: {
    email: "pokharelsandeep333@gmail.com",
    linkedin: "https://www.linkedin.com/in/sandeeppokharel333",
    github: "https://github.com/pokharelsandeep333-commits",
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
    period: "May 2026 – Present",
    location: "Madison, SD",
    type: "Part-time",
    bullets: [
      "Provide front-line technical support for students and faculty — hardware deployment, OS configuration, and network troubleshooting.",
      "Manage device enrollment through Microsoft Intune, maintain Active Directory accounts, and assist with remote desktop sessions.",
      "Troubleshoot connectivity issues, configure BIOS settings, and ensure reliable access to university IT resources.",
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
    period: "Fall 2025 – Present",
    location: "Madison, SD",
    bullets: [
      "Sophomore pursuing a B.S. in Computer Science with a minor in Mathematics, maintaining a 4.0 GPA.",
      "Relevant Coursework: Systems Analysis and Design, Statistics, Object-Oriented Programming"
    ],
  },
];

// ============================================================
//  DATA — Certifications & Courses (UNTOUCHED per user request)
// ============================================================
export const certifications = [
  {
    name: "CompTIA A+",
    issuer: "CompTIA",
    status: "in-progress",
    date: "Expected 2026",
    icon: "🏅",
    href: null,
  },
  {
    name: "Google IT Support",
    issuer: "Google / Coursera",
    status: "in-progress",
    date: "In Progress",
    icon: "🔧",
    href: null,
  },
  {
    name: "Hugging Face NLP Course",
    issuer: "Hugging Face",
    status: "in-progress",
    date: "In Progress",
    icon: "🤗",
    href: "https://huggingface.co/learn/nlp-course/",
  },
];
