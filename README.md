<h1 align="center">Personal Portfolio</h1>

<p align="center">
  <a href="https://portfolio-phi-pearl-16.vercel.app/" target="_blank">
    <strong>View Live Site »</strong>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

<br />

## 📖 Overview

A modern, highly interactive personal portfolio website engineered to showcase projects, skills, and professional experience. Built with a focus on performance, premium aesthetics, and dynamic user experiences, the platform provides a responsive, mobile-first design tailored for technical hiring managers and recruiters.

This project embodies a "premium feel" by utilizing advanced frontend techniques including cinematic auto-playing video backgrounds, custom magnetic UI components, and fluid scroll-based animations.

## ✨ Key Features

- **Cinematic Hero Section:** Engaging video backgrounds and modern typography setup using custom CSS tokens.
- **Custom UI Interactions:** Includes a globally available `CustomCursor` and smooth `MagneticButton`s that react to user mouse movements.
- **Advanced Animations:** Robust, performant scroll-based and micro-interactions powered by `GSAP` and `@gsap/react`.
- **Interactive Tools:** Contains dynamic components such as a `DQASimulator` and a specialized `ResumeView`.
- **Responsive Mobile-First Design:** Optimized layouts (like a swipeable navigation menu) that seamlessly adapt from desktop down to mobile viewports.
- **Secure Contact Form:** Integrated [Formspree](https://formspree.io/) endpoint, fully decoupled and secured via environment variables.

## 🛠️ Tech Stack

### Frontend & UI
- **[React 19](https://react.dev/)** – Component-based architecture for scalable UI.
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** – Utility-first CSS framework for rapid styling.
- **Vanilla CSS** – Custom design tokens for complex UI states located in `index.css`.

### Animation & Motion
- **[GSAP](https://gsap.com/) & [@gsap/react](https://www.npmjs.com/package/@gsap/react)** – Industry-standard animation library for intricate UI motion.

### Build & Tooling
- **[Vite 8](https://vitejs.dev/)** – Lightning-fast HMR and optimized production builds.
- **[ESLint](https://eslint.org/)** – Strict linting rules for React hooks and code quality.

### Testing & Analytics
- **[Vitest](https://vitest.dev/)** & **jsdom** – Fast unit testing framework.
- **[@vercel/analytics](https://vercel.com/analytics)** – Production web analytics tracking.

### Deployment & DevOps
- **[Docker](https://www.docker.com/)** – Multi-stage containerization using Alpine Node and Nginx.

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

To run this project locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 recommended)
- [Git](https://git-scm.com/)
- *Optional:* [Docker](https://www.docker.com/)

### 1. Clone the repository
```bash
git clone <your-repository-url>
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

This project uses Vitest. To run the test suite:
```bash
npm run test
```

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` to build and serve the production app using Nginx.

```bash
# Build the Docker image
docker build -t portfolio-app .

# Run the container on port 8080
docker run -p 8080:80 -d portfolio-app
```
Then navigate to `http://localhost:8080` in your browser.

---
*Built with ❤️ and React.*
