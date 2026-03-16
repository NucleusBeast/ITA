# ITA Frontend (Next.js)

Design-first event planning UI built with Next.js 16, App Router, TypeScript, Tailwind CSS, and shadcn-style components.

Current scope is frontend-only:
- Event listing and details
- Event creation UI flow
- Applications overview
- User profile dashboard
- Mock API adapters for future microservice integration

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

## Future Backend Wiring

The compose file exposes placeholders for future microservice endpoints:
- `NEXT_PUBLIC_EVENTS_API_URL`
- `NEXT_PUBLIC_APPLICATIONS_API_URL`
- `NEXT_PUBLIC_USERS_API_URL`

Adapters in `src/lib/api` are intentionally isolated, so replacing mock data with real HTTP calls should not require page-level rewrites.
