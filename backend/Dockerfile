# Use a Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy monorepo root manifests
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

# Copy backend package.json to satisfy workspace filter
COPY backend/package.json ./backend/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy full repo
COPY . .

# Generate Prisma client
RUN pnpm --filter backend prisma generate

# Build backend
RUN pnpm --filter backend build

# Expose NestJS backend port
EXPOSE 3001

# Start the backend app in production
CMD ["pnpm", "--filter", "backend", "start:prod"]
