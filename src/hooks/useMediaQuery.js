import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query and re-renders when it flips.
 *
 * Components use this for changes CSS alone cannot express — swapping the nav
 * for a sheet, or skipping the hero <video> element entirely on phones so the
 * 1.7 MB file is never requested. Anything that is purely visual belongs in a
 * stylesheet media query instead; this costs a React render.
 *
 * `matchMedia` is missing in some non-browser environments (and the JSDOM mock
 * in src/test/setup.js always reports `false`), so both the server snapshot and
 * the no-matchMedia path fall back to `false` — the desktop layout.
 */
export function useMediaQuery(query) {
  // Both callbacks are memoised on `query` so React does not tear down and
  // re-add the change listener on every render.
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

// Matches Tailwind's `md` breakpoint, so JS and CSS agree on where "mobile" ends.
export const MOBILE_QUERY = '(max-width: 767px)'
