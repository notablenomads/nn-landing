# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy yarn configuration first
COPY .yarn .yarn
COPY .yarnrc.yml ./

# Enable and configure Corepack for Yarn Berry
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --immutable

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Enable and configure Corepack for Yarn Berry
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV NEXT_PUBLIC_BASE_URL https://api.notablenomads.com/v1/
ENV NEXT_PUBLIC_GA_ID GTM-KLT6DHJF

# Build the application
RUN yarn build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Enable and configure Corepack for Yarn Berry
RUN corepack enable && corepack prepare yarn@stable --activate

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_BASE_URL https://api.notablenomads.com/v1/
ENV NEXT_PUBLIC_GA_ID GTM-KLT6DHJF

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/yarn.lock ./yarn.lock

# Create cache directory if it doesn't exist
RUN mkdir -p .yarn/cache

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3030

# Set the command
CMD ["yarn", "start"] 