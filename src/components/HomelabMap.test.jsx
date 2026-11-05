import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HomelabMap from './HomelabMap'
import { labNodes, labRoutes } from '../data/homelab'

describe('Homelab map', () => {
  it('lets visitors trace each route and inspect its entry point', () => {
    render(<HomelabMap />)
    for (const route of labRoutes) {
      const control = screen.getByRole('button', { name: route.label, exact: true })
      fireEvent.click(control)
      expect(control).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getAllByRole('status')[0]).toHaveTextContent(route.summary)
      expect(within(screen.getByRole('list', { name: `${route.label} direction` })).getAllByRole('listitem')).toHaveLength(route.steps.length)
      expect(screen.getByRole('button', { name: `${labNodes[route.selected].name}: ${labNodes[route.selected].caption}` })).toHaveAttribute('aria-pressed', 'true')
    }
  })

  it('opens every service with its actual explanation and public evidence', () => {
    render(<HomelabMap />)
    for (const node of Object.values(labNodes)) {
      fireEvent.click(screen.getByRole('button', { name: `${node.name}: ${node.caption}` }))
      const panels = screen.getAllByRole('complementary', { name: `${node.name} details` })
      expect(panels).toHaveLength(2) // CSS exposes one at the appropriate container width.
      for (const panel of panels) {
        expect(panel).toHaveTextContent(node.description)
        expect(panel).toHaveTextContent(node.decision)
        for (const link of node.links) {
          expect(within(panel).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
        }
      }
    }
  })

  it('allows visitors to pause and resume the illustrative flow', () => {
    render(<HomelabMap />)
    fireEvent.click(screen.getByRole('button', { name: 'Pause flow' }))
    expect(screen.getByRole('button', { name: 'Play flow' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Play flow' }))
    expect(screen.getByRole('button', { name: 'Pause flow' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('updates connections when inline details move nodes without a resize', async () => {
    // Model a stacked layout with equal-height inspectors. All observed sizes
    // stay fixed; moving the inspector changes only the Windows button's y.
    const boxes = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.classList.contains('lab-topology')) return new DOMRect(0, 0, 350, 2200)
      if (this.classList.contains('lab-host')) return new DOMRect(0, 100, 350, 1800)
      const label = this.getAttribute('aria-label') || ''
      if (label.startsWith('SandeepCloud:')) return new DOMRect(20, 200, 300, 64)
      if (label.startsWith('Wazuh:')) return new DOMRect(20, 700, 300, 64)
      if (label.startsWith('Windows host:')) {
        const selected = document.querySelector('.lab-node--selected')?.getAttribute('aria-label')
        return new DOMRect(20, selected?.startsWith('Windows host:') ? 1000 : 1400, 300, 64)
      }
      return new DOMRect(20, 2000, 300, 64)
    })
    try {
      const { container } = render(<HomelabMap />)
      fireEvent.click(screen.getByRole('button', { name: 'Security events', exact: true }))
      const paths = () => Array.from(container.querySelectorAll('.lab-flow-track'), path => path.getAttribute('d'))
      await waitFor(() => expect(paths()).toHaveLength(4))
      const before = paths()
      fireEvent.click(screen.getByRole('button', { name: 'Windows host: Wazuh + Beszel agents', exact: true }))
      await waitFor(() => expect(paths()).not.toEqual(before))
    } finally {
      boxes.mockRestore()
    }
  })

  it('keeps private infrastructure addresses and management links out of public data', () => {
    const content = JSON.stringify({ labNodes, labRoutes })
    expect(content).not.toMatch(/\b(?:\d{1,3}\.){3}\d{1,3}\b|\.ts\.net\b|[A-Z]:\\|https?:\/\/(?:localhost|127\.)/i)
    for (const node of Object.values(labNodes)) {
      for (const link of node.links) expect(link.href).toMatch(/^https:\/\//)
    }
  })
})
