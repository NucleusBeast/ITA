# Applications Microservice

Express + TypeScript microservice for event applications, implemented in a reactive style with RxJS and persisted in Convex.

## Features

- GET /health
- GET /applications/me (auth)
- GET /applications/event/:eventId/me (auth)
- POST /applications (auth)
- DELETE /applications/:id (auth)

## Required Environment Variables

- JWT_SECRET
- CONVEX_URL

Optional:

- CONVEX_ADMIN_KEY
- PORT (default 8081)
- CORS_ORIGIN (default http://localhost:3000)

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```
