<h1 align="center">Personal Portfolio</h1>

<p align="center">
  <a href="https://portfolio-phi-pearl-16.vercel.app/" target="_blank">
    <strong>View Live Site »</strong>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<br />

## 📖 Overview

A modern, highly interactive personal portfolio website engineered to showcase projects, skills, and professional experience. Built with a focus on performance, premium aesthetics, and dynamic user experiences, the platform provides a responsive, mobile-first design tailored for technical hiring managers and recruiters.

## ✨ Featured Projects

This portfolio showcases five production-grade projects:

| Project | Stack | Description |
|---|---|---|
| **Molecular Zettelkasten** | Next.js 16, Gemini API, Firebase, Docker, AWS EC2 | AI-powered knowledge management platform with Semantic RAG, deployed via GitHub Actions CI/CD |
| **SandeepCloud** | AWS EC2, Docker Compose, Nginx, MariaDB, Cloudflare | Self-hosted Nextcloud cloud storage with enterprise-grade SSL and CDN |
| **DQA Automation Suite** | PowerShell 5.1, WPF/XAML, WMI/CIM, SQLite | Zero-prompt hardware QA tool iterated through 11 versions at DSU IT |
| **LLM-Wiki** | Python, Obsidian, AI Agents, Git | AI-agent-powered personal knowledge base with 125+ concept notes |
| **This Portfolio** | React 19, Vite 8, GSAP, Tailwind CSS, Docker | Cinematic hero, custom cursor, magnetic buttons, scroll animations |

## 🛠️ Tech Stack

### Frontend & UI
- **[React 19](https://react.dev/)** – Component-based architecture for scalable UI.
- **[Vite 8](https://vitejs.dev/)** – Lightning-fast HMR and optimized production builds.
- **[Tailwind CSS](https://tailwindcss.com/)** & Custom Vanilla CSS – Utility-first CSS alongside custom design tokens.
- **[GSAP](https://gsap.com/)** – Robust, performant scroll-based and micro-interactions.

### Testing & Analytics
- **[Vitest](https://vitest.dev/)** & **jsdom** – Fast unit testing framework.
- **[@vercel/analytics](https://vercel.com/analytics)** – Production web analytics.

### Deployment
- **[Docker](https://www.docker.com/)** – Multi-stage containerization (Alpine Node + Nginx).
- **[Vercel](https://vercel.com/)** – Primary hosting with edge CDN.

## 📁 Project Structure

```text
src/
├── assets/          # Static media (images, videos, fonts)
├── components/      # React functional components
│   ├── About.jsx
│   ├── Certifications.jsx
│   ├── Contact.jsx
│   ├── CustomCursor.jsx
│   ├── DQASimulator.jsx
│   ├── Experience.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── MagneticButton.jsx
│   ├── Navbar.jsx
│   ├── Projects.jsx
│   ├── ResumeView.jsx
│   └── Skills.jsx
├── data/            # Static datasets used in components
│   ├── projects.js
│   └── skills.js
├── test/            # Vitest testing setup
├── App.css          # App-specific styling
├── App.jsx          # Main application component routing & layout
├── index.css        # Global CSS variables, resets, and Tailwind directives
└── main.jsx         # Application entry point
```

## 🚀 Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 recommended)
- [Git](https://git-scm.com/)
- *Optional:* [Docker](https://www.docker.com/)

### 1. Clone the repository
```bash
git clone https://github.com/pokharelsandeep333-commits/Portfolio.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file at the root of the project and add your Formspree URL:
```env
VITE_FORMSPREE_URL=https://formspree.io/f/your_form_id
```

### 4. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

## 🧪 Testing

```bash
npm run test
```

## 🐳 Docker Deployment

```bash
# Build the Docker image
docker build -t portfolio-app .

# Run the container on port 8080
docker run -p 8080:80 -d portfolio-app
```

---
*Built with ❤️ and React.*
