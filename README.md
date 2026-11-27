<div align="center">

# 🖥️ Sandeep Pokharel | Personal Portfolio

I study Cyber Operations at Dakota State University and work there as an IT Support Desk Technician. I wrote a tool for the laptops we inspect at the help desk. My own laptop hosts this site.

<h3><a href="https://portfolio.sandeeppokharel.com.np/">View Live Site »</a></h3>

[![Portfolio CI](https://github.com/pokharelsandeep333-commits/Portfolio/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/pokharelsandeep333-commits/Portfolio/actions/workflows/deploy.yml)
![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Nginx-2496ED?logo=docker&logoColor=white)

</div>

## 🧭 Inside the portfolio

- In **Homelab → Backups**, select **Cloudflare R2**. My weekly backup lives on the same laptop as the VM. The nightly copy in R2 is the one I can restore if I lose the laptop. Select **Security events** to trace alerts through Wazuh.
- Ask **Digital Sandeep** “Why did you build ShiftSentry?” The assistant gets its project and experience details from the same files I edit for the site.
- Under **Resume**, choose **Download PDF** to save a one-page resume with selectable text. Each project has room for a full walkthrough on the site and a shorter description on the resume.

## 🧰 Selected projects

| Project | What I built |
| --- | --- |
| 🛡️ [ShiftSentry](https://github.com/pokharelsandeep333-commits/ShiftSentry) | I needed to know whether I could pick up another campus shift. ShiftSentry adds my scheduled hours to the hours I've worked and checks the total against my weekly cap. |
| 💻 [DQA Automation Suite](https://github.com/pokharelsandeep333-commits/DQA-Automation) | We used to type serial numbers, battery stats, and storage details by hand. My PowerShell and WPF tool reads them through WMI/CIM when a technician starts a laptop inspection. |
| 🔎 [Home SOC Lab](https://github.com/pokharelsandeep333-commits/wazuh-home-soc) | I write Wazuh detection rules for my servers and AWS account. The repo includes the test events I replay to check that the rules still catch what they should. |
| 📚 [Private RAG Search Engine](https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten) | I can ask a question about my Obsidian vault. The app searches local embeddings for relevant notes and sends those notes to Gemini with my question. |

## 🗺️ How a request reaches the site

```mermaid
flowchart LR
    browser["Visitor's browser"]
    browser -->|Page and assets| tunnel["Cloudflare Tunnel"]
    tunnel --> web["Nginx on SandeepCloud"]
    web -->|POST /api/chat| chat["Portfolio Node API"]
    chat -->|Limits and budgets| redis["Private Redis"]
    chat -->|Generate reply| gemini["Google Gemini"]
```

Vite builds the React site into static files. Nginx serves them from a Docker container on my Ubuntu Hyper-V VM. On desktop, the opening video plays silently and pauses when you scroll past it. Phones download a WebP portrait instead.

The Node API runs beside the static site on SandeepCloud. Nginx supplies the visitor address. Private Redis admits 10 requests per rolling minute per IP and counts Gemini attempts against daily budgets. If Redis is unavailable, the API returns 503 and the static site still works. Published project overviews and selected starter questions can be answered from portfolio data. Other questions send up to 16 recent messages to Gemini with an 800-token output cap.

The API tries Gemini 4 Hydrogen first. Transient errors can fall back to 3.8 Flash, 3.6 Flash, and 3.5 Flash Lite within a 35-second deadline. Each attempt uses the Interactions API with storage disabled. [Model calls](server/gemini.js) · [HTTP and fallback tests](server/chat.test.js)

## 🚀 Run locally

Use a current Node.js 22 LTS release and npm. The portfolio, homelab map, and printable resume run locally without service credentials.

```sh
git clone https://github.com/pokharelsandeep333-commits/Portfolio.git
cd Portfolio
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). For chat, also start a private Redis instance and run `npm run dev:api` in a second terminal. Vite proxies `/api/chat` to port 3001. The API reads the ignored `.env.chat` file locally.

| Variable | Where it belongs | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | API runtime | Portfolio-specific Gemini key. |
| `REDIS_URL` | API runtime | Defaults to local Redis on port 6379. Compose supplies the private Redis service address. |
| `CHAT_DAILY_PER_IP`, `CHAT_DAILY_TOTAL` | API runtime, optional | Gemini attempts per UTC day. Defaults are 30 per visitor IP and 300 overall. |
| `VITE_FORMSPREE_URL` | Frontend build | Public contact form endpoint. |

## 🔄 Checks and deployment

```sh
npm run lint
npm test
npm run build
```

Pull requests run ESLint, a production dependency audit, Gitleaks, and Vitest. On `main`, GitHub Actions builds the Nginx and Node images, runs a report-only Trivy scan on each, and pushes both images to Docker Hub. Watchtower on SandeepCloud checks for an update every five minutes. [Release workflow](.github/workflows/deploy.yml) · [Weekly image scan](.github/workflows/scan-published-image.yml)

## 📁 Where to make a change

| To change | Start here |
| --- | --- |
| Bio, experience, education, or skills | [Profile data](src/data/skills.js) |
| Project cards, resume descriptions, or the project facts available to chat | [Project data](src/data/projects.js) |
| Homelab services and routes | [Map data](src/data/homelab.js) · [Map design notes](docs/homelab-map.md) |
| Resume layout or print styles | [Resume view](src/components/ResumeView.jsx) · [Stylesheet](src/index.css) |
| Chat behavior or model order | [Chat API](server/app.js) · [Hosting decision](docs/adr/0002-sandeepcloud-chat.md) |
