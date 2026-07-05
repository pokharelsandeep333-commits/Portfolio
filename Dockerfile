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
# Build the React application into static HTML/JS files
RUN npm run build

# --- Stage 2: Production Environment (Nginx) ---
FROM nginx:alpine
# Copy your compiled Vite files from Stage 1 into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Document the port Nginx runs on
EXPOSE 80
# Define the command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
