# Users Microservice

Express + TypeScript users microservice using Convex cloud as persistence.

## Features

- GET /health
- POST /auth/register
- POST /auth/login
- GET /users/me
- GET /users/:id
- PATCH /users/:id
- GET /docs (Swagger UI)
- GET /docs.json (OpenAPI spec)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Fill required values in `.env`:

- PORT
- CORS_ORIGIN
- JWT_SECRET
- JWT_EXPIRES_IN
- CONVEX_URL
- CONVEX_ADMIN_KEY

4. Deploy Convex functions (from this folder):

```bash
npx convex dev
```

## Run

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

Swagger UI:

```bash
http://localhost:8082/docs
```

OpenAPI JSON:

```bash
http://localhost:8082/docs.json
```

## Logging

During runtime, the service logs:

- startup events
- every HTTP request (method, path, status, duration)
- handled errors in error middleware
- process-level `unhandledRejection` and `uncaughtException` events

## API examples

Register:

```bash
curl -X POST http://localhost:8082/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Novak","email":"ana@example.com","password":"secret123","city":"Ljubljana","role":"Attendee"}'
```

Login:

```bash
curl -X POST http://localhost:8082/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret123"}'
```

Get current user:

```bash
curl http://localhost:8082/users/me \
  -H "Authorization: Bearer <token>"
```
