# ITA Frontend (Next.js)

Design-first event planning UI built with Next.js 16, App Router, TypeScript, Tailwind CSS, and shadcn-style components.

Current scope is frontend-only:
- Event listing and details
- Event creation UI flow
- Applications overview
- User profile dashboard
- Events + users API adapters wired for backend integration

## Run Locally

```bash
npm install
npm run dev
```

Frontend runs on http://localhost:3000.

## Run With Docker Compose

From repository root:

```bash
docker compose up --build frontend
```

## Routes

- `/` home
- `/events` event browser
- `/events/[id]` event details
- `/events/create` create event UI
- `/applications` applications status UI
- `/profile` user dashboard UI
- `/auth` sign in / sign up

## Backend Wiring

The compose file exposes microservice endpoints:
- `NEXT_PUBLIC_EVENTS_API_URL`
- `NEXT_PUBLIC_APPLICATIONS_API_URL`
- `NEXT_PUBLIC_USERS_API_URL`

Frontend also uses server-side bridge configuration for gRPC events service:
- `EVENTS_GRPC_ADDRESS` (default `events:8080`)
- `APP_URL` or `NEXT_PUBLIC_APP_URL` for server fetch base URL

Adapters in `src/lib/api` are isolated so page-level code stays stable while integrations evolve.

Users adapter supports live API integration with optional environment variables:
- `NEXT_PUBLIC_USERS_API_URL` or `USERS_API_URL`

Events adapter is now backed by Next.js API routes:
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`

Auth flow now uses frontend API routes:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

On successful sign in or sign up, frontend stores an HttpOnly cookie (`ita_auth_token`) and profile fetches `/users/me` with that token.
