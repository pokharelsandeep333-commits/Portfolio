Status: resolved

# 01 — Isolate `promo/` from the site toolchain

Part of `.scratch/linkedin-promo/plan.md`. Read the plan's Global Constraints first.

**Files:**
- Modify: `.gitignore` (append)
- Modify: `.dockerignore` (append)
- Modify: `eslint.config.js:8` (`globalIgnores`)
- Modify: `vite.config.js` (`test.exclude`, `server.watch.ignored`)

**Interfaces:**
- Consumes: nothing.
- Produces: later tasks may create any file under `promo/`. It will not be linted, collected by Vitest, watched by Vite, sent to Docker, or (for media and build output) committed.

- [ ] **Step 1: Write the failing check**

Run from the repo root (Git Bash):

```bash
mkdir -p promo/renders promo/assets promo/capture promo/snapshots promo/node_modules promo/.media
touch promo/renders/x.mp4 promo/assets/x.png promo/capture/x.png promo/snapshots/x.jpg promo/node_modules/x promo/.media/x.mp3 promo/.media/manifest.jsonl
git check-ignore -q promo/renders/x.mp4 && git check-ignore -q promo/assets/x.png && git check-ignore -q promo/capture/x.png && git check-ignore -q promo/snapshots/x.jpg && git check-ignore -q promo/node_modules/x && git check-ignore -q promo/.media/x.mp3 && ! git check-ignore -q promo/.media/manifest.jsonl && echo ISOLATED || echo NOT-ISOLATED
```

Expected: `NOT-ISOLATED`.

- [ ] **Step 2: Append to `.gitignore`**

```gitignore

# HyperFrames promo (promo/): keep media, captures and build output out of git.
# The media provenance ledger stays tracked so licenses remain provable.
promo/node_modules/
promo/assets/
promo/capture/
promo/snapshots/
promo/renders/
promo/.hyperframes/
promo/.media/*
!promo/.media/manifest.jsonl
```

- [ ] **Step 3: Append to `.dockerignore`**

```
promo
```

The Dockerfile's builder stage runs `COPY . .`. Without this line, the promo's media and node_modules would be sent to every image build.

- [ ] **Step 4: Ignore `promo` in ESLint**

In `eslint.config.js`, change line 8:

```js
  globalIgnores(['dist', 'promo']),
```

- [ ] **Step 5: Exclude `promo` from Vitest and the dev-server watcher**

Replace the whole of `vite.config.js` with:

```js
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
```

Before relying on the `vitest/config` import, confirm it resolves: `node -e "import('vitest/config').then(m=>console.log(typeof m.configDefaults))"` must print `object`. If it does not, keep `import { defineConfig } from 'vite'` and write the exclude as `['**/node_modules/**', '**/dist/**', 'promo/**']`.

- [ ] **Step 6: Re-run the check from Step 1**

Expected: `ISOLATED`.

- [ ] **Step 7: Prove that Vitest ignores `promo/`**

```bash
mkdir -p promo/scripts/lib && printf "import test from 'node:test';\ntest('probe', () => {});\n" > promo/scripts/lib/probe.test.mjs
npx vitest list 2>&1 | grep -c "promo/" ; echo "(expect 0)"
```

Expected: `0`.

- [ ] **Step 8: Clean up probe files**

Only files this task created are removed. `promo/` must be empty again because `hyperframes init` in Task 02 refuses a non-empty directory.

```bash
rm promo/renders/x.mp4 promo/assets/x.png promo/capture/x.png promo/snapshots/x.jpg promo/node_modules/x promo/.media/x.mp3 promo/.media/manifest.jsonl promo/scripts/lib/probe.test.mjs
find promo -type d -empty -delete
test ! -e promo && echo CLEAN
```

Expected: `CLEAN`.

- [ ] **Step 9: Site gates stay green**

```bash
npm run lint && npm test && npm run build
```

Expected: all three exit 0. The test count matches the count before this task.

- [ ] **Step 10: Commit (only after Sandeep confirms)**

```bash
git add .gitignore .dockerignore eslint.config.js vite.config.js
git commit -m "chore: isolate promo/ HyperFrames project from site toolchain"
```
