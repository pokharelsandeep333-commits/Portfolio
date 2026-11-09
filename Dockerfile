# --- Stage 1: Build Environment ---
FROM node:22-alpine AS builder
# Set the working directory inside the container
WORKDIR /app
# Copy package files first to leverage Docker layer caching
COPY package*.json ./
# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci
# Copy the rest of the application code
COPY . .
# Pass in the API and Formspree URLs from GitHub Actions
ARG VITE_API_URL
ARG VITE_FORMSPREE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FORMSPREE_URL=$VITE_FORMSPREE_URL
# Build the React application into static HTML/JS files
RUN npm run build

# --- Stage 2: Production Environment (Nginx) ---
# Pinned by digest (nginx 1.31.8, Alpine 3.24.4, built 2026-11-05) so a retag upstream
# cannot change what ships. Bump the digest deliberately when moving to a newer base.
FROM nginx:1.31-alpine@sha256:713fc2ebfd92e8217db451477182ee91944b123d2b1ee9fd5a8c6e91ca6c3a11
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
