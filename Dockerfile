# Multi-stage build for optimal image size
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# ============================================
# Dependencies stage
# ============================================
FROM base AS deps

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# ============================================
# Backend builder stage
# ============================================
FROM base AS backend-builder

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy backend source
COPY backend ./backend
COPY migrations ./migrations
COPY tsconfig.json ./
COPY backend/tsconfig.json ./backend/

# Build backend
RUN pnpm build:backend

# ============================================
# Frontend builder stage
# ============================================
FROM base AS frontend-builder

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy frontend source
COPY frontend ./frontend

# Build frontend
RUN pnpm build:frontend

# ============================================
# Production dependencies stage
# ============================================
FROM base AS prod-deps

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# ============================================
# Runner stage
# ============================================
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Set to production
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy production dependencies
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy built backend
COPY --from=backend-builder --chown=nestjs:nodejs /app/dist ./dist

# Copy built frontend
COPY --from=frontend-builder --chown=nestjs:nodejs /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder --chown=nestjs:nodejs /app/frontend/public ./frontend/public
COPY --from=frontend-builder --chown=nestjs:nodejs /app/frontend/next.config.js ./frontend/

# Copy necessary files
COPY --chown=nestjs:nodejs package.json ./
COPY --chown=nestjs:nodejs backend ./backend
COPY --chown=nestjs:nodejs migrations ./migrations

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/backend/main.js"]
