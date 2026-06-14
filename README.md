# Personal Portfolio

> **Live Site:** [Insert Vercel Deployment Link Here]

A modern, highly interactive personal portfolio website engineered to showcase projects, skills, and professional experience. Built with a focus on performance and dynamic user experiences, the platform provides a responsive, mobile-first design tailored for technical hiring managers and recruiters.

## Tech Stack

- **Framework:** [React](https://react.dev/) – Component-based architecture for scalable UI.
- **Build Tool:** [Vite](https://vitejs.dev/) – Lightning-fast HMR and optimized production builds.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Custom Vanilla CSS – Utility-first CSS alongside custom design tokens and styles for complex UI states.
- **Animations:** [GSAP](https://gsap.com/) – Robust, performant scroll-based and micro-interactions.

## Key Features

- **Responsive Mobile-First Design:** Optimized layouts and components (such as a swipeable navigation menu) that seamlessly adapt from desktop down to mobile viewports.
- **Interactive UI Components:** Cinematic auto-playing video backgrounds, smooth scrolling navigation, custom modal overlays, and engaging hover states.
- **Secure Contact Form:** Integrated [Formspree](https://formspree.io/) endpoint, fully decoupled and secured via environment variables to prevent exposing sensitive URLs in the source code.

## Local Setup

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <your-repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file at the root of the project and add your Formspree URL:
   ```env
   VITE_FORMSPREE_URL=https://formspree.io/f/your_form_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **View the application:**
   Open your browser and navigate to the localhost URL provided in your terminal (typically `http://localhost:5173`).
