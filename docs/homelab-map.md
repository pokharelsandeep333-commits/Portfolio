# Interactive homelab map

The portfolio's web-only map explains a curated architecture snapshot. It does not contact the homelab, probe private services, or report live telemetry. Animation illustrates the direction of the selected route.

## Owning files

- `src/data/homelab.js`: sanitized service descriptions, routes, edges, and public evidence links. No Node-incompatible imports or browser globals.
- `src/components/HomelabMap.jsx`: native service/route buttons, selected-service inspector, and measured SVG connections.
- `src/components/HomelabMap.css`: existing navy/gold visual system, responsive container queries, visible focus, and a print exclusion.
- `src/App.jsx`: lazy-loaded section immediately before Projects, after Skills, as requested. No graph package or other dependency was added.
- `src/components/Navbar.jsx`: Homelab entry in the existing navigation pill.

## Architecture evidence

Cross-checked November 4, 2026 using the user's local sibling projects and their Obsidian notes. These are provenance pointers for maintainers, not browser imports. Private source notes must never be copied into the client bundle.

| Public explanation | Evidence inspected |
| --- | --- |
| SandeepCloud runs in a separate Hyper-V Ubuntu VM; EC2 servers retired; public tunnel and private Tailscale paths | `SandeepCloud-IAC/README.md`, `CLAUDE.md`, `server/homelab/hyperv/README.md`, and `envs/cloudflare/tunnel.tf`; vault `Raw/Files/SandeepCloud IaC/00 IaC - Project Hub.md` and `05 IaC - Task Board.md` |
| Nginx fronts Nextcloud, Portfolio, ShiftSentry, and the RAG app; Watchtower image delivery; Kuma in VM | IaC README architecture and portfolio `.github/workflows/deploy.yml`; existing project data |
| Portfolio AI backend remains a separate Vercel function | `docs/adr/0001-vercel-serverless-for-ai-agent.md` and portfolio AGENTS.md; the ADR's EC2 wording describes the former frontend host |
| WSL hosts Wazuh, Beszel, Portainer, calendar feed, and rest-server; native Windows agents and Jellyfin | `Homelab/CLAUDE.md`, `docs/architecture-review-2026-11-03.md`; vault `Raw/Files/Homelab projects/00 Homelab - Project Hub.md` |
| Beszel reports Windows, WSL, VM, and Dell separately; Linux agents use filtered statistics gateways | Vault `Raw/Files/Homelab projects/Beszel/00 Beszel - Project Hub.md`, including its November 1 Dell update |
| Jellyfin is native Windows; Roku uses restricted LAN; own devices use private Tailscale HTTPS | Vault `Raw/Files/Homelab projects/Jellyfin/00 Jellyfin - Project Hub.md` and Homelab working guide |
| Calendar feed is in WSL; Roku screensaver is on-device; weather fetched separately | Vault `Raw/Files/Homelab projects/Roku TV/02 Home Hub - Runbook.md`, including the 0.7.0 idle screensaver verification |
| VM restic backups: nightly R2 and weekly append-only local rest-server; local copy shares the host | IaC hub/task board and Homelab architecture review; the VM restore drill is not evidence that every homelab service has a verified restore |
| AWS baseline CloudTrail supplies audit events; it is not a running EC2 host | IaC hub/task board and current README architecture; old diagram's EC2 servers are historical |

## Boundaries

The map omits private IPv4/IPv6 addresses, tailnet names, management endpoints, ports, account IDs, credentials, actual calendar data, and secret-bearing configuration. Only already-public application and repository links are included.

The four routes are deliberately selected explanations rather than an exhaustive network inventory. Services inside the host box share physical hardware. Native Windows events originate at the Windows host, not a fictional Jellyfin Wazuh agent. Wazuh supplies security monitoring; Beszel supplies resource history. Kuma shares the host's outage risk. R2 is the off-device VM backup.

GuardDuty, AWS Config, Authentik, Semaphore, Velociraptor, GPU acceleration, full reboot recovery, and full homelab backup coverage are not presented as completed features. The retired Ad-Blocker is not shown as running.

The remainder of the existing portfolio project copy still contains older AWS descriptions. This feature does not rewrite that independent content or the resume. When refreshing the project descriptions, verify them against their owning projects and update both web and resume variants together.

## Verification

Tests cover every selectable service, route selection, the flow pause control, and absence of private address/management URLs in the public data. Browser checks cover responsive layouts, directional geometry, service inspector updates, keyboard interaction, chat-width reflow, and console errors. Print CSS explicitly excludes the map, and the pre-existing resume subtree/content is unchanged.

The design detector's Inter warning is accepted: Inter is the established portfolio body font, explicitly preserved for this extension.

## Styling

The section uses the site's shared header (`.section-divider`, `.section-label`, `.section-heading`) and the same type scale as the other sections: Outfit for titles, Inter at 14px for body copy, nothing below 12px, and neutral white-alpha greys (the `--lab-*` tokens at the top of `HomelabMap.css` mirror the Tailwind `text-white/NN` values used elsewhere). Route colors are local to the map. Design-tool notes from the original build (`DESIGN.md`, `PRODUCT.md`, `.impeccable/`) are kept locally and gitignored.
