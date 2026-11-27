# --- Stage 1: Build Environment ---
FROM node:22-alpine AS builder
# Set the working directory inside the container
WORKDIR /app
# Copy package files first to leverage Docker layer caching
COPY package*.json ./
COPY server/package.json ./server/package.json
# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci
# Copy the rest of the application code
COPY . .
# Pass in the public Formspree URL from GitHub Actions
ARG VITE_FORMSPREE_URL

ENV VITE_FORMSPREE_URL=$VITE_FORMSPREE_URL
# Build the React application into static HTML/JS files
RUN npm run build

FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS api-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json ./server/package.json
RUN npm ci --workspace=portfolio-chat --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:24-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=api-deps /app/node_modules ./node_modules
COPY package.json ./
COPY server/*.js server/package.json ./server/
COPY src/data/skills.js src/data/projects.js src/data/chatLimits.js ./src/data/
USER node
EXPOSE 3001
CMD ["node", "server/index.js"]

# --- Stage 2: Production Environment (Nginx) ---
# Pinned by digest (nginx 1.31.8, Alpine 3.24.4, built 2026-11-05) so a retag upstream
# cannot change what ships. Bump the digest deliberately when moving to a newer base.
FROM nginx:1.31-alpine@sha256:713fc2ebfd92e8217db451477182ee91944b123d2b1ee9fd5a8c6e91ca6c3a11 AS web
# Pull Alpine security fixes released after the base was built, then drop curl:
# nothing in this image uses it, and the compose healthcheck uses busybox wget.
RUN apk upgrade --no-cache \
 && apk del --no-cache curl
# Copy your compiled Vite files from Stage 1 into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Document the port Nginx runs on
EXPOSE 80
# Define the command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
