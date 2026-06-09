# Multi-stage Dockerfile for Next.js app

# Stage 1: Install dependencies
FROM node:22-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies based on lockfile present
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 2: Rebuild the source code
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage output standalone tracing to reduce image size (requires output: 'standalone' in next.config.mjs)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build when output: 'standalone' is configured
CMD ["node", "server.js"]
