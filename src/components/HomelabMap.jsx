import { useEffect, useId, useRef, useState } from 'react'
import { homelab, labDelivery, labGroups, labNodes, labRoutes } from '../data/homelab'
import './HomelabMap.css'

function LabIcon({ name, size = 20 }) {
  const paths = {
    cloud: <path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 17.8 9 4.5 4.5 0 0 1 18 18H7Z" />,
    network: <><rect x="8" y="3" width="8" height="5" rx="1" /><path d="M12 8v5M4 16v-3h16v3" /><rect x="1" y="16" width="6" height="5" rx="1" /><rect x="9" y="16" width="6" height="5" rx="1" /><rect x="17" y="16" width="6" height="5" rx="1" /></>,
    server: <><rect x="3" y="3" width="18" height="7" rx="2" /><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M7 6.5h.01M7 17.5h.01M12 6.5h5M12 17.5h5" /></>,
    files: <><path d="M14 3H5v18h14V8l-5-5Z" /><path d="M14 3v5h5M8 12h8M8 16h6" /></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    package: <><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10v10M3 7l9 5 9-5M7.5 4.5l9 5" /></>,
    shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 12 3 3 5-6" /></>,
    chart: <><path d="M3 3v18h18M7 16v-4m5 4V7m5 9v-6" /></>,
    containers: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18M7 15h3m4 0h3" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>,
    play: <><rect x="2" y="4" width="20" height="15" rx="2" /><path d="m10 8 6 3.5-6 3.5V8ZM8 22h8" /></>,
    message: <path d="M21 3H3v14h5v4l5-4h8V3ZM7 8h10M7 12h7" />,
    globe: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    external: <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />,
    pause: <path d="M8 5v14M16 5v14" />,
    resume: <path d="m8 5 11 7-11 7V5Z" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.server}</svg>
}

function ServiceDetails({ node, panelId, mobile = false }) {
  return (
    <aside id={panelId} className={`lab-details ${mobile ? 'lab-details--mobile' : 'lab-details--desktop'}`} aria-label={`${node.name} details`}>
      <div className="lab-details-heading"><LabIcon name={node.icon} size={28} /><h3>{node.name}</h3></div>
      <p className="lab-location">{node.location}</p>
      <p className="lab-description">{node.description}</p>
      <h4>The decision behind it</h4>
      <p>{node.decision}</p>
      <ul className="lab-facts">{node.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
      {node.links.map(link => <a className="lab-evidence" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<LabIcon name="external" size={15} /></a>)}
    </aside>
  )
}

function ServiceNode({ nodeId, selected, highlighted, onSelect, register, instanceId, prominent = false }) {
  const node = labNodes[nodeId]
  const active = selected === nodeId
  return (
    <div className={`lab-node-wrap ${prominent ? 'lab-node-wrap--prominent' : ''}`}>
      <button
        type="button"
        ref={element => register(nodeId, element)}
        className={`lab-node ${active ? 'lab-node--selected' : ''} ${highlighted ? 'lab-node--on-route' : ''}`}
        aria-pressed={active}
        aria-label={`${node.name}: ${node.caption}`}
        aria-controls={`${instanceId}-desktop-details${active ? ` ${instanceId}-mobile-details` : ''}`}
        onClick={() => onSelect(nodeId)}
      >
        <span className="lab-node-icon"><LabIcon name={node.icon} /></span>
        <span className="lab-node-copy"><strong>{node.name}</strong><span>{node.caption}</span></span>
        <span className="lab-node-open" aria-hidden="true"><LabIcon name="arrow" size={15} /></span>
      </button>
      {active && <ServiceDetails node={node} panelId={`${instanceId}-mobile-details`} mobile />}
    </div>
  )
}

// The SVG is geometry only. The HTML buttons retain native focus and semantics.
// Measure on layout changes, never on page scroll or each animation frame.
function FlowLines({ topologyRef, nodesRef, route, selected, instanceId }) {
  const [paths, setPaths] = useState([])

  useEffect(() => {
    const topology = topologyRef.current
    if (!topology) return
    let frame
    const measure = () => {
      const bounds = topology.getBoundingClientRect()
      const host = topology.querySelector('.lab-host').getBoundingClientRect()
      const vm = nodesRef.current.vm.getBoundingClientRect()
      const wazuh = nodesRef.current.wazuh.getBoundingClientRect()
      const leftLane = host.left - bounds.left - 7
      const rightLane = host.right - bounds.left + 7
      const stacked = wazuh.left < vm.right
      const middleLane = stacked ? rightLane : (vm.right + wazuh.left) / 2 - bounds.left
      const point = value => Math.round(value * 10) / 10
      const elbow = points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${point(x)},${point(y)}`).join(' ')
      const next = route.edges.flatMap(([from, to]) => {
        const a = nodesRef.current[from]?.getBoundingClientRect()
        const b = nodesRef.current[to]?.getBoundingClientRect()
        if (!a || !b) return []
        const ax = a.left + a.width / 2 - bounds.left
        const ay = a.top + a.height / 2 - bounds.top
        const bx = b.left + b.width / 2 - bounds.left
        const by = b.top + b.height / 2 - bounds.top
        const vertical = Math.abs(by - ay) > Math.abs(bx - ax) * 0.6
        const direction = vertical ? Math.sign(by - ay) : Math.sign(bx - ax)
        const x1 = ax + (vertical ? 0 : direction * a.width / 2)
        const y1 = ay + (vertical ? direction * a.height / 2 : 0)
        const x2 = bx - (vertical ? 0 : direction * b.width / 2)
        const y2 = by - (vertical ? direction * b.height / 2 : 0)
        const bend = vertical ? (y1 + y2) / 2 : (x1 + x2) / 2
        let d = vertical
          ? `M${x1},${y1} C${x1},${bend} ${x2},${bend} ${x2},${y2}`
          : `M${x1},${y1} C${bend},${y1} ${bend},${y2} ${x2},${y2}`
        const aLeft = a.left - bounds.left
        const aRight = a.right - bounds.left
        const aBottom = a.bottom - bounds.top
        const bLeft = b.left - bounds.left
        const bRight = b.right - bounds.left
        const bTop = b.top - bounds.top
        // Route long connections through gutters, so unrelated service boxes
        // never conceal a path or appear to be intermediate destinations.
        if (from === 'cloudflare') {
          d = elbow([[ax, aBottom], [ax, aBottom + 16], [leftLane, aBottom + 16], [leftLane, by], [bLeft, by]])
        } else if (from === 'tailscale') {
          const lane = to === 'vm' ? middleLane : rightLane
          d = elbow([[ax, aBottom], [ax, aBottom + 22], [lane, aBottom + 22], [lane, by], [bRight, by]])
        } else if (from === 'vm' && to === 'r2') {
          d = elbow([[aLeft, ay], [leftLane, ay], [leftLane, bTop - 16], [bx, bTop - 16], [bx, bTop]])
        } else if (from === 'vm') {
          d = elbow([[aRight, ay], [middleLane, ay], [middleLane, by], [stacked ? bRight : bLeft, by]])
        } else if (from === 'windows' || from === 'cloudtrail') {
          const lane = middleLane + (from === 'windows' ? -4 : 4)
          d = elbow([[ax, a.top - bounds.top], [ax, a.top - bounds.top - 12], [lane, a.top - bounds.top - 12], [lane, by], [stacked ? bRight : bLeft, by]])
        } else if (to === 'discord') {
          d = elbow([[aRight, ay], [rightLane, ay], [rightLane, bTop - 16], [bx, bTop - 16], [bx, bTop]])
        }
        return [{ id: `${from}-${to}`, d }]
      })
      setPaths(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
    }
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
    observer?.observe(topology)
    Object.values(nodesRef.current).forEach(node => { if (node) observer?.observe(node) })
    window.addEventListener('resize', schedule)
    schedule()
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule) }
  }, [route, selected, topologyRef, nodesRef])

  return (
    <svg className="lab-flow-lines" aria-hidden="true">
      <defs><marker id={`${instanceId}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
      {paths.map(path => <g key={`${route.id}-${path.id}`}><path className="lab-flow-track" d={path.d} markerEnd={`url(#${instanceId}-arrow)`} /><path className="lab-flow-tracer" d={path.d} /></g>)}
    </svg>
  )
}

export default function HomelabMap() {
  const [routeId, setRouteId] = useState('web')
  const [selected, setSelected] = useState('vm')
  const [motion, setMotion] = useState(true)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const topologyRef = useRef(null)
  const nodesRef = useRef({})
  const instanceId = useId().replaceAll(':', '')
  const route = labRoutes.find(item => item.id === routeId)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { root: document.body, rootMargin: '100px' })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const register = (id, node) => { nodesRef.current[id] = node }
  const selectRoute = (id) => {
    setRouteId(id)
    setSelected(labRoutes.find(item => item.id === id).selected)
  }
  const renderNode = (id, prominent = false) => <ServiceNode key={id} nodeId={id} selected={selected} highlighted={route.nodes.includes(id)} onSelect={setSelected} register={register} instanceId={instanceId} prominent={prominent} />

  return (
    <section id="homelab" ref={sectionRef} className="lab-section" aria-labelledby={`${instanceId}-heading`}>
      <div className="section-divider lab-divider" />
      <div className="lab-container">
        <header className="lab-heading">
          <div><p className="section-label">Homelab</p><h2 id={`${instanceId}-heading`} className="section-heading">{homelab.heading}<br />{' '}<span>{homelab.headingAccent}</span></h2><p>{homelab.intro}</p></div>
          <span className="lab-snapshot"><LabIcon name="network" size={17} />My homelab / {homelab.date}</span>
        </header>

        <div className="lab-explorer" style={{ '--lab-route': route.color }} data-motion={motion && inView ? 'running' : 'paused'}>
          <div className="lab-toolbar">
            <div className="lab-route-controls" role="group" aria-label="Trace an infrastructure route">
              {labRoutes.map(item => <button key={item.id} type="button" aria-pressed={routeId === item.id} onClick={() => selectRoute(item.id)}><LabIcon name={item.icon} size={17} />{item.label}</button>)}
            </div>
            <button type="button" className="lab-motion" aria-pressed={!motion} onClick={() => setMotion(value => !value)}><LabIcon name={motion ? 'pause' : 'resume'} size={15} />{motion ? 'Pause flow' : 'Play flow'}</button>
          </div>

          <div className="lab-route-description" role="status">
            <p>{route.summary}</p>
            <ol aria-label={`${route.label} direction`}>{route.steps.map((step, i) => <li key={step}>{i > 0 && <LabIcon name="arrow" size={14} />}<span>{step}</span></li>)}</ol>
          </div>

          <div className="lab-workspace">
            <div>
              <div className="lab-topology" ref={topologyRef}>
                <FlowLines topologyRef={topologyRef} nodesRef={nodesRef} route={route} selected={selected} instanceId={instanceId} />
                <div className="lab-ingress">{renderNode('cloudflare', true)}{renderNode('tailscale', true)}</div>
                <div className="lab-host">
                  <div className="lab-host-heading"><LabIcon name="server" size={19} /><span>{homelab.host}</span><span className="lab-host-os">Windows 11</span></div>
                  <div className="lab-environments">
                    <div className="lab-environment lab-environment--vm">
                      <h3 className="lab-environment-label">Hyper-V / Ubuntu</h3>
                      {renderNode('vm', true)}
                      <div className="lab-apps">{labGroups.apps.map(id => renderNode(id))}</div>
                    </div>
                    <div className="lab-environment lab-environment--wsl">
                      <h3 className="lab-environment-label">WSL / Ubuntu / Docker</h3>
                      <div className="lab-services">{labGroups.wsl.map(id => renderNode(id))}</div>
                    </div>
                  </div>
                  <div className="lab-native"><span className="lab-environment-label">Native Windows</span>{renderNode('windows')}{renderNode('jellyfin')}</div>
                </div>
                <div className="lab-external" aria-label="Services outside the laptop">{labGroups.external.map(id => renderNode(id))}</div>
              </div>
              <p className="lab-boundary"><LabIcon name="server" size={15} />{homelab.boundary}</p>
            </div>
            <div className="lab-inspector"><p className="lab-inspector-hint">{homelab.instruction}</p><ServiceDetails node={labNodes[selected]} panelId={`${instanceId}-desktop-details`} /></div>
          </div>
          <p className="sr-only" role="status">{labNodes[selected].name}: {labNodes[selected].description}</p>

          <div className="lab-route-note"><LabIcon name={route.icon} size={19} /><p>{route.note}</p></div>
          <div className="lab-delivery">
            <div><h3>{labDelivery.title}</h3><p>{labDelivery.description}</p></div>
            <ol>{labDelivery.steps.map((step, i) => <li key={step}>{i > 0 && <LabIcon name="arrow" size={15} />}<span>{step}</span></li>)}</ol>
          </div>
          <p className="lab-disclaimer">{homelab.caveat}</p>
        </div>
      </div>
    </section>
  )
}
