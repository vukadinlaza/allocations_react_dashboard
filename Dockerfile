# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY craco.config.js ./
COPY public ./public
COPY package.json yarn.lock ./
ARG NPM_TOKEN

ENV NODE_OPTIONS --max_old_space_size=4096

COPY .npmrc-ci .npmrc
RUN yarn install --frozen-lockfile

# If using npm with a "package-lock.json" comment out above and use below instead
# COPY package.json package-lock.json ./ 
# RUN npm ci

FROM node:16-alpine AS runner
WORKDIR /app
COPY . .

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/craco.config.js ./
COPY --from=deps /app/public ./public
COPY --from=deps /app/package.json ./package.json

# Automatically leverage output traces to reduce image size  
# https://nextjs.org/docs/advanced-features/output-file-tracing

EXPOSE 3000

ENV PORT 3000
      