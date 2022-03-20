FROM ghcr.io/tyrauber/lts-alpine-prisma:latest as base

RUN apk upgrade --update-cache --available && \
    apk add git openssl && \
    rm -rf /var/cache/apk/*

RUN npm install -g pnpm@6.27.1 turbo

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

# Dependencies

FROM base as deps

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/example/package.json packages/example/package.json

# Builder

FROM deps AS builder
WORKDIR /app
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile \
  | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
COPY . .
ENV NODE_ENV production
RUN cd packages/example && pnpm build --no-cache

# RUN rm -rf node_modules packages/example \
#   && pnpm -r exec -- rm -rf node_modules

# Runner

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app .
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile --prod \
  | grep -v "cross-device link not permitted\|Falling back to copying packages from store"


CMD [ "npm", "run", "start" ]