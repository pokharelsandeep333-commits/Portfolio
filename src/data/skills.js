// ============================================================
//  DATA — Skills
// ============================================================

export const skills = [
  {
    category: "Languages",
    icon: "⌨",
    items: ["PowerShell", "Python", "Java", "C", "C++", "HTML", "CSS", "SQL"],
    highlight: ["PowerShell", "Python"],
  },
  {
    category: "IT & Systems",
    icon: "🖥",
    items: ["WMI / CIM", "Active Directory", "MDM Enrollment", "TDNext API", "Remote Desktop", "Device Imaging", "Windows OS"],
    highlight: ["WMI / CIM", "Active Directory"],
  },
  {
    category: "Tools & Platforms",
    icon: "🔧",
    items: ["Git / GitHub", "SQLite", "VS Code", "Linux CLI", "WPF GUI", "PSSQLite"],
    highlight: ["Git / GitHub", "SQLite"],
  },
  {
    category: "ML / AI (Learning)",
    icon: "🧠",
    items: ["NumPy", "pandas", "scikit-learn", "Jupyter", "HuggingFace"],
    highlight: [],
  },
];

export const about = {
  name: "Sandeep Pokharel",
  title: "IT Support Desk Technician",
  subtitle: "Computer Science · Dakota State University",
  bio: [
    "I am a Computer Science sophomore at Dakota State University, originally from Kathmandu, Nepal. I have a strong passion for problem-solving and building systems that improve operational efficiency.",
    "In my current role as an IT Support Desk Technician for DSU Information Technology Services, I manage front-line technical support — deploying hardware, troubleshooting network connectivity, configuring operating systems, and ensuring students and faculty have reliable access to university resources.",
    "Beyond the helpdesk, I am expanding my knowledge in Software Engineering, exploring Machine Learning fundamentals, and working toward industry certifications like CompTIA A+.",
  ],
  details: [
    { label: "Education", val: "B.S. Computer Science", sub: "Dakota State University · Fall 2025–Present" },
    { label: "Current Role", val: "IT Support Desk Technician", sub: "DSU Information Technology Services · May 2026–Present" },
    { label: "Location", val: "Madison, South Dakota", sub: "Originally from Kathmandu, Nepal" },
    { label: "Languages", val: "English · Nepali · Hindi", sub: "Trilingual" },
    { label: "Interests", val: "Software Engineering · ML/AI", sub: "Cybersecurity · IT Automation · Aim to be a Full Stack Developer" },
  ],
  tags: ["Problem solver", "IT Automation", "Hardware Diagnostics", "Cross-cultural communicator", "Fast learner"],
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
      "Front-line technical support for students and faculty — hardware deployment, OS configuration, and network troubleshooting.",
      "Developed the DQA Automation Suite (PowerShell / WPF) to streamline device quality-assurance inspections, eliminating repetitive manual steps for technicians.",
      "Manage MDM enrollment, Active Directory accounts, and remote desktop sessions across university devices.",
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
    note: "Focus: Software Engineering · Cybersecurity · ML/AI",
  },
];

// ============================================================
//  DATA — Certifications & Courses
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
