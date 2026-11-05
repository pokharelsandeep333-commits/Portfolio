// Public architecture snapshot, cross-checked against the owning repositories
// and Obsidian project notes on 2026-11-04. Provenance: docs/homelab-map.md.
// Intentionally contains no private addresses, management URLs or credentials.
const iac = 'https://github.com/pokharelsandeep333-commits/SandeepCloud-IAC'
const soc = 'https://github.com/pokharelsandeep333-commits/wazuh-home-soc'

export const homelab = {
  heading: 'A small laptop.',
  headingAccent: 'A whole lot running.',
  intro: 'The infrastructure behind my projects, from the public web to my private home SOC. Pick a route, then select a service to see how it fits.',
  date: 'November 2026',
  host: 'One physical homelab laptop',
  caveat: 'Architecture snapshot, not a live status dashboard. Moving lines illustrate traffic direction.',
  boundary: 'Separate environments, shared hardware. R2 is the backup copy outside this laptop.',
  instruction: 'Select any service to explore it.',
}

export const labNodes = {
  cloudflare: {
    name: 'Cloudflare', caption: 'Public HTTPS + tunnel', icon: 'cloud', location: 'Outside the homelab',
    description: 'Visitors reach my public sites through Cloudflare. Inside the VM, cloudflared opens an outbound tunnel and carries requests to Nginx.',
    decision: 'The VM needs no public IP or inbound router port forwarding. Public web traffic and private administration follow different paths.',
    facts: ['DNS and tunnel configuration are managed in Terraform.', 'Nginx routes each hostname to its application.'],
    links: [{ label: 'Read the infrastructure code', href: iac + '/tree/main/envs/cloudflare' }],
  },
  tailscale: {
    name: 'Tailscale', caption: 'Private administration', icon: 'network', location: 'Private device network',
    description: 'My own devices reach the VM and management dashboards over Tailscale. SSH uses the private network, and dashboard access stays separate from the public websites.',
    decision: 'A public portfolio does not need a public management console. Tailscale provides a separate access path governed by the tailnet policy.',
    facts: ['Private HTTPS routes serve Wazuh, Beszel, Portainer, and Jellyfin.', 'The public Cloudflare tunnel serves the websites, not these dashboards.'],
    links: [{ label: 'Read the network design', href: soc }],
  },
  vm: {
    name: 'SandeepCloud', caption: 'Ubuntu VM / Hyper-V', icon: 'server', location: 'Homelab laptop / Hyper-V',
    description: 'A separate Ubuntu VM runs my public applications in Docker. I moved it from AWS to the homelab in October 2026 using cloud-init, an encrypted backup, and a Cloudflare Tunnel.',
    decision: 'Public applications run in their own VM, separate from the WSL security stack.',
    facts: ['Nginx fronts Nextcloud, Portfolio, ShiftSentry, and the RAG app.', 'A restore drill checked the rebuilt services before the DNS cutover.'],
    links: [{ label: 'See how the VM is built', href: iac + '/tree/main/server/homelab/hyperv' }],
  },
  nextcloud: {
    name: 'Nextcloud', caption: 'Files + sync', icon: 'files', location: 'SandeepCloud VM / Docker',
    description: 'My self-hosted cloud drive keeps files in sync between my laptop and phone. Nextcloud runs with MariaDB and Redis behind Nginx.',
    decision: 'I manage the storage and user accounts myself. Database dumps and files are included in the VM backup workflow.',
    facts: ['Public HTTPS arrives through the Cloudflare Tunnel.', 'The app and its data moved from EC2 to the Hyper-V VM.'],
    links: [{ label: 'Visit SandeepCloud', href: 'https://sandeeppokharel.com.np/' }],
  },
  portfolio: {
    name: 'Portfolio', caption: 'The site you are on', icon: 'code', location: 'SandeepCloud VM / Docker',
    description: 'Nginx serves this React site as a static Docker image. Its Digital Sandeep chat backend runs separately as a Vercel function.',
    decision: 'The frontend stays small and static. The Vercel function keeps the Gemini API key server-side and rate-limits chat requests with Upstash Redis.',
    facts: ['GitHub Actions builds the frontend image after its quality gates.', 'Watchtower pulls published images into the VM.'],
    links: [{ label: 'View the portfolio source', href: 'https://github.com/pokharelsandeep333-commits/Portfolio' }],
  },
  shiftsentry: {
    name: 'ShiftSentry', caption: 'Shifts + earnings', icon: 'clock', location: 'SandeepCloud VM / Docker',
    description: 'My shift tracker projects weekly hours across campus jobs and tracks earnings. The Next.js application runs in Docker and uses Supabase for authentication and Postgres data.',
    decision: 'Supabase Row Level Security keeps each account\'s records separate. The application is self-hosted; its database and authentication are external services.',
    facts: ['Public requests use the same Cloudflare and Nginx route.', 'The app also installs as a PWA or Android TWA.'],
    links: [{ label: 'Explore ShiftSentry', href: 'https://sentry.sandeeppokharel.com.np/' }],
  },
  rag: {
    name: 'Private RAG', caption: 'Search my own notes', icon: 'search', location: 'SandeepCloud VM / Docker',
    description: 'The knowledge app searches my Obsidian notes with local vector embeddings, then supplies the matching text to Gemini to ground its answers.',
    decision: 'Retrieval runs in the application process without a separate vector database. Firebase handles sign-in and chat synchronization.',
    facts: ['Transformers.js embeds queries locally on the server.', 'The application moved to the VM with SandeepCloud.'],
    links: [{ label: 'Read the RAG implementation', href: 'https://github.com/pokharelsandeep333-commits/Molecular-Zettelkasten' }],
  },
  watchtower: {
    name: 'Watchtower', caption: 'Image delivery', icon: 'package', location: 'SandeepCloud VM / Docker',
    description: 'After a project\'s CI checks pass, GitHub Actions publishes its Docker image. Watchtower checks the registry every five minutes and updates the configured containers.',
    decision: 'The same delivery path survived the move from AWS to Hyper-V. Publishing an image does not require opening public SSH access.',
    facts: ['GitHub Actions builds and pushes to Docker Hub.', 'Application data lives outside the replaceable container image.'],
    links: [{ label: 'Read the deployment setup', href: iac + '/tree/main/server' }],
  },
  kuma: {
    name: 'Uptime Kuma', caption: 'Service checks + heartbeat', icon: 'chart', location: 'SandeepCloud VM / Docker',
    description: 'Uptime Kuma checks services and receives a heartbeat from the Wazuh watcher. Its dashboard is reached through the private network.',
    decision: 'It catches service-level failures across the apps, and the watcher heartbeat confirms the SOC is still reporting.',
    facts: ['The watcher checks the SOC and reports its health to Kuma.'],
    links: [{ label: 'Read the service configuration', href: iac + '/tree/main/server' }],
  },
  wazuh: {
    name: 'Wazuh', caption: 'Security events', icon: 'shield', location: 'Homelab laptop / WSL / Docker',
    description: 'The Wazuh manager, indexer, and dashboard run in WSL. Agents report security events from Windows and the SandeepCloud VM, and the manager reads AWS CloudTrail logs.',
    decision: 'Security analysis runs outside the public application VM. I write and test custom detections, investigate noisy rules, and route high-severity alerts to Discord.',
    facts: ['File integrity and Docker events help explain changes on the hosts.', 'The public repository contains sanitized rules and replay tests.'],
    links: [{ label: 'Explore my detections', href: soc }],
  },
  beszel: {
    name: 'Beszel', caption: 'Resource history', icon: 'chart', location: 'Homelab laptop / WSL / Docker',
    description: 'One private dashboard collects resource history for homelab Windows, WSL, the SandeepCloud VM, and my Dell laptop.',
    decision: 'Resource history helps me compare workloads before changing limits. Linux agents use a filtered statistics gateway instead of receiving direct Docker socket access.',
    facts: ['Windows and WSL remain separate monitored environments.', 'The VM agent is reached over the private Tailscale network.'], links: [],
  },
  portainer: {
    name: 'Portainer', caption: 'Container management', icon: 'containers', location: 'Homelab laptop / WSL / Docker',
    description: 'Portainer provides a private web interface for managing the WSL Docker environment.',
    decision: 'Container management is powerful access. The backend binds to loopback and is reached through private Tailscale HTTPS, not the public tunnel.',
    facts: ['It manages the WSL environment, not every machine on the diagram.', 'Authentication is still required on the private route.'], links: [],
  },
  calendar: {
    name: 'Home Hub', caption: 'Calendar feed to Roku', icon: 'calendar', location: 'Homelab laptop / WSL / Docker',
    description: 'A small calendar feed turns my calendar into an agenda for a custom Roku clock and screensaver. The Roku gets weather separately from Open-Meteo.',
    decision: 'The private calendar address stays on the homelab. The Roku receives the prepared agenda and rolls forward to tomorrow when today is finished.',
    facts: ['The feed runs in Docker; the TV interface runs on the Roku.', 'The app and idle screensaver were checked on the device.'], links: [],
  },
  rest: {
    name: 'rest-server', caption: 'Weekly local backup', icon: 'database', location: 'Homelab laptop / WSL / Docker',
    description: 'An append-only restic rest-server receives a weekly encrypted backup from the SandeepCloud VM over Tailscale.',
    decision: 'Append-only access protects existing snapshots from the backup client.',
    facts: ['Nightly R2 backups provide the separate, off-device copy.'],
    links: [{ label: 'Read the backup design', href: iac + '/tree/main/server/backup' }],
  },
  jellyfin: {
    name: 'Jellyfin', caption: 'Native Windows media server', icon: 'play', location: 'Homelab laptop / native Windows',
    description: 'Jellyfin runs directly on Windows. My Dell, Roku, and iPhone use it for the media I add to its libraries, including Finamp music streaming and downloads.',
    decision: 'It stays outside Docker and WSL. The Roku uses a restricted LAN path; my own devices can use private Tailscale HTTPS.',
    facts: ['Initial music and sample-video playback were verified.'], links: [],
  },
  windows: {
    name: 'Windows host', caption: 'Wazuh + Beszel agents', icon: 'server', location: 'Physical homelab laptop / Windows 11',
    description: 'Windows is the physical host for Hyper-V, WSL, and native Jellyfin. Its Wazuh agent reports host security events, and its Beszel agent reports resource measurements.',
    decision: 'Hyper-V and WSL keep the public applications and the security stack in separate environments on the same machine.',
    facts: ['Wazuh monitors Windows host activity, not a separate Jellyfin agent.'], links: [],
  },
  r2: {
    name: 'Cloudflare R2', caption: 'Nightly off-device backup', icon: 'database', location: 'Outside the homelab',
    description: 'Restic encrypts the VM backup before sending it to R2 each night. This repository lives outside the laptop and its home network.',
    decision: 'The local backup and the VM share hardware. R2 is the copy that survives loss of that laptop. Cloudflare Terraform state is stored separately in R2.',
    facts: ['The migration included a restore drill before moving the sites.'],
    links: [{ label: 'Read the restore workflow', href: iac + '/tree/main/server/backup' }],
  },
  cloudtrail: {
    name: 'AWS CloudTrail', caption: 'Account audit logs', icon: 'files', location: 'AWS account baseline',
    description: 'The EC2 application servers were retired in October 2026. The account baseline retained CloudTrail and its log bucket, which Wazuh reads for AWS activity.',
    decision: 'An AWS account can still need monitoring after its compute is gone. CloudTrail supplies audit events, not application hosting.',
    facts: ['Custom rules cover root logins, IAM changes, and trail tampering.'],
    links: [{ label: 'Read the account baseline', href: iac + '/tree/main/envs/prod' }],
  },
  discord: {
    name: 'Discord', caption: 'Security notifications', icon: 'message', location: 'Private notification channel',
    description: 'High-severity Wazuh alerts land in a private Discord channel for investigation. A separate watcher checks the SOC and sends health notifications.',
    decision: 'Notifications are useful when they lead to a specific investigation. The triage playbook explains what each custom alert means and what to check next.',
    facts: ['Discord is an alert destination, not a public dashboard.'],
    links: [{ label: 'Read the SOC documentation', href: soc }],
  },
}

export const labRoutes = [
  { id: 'web', label: 'Web requests', icon: 'globe', color: '#FFC72C', selected: 'vm',
    summary: 'A request reaches the apps through an outbound tunnel.',
    steps: ['Visitor', 'Cloudflare', 'Tunnel + Nginx', 'Application'],
    nodes: ['cloudflare', 'vm', 'nextcloud', 'portfolio', 'shiftsentry', 'rag'],
    edges: [['cloudflare', 'vm']],
    note: 'Cloudflared establishes the connection from inside the VM. Requests return through it; no public inbound ports are needed.' },
  { id: 'private', label: 'Private access', icon: 'network', color: '#94BDFF', selected: 'tailscale',
    summary: 'My own devices take a separate route to management tools.',
    steps: ['My devices', 'Tailscale', 'SSH + private HTTPS'],
    nodes: ['tailscale', 'vm', 'wazuh', 'beszel', 'portainer', 'jellyfin', 'kuma'],
    edges: [['tailscale', 'vm'], ['tailscale', 'portainer'], ['tailscale', 'jellyfin']],
    note: 'Tailscale controls the network path. Service authentication and the tailnet access policy still apply.' },
  { id: 'security', label: 'Security events', icon: 'shield', color: '#74D6BC', selected: 'wazuh',
    summary: 'Host and account activity becomes something I can investigate.',
    steps: ['Windows / VM / AWS', 'Wazuh', 'Discord'],
    nodes: ['vm', 'windows', 'cloudtrail', 'wazuh', 'discord'],
    edges: [['vm', 'wazuh'], ['windows', 'wazuh'], ['cloudtrail', 'wazuh'], ['wazuh', 'discord']],
    note: 'Agents send host events; Wazuh reads CloudTrail and sends high-severity alerts to Discord. Beszel tracks resources separately.' },
  { id: 'backups', label: 'Backups', icon: 'database', color: '#C3AAFF', selected: 'r2',
    summary: 'Encrypted snapshots go to two destinations, on different schedules.',
    steps: ['SandeepCloud VM', 'restic encryption', 'R2 nightly / local weekly'],
    nodes: ['vm', 'rest', 'r2'], edges: [['vm', 'rest'], ['vm', 'r2']],
    note: 'R2 holds the off-device copy. The weekly local copy goes to the homelab over Tailscale.' },
]

export const labGroups = {
  apps: ['nextcloud', 'portfolio', 'shiftsentry', 'rag', 'watchtower', 'kuma'],
  wsl: ['wazuh', 'beszel', 'portainer', 'calendar', 'rest'],
  external: ['r2', 'cloudtrail', 'discord'],
}

export const labDelivery = {
  title: 'From commit to container',
  steps: ['GitHub Actions', 'Docker Hub', 'Watchtower'],
  description: 'Quality gates pass. An image is published. The VM checks for updates every five minutes.',
}
