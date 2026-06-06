# Lens Lounge Microservices

Minimal learning project built with NestJS, React, PostgreSQL, RabbitMQ-style microservice patterns, and Docker.

The repository contains a root NestJS workspace plus standalone app folders:

- `apps/api-gateway` - API gateway service
- `apps/backend` - main backend service
- `apps/payment-service` - payment service
- `apps/frontend` - React frontend

## Runtime

Use the same versions locally and in Docker:

```text
Node.js: 24.15.0
Yarn: 4.14.1
npm: 10.8.3
```

Corepack should be enabled before installing dependencies:

```bash
corepack enable
corepack prepare yarn@4.14.1 --activate
yarn --version
```

## Install

Install dependencies from the repository root:

```bash
yarn install
```

Some apps also have their own `package.json` and `yarn.lock`. If working inside one app directly, run install from that app folder:

```bash
cd apps/backend
yarn install
```

## Development

Root scripts:

```bash
yarn start:dev.api-gateway
yarn start:dev.backend
yarn start:dev.payment-service
yarn start:dev:frontend
```

Run from app folders when needed:

```bash
cd apps/api-gateway && yarn start:dev
cd apps/backend && yarn start:dev
cd apps/payment-service && yarn start:dev
cd apps/frontend && yarn start
```

## Build

```bash
yarn build
```

Per-app builds:

```bash
cd apps/api-gateway && yarn build
cd apps/backend && yarn build
cd apps/payment-service && yarn build
cd apps/frontend && yarn build
```

## Tests

Available test scripts depend on the app:

```bash
yarn test:watch
yarn test:cov
yarn test:e2e
```

API gateway also has:

```bash
cd apps/api-gateway && yarn test
```

Frontend uses Create React App scripts:

```bash
cd apps/frontend && yarn test
```

## Database Migrations

Root/backend-style migration scripts:

```bash
yarn generate-migrations
yarn apply-migrations
yarn revert-last-migrations
```

## Docker

Build and start all services:

```bash
docker compose up --build
```

Service ports:

```text
api-gateway: 3000
backend: 3001
payment-service: 3002
frontend: 80
```

## Useful Checks

```bash
yarn --version
node --version
yarn install --immutable
```
