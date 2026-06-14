// ============================================================
//  DATA — Projects
//  DQA description condensed to 4 punchy bullets (v10.0 script)
// ============================================================

export const projects = [
  {
    title: "DQA Automation Suite",
    status: "Production",
    badge: "badge-production",
    highlights: [
      "Zero-prompt hardware auto-detection: serial number and battery status pulled from BIOS on technician email entry — no manual input at any step.",
      "Non-blocking audio pipeline: records, plays back, and prompts the technician without freezing the WPF UI thread (async DispatcherTimer + C# COM interop).",
      "Self-modifying persistence engine: inspection records written directly into the .ps1 script — fully portable, zero external database or installer required.",
      "Smart CSV export: strips internal-only columns, auto-detects USB drives, and falls back to Desktop — all in one click.",
    ],
    stack: ["PowerShell 5.1", "WPF / XAML", "C# COM Interop", "Core Audio API", "WMI / CIM", "MCI Audio", "Windows Forms"],
    github: "https://github.com/pokharelsandeep333-commits/DQA-Automation.git",
    demo: null,
    // Condensed ATS-resume bullets — 2 high-impact points only
    resumeHighlights: [
      "Zero-prompt hardware auto-detection: serial number pulled from BIOS via Win32_BIOS and charging status via Win32_Battery, triggered automatically on technician email entry — no manual input required.",
      "CSV export strictly excludes 'Id', 'Start Date', and 'Status' columns; auto-detects connected USB drives and routes output there, falling back to Desktop.",
    ],
  },
  {
    title: "IT Helpdesk Ticket Classifier",
    status: "In Progress",
    badge: "badge-progress",
    description:
      "A machine learning text classifier that auto-categorizes IT support tickets by issue type — password resets, hardware failures, network issues, and software problems. Uses TF-IDF baseline and DistilBERT fine-tuning. Features a Streamlit demo UI deployed on Hugging Face Spaces.",
    stack: ["Python", "scikit-learn", "HuggingFace", "DistilBERT", "Streamlit", "pandas"],
    github: null,
    demo: null,
  },
  {
    title: "Network Scanner CLI Tool",
    status: "Planned",
    badge: "badge-planned",
    description:
      "A command-line tool that scans a local network, lists all active devices, checks open ports, and flags connectivity issues. Outputs color-coded results using the Rich library.",
    stack: ["Python", "socket", "argparse", "Rich", "subprocess"],
    github: null,
    demo: null,
  },
];
