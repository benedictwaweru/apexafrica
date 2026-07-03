FROM node:24.14.0-alpine3.22 AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml .swcrc ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Dev stage — runs tsx/ts-node watcher, mounts source live
FROM base AS dev

RUN npm install -g nx
RUN mkdir -p /certs/ca 

COPY nx.json tsconfig*.json ./

CMD ["nx", "serve", "apexafrica"]

# Build stage — compiles
FROM base AS build

COPY . .

RUN nx build apexafrica --prod

# Production stage — lean final image
FROM node:24.14.0-alpine3.22 AS prod

WORKDIR /app

COPY --from=build /app/dist/apps/apexafrica ./

CMD ["node", "main.js"]
