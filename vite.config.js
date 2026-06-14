import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude large media files in public/ from the file watcher.
      // OneDrive locks .mp4/.mov/.webm while syncing, causing EBUSY crashes.
      ignored: [
        '**/public/**/*.mp4',
        '**/public/**/*.webm',
        '**/public/**/*.mov',
        '**/public/**/*.avi',
      ],
    },
  },
})
