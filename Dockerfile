# One Record Demo - Dockerfile

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/*/package*.json ./packages/
COPY apps/*/package*.json ./apps/

# Install dependencies
RUN npm ci --workspaces

# Copy source code
COPY . .

# Build TypeScript packages
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/*/package*.json ./packages/
COPY apps/*/package*.json ./apps/

# Install production dependencies only
RUN npm ci --workspaces --omit=dev

# Copy built files from builder
COPY --from=builder /app/packages/*/dist ./packages/
COPY --from=builder /app/apps/*/dist ./apps/

# Copy static files
COPY apps/web/public ./apps/api/public
COPY samples ./samples
COPY schemas ./schemas

# Copy necessary runtime files
COPY scripts/postinstall.js ./scripts/

# Create data directory
RUN mkdir -p /app/apps/api/data

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Start server
CMD ["node", "apps/api/dist/index.js"]
