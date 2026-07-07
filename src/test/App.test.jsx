import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('Portfolio App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeTruthy()
  })

  it('has a visible heading', () => {
    render(<App />)
    // Looking for Sandeep's name in the portfolio (returns array if multiple)
    const headings = screen.getAllByText(/sandeep/i)
    expect(headings.length).toBeGreaterThan(0)
  })
})
