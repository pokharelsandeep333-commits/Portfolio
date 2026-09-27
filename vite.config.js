import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // promo/ is a separate HyperFrames project with its own node:test suite.
    exclude: [...configDefaults.exclude, 'promo/**'],
    // Spawning a worker per test file times out here (60s, "Failed to start
    // forks worker") — the repo lives on a OneDrive-synced path and every
    // worker re-reads node_modules through the sync filter. Serial runs the
    // same 3 files in ~16s, so there is nothing to win from parallelism.
    fileParallelism: false,
  },
  server: {
    watch: {
      // Exclude large media files in public/ from the file watcher.
      // OneDrive locks .mp4/.mov/.webm while syncing, causing EBUSY crashes.
      // promo/ holds renders and captures for the same reason.
      ignored: [
        '**/public/**/*.mp4',
        '**/public/**/*.webm',
        '**/public/**/*.mov',
        '**/public/**/*.avi',
        '**/promo/**',
      ],
    },
  },
})
