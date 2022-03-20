# lts-alpine-prisma
lts-alpine docker image with compiled Prisma

# About

[prisma/prisma/issues/8478](https://github.com/prisma/prisma/issues/8478)
> Right now you can't use Prisma on Docker alpine on M1 mac as it requires aarch64-unknown-linux-musl binaries. As M1 will see more adoption, people will run into this frequently

# Usage

Use the Docker image: [ghcr.io/tyrauber/lts-alpine-prisma:latest](ghcr.io/tyrauber/lts-alpine-prisma)

In the prisma client, use the following in the datasource db declaration.

```
  binaryTargets   = ["native", "linux-arm-openssl-1.1.x"]
```


