FROM rust:1.58.1-alpine3.14 as prisma

WORKDIR /prisma
ENV RUSTFLAGS="-C target-feature=-crt-static"
RUN apk --no-cache add openssl direnv git musl-dev openssl-dev build-base perl protoc
RUN git clone --depth=1 --branch=3.9.0 https://github.com/prisma/prisma-engines.git ./
RUN cargo build --release

FROM node:lts-alpine as base

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /src
ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
  PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
  PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
  PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
  PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
  PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma/target/release/query-engine /prisma/target/release/migration-engine /prisma/target/release/introspection-engine /prisma/target/release/prisma-fmt /prisma-engines/

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true