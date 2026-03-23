# ITA Events Service (gRPC + Convex)

Events microservice implemented with Node.js + TypeScript, gRPC transport, and a dedicated Convex deployment.

## Features

- List events (public)
- Get event details (public)
- Create event (auth required)
- Update event (auth required, owner only)
- Delete event (auth required, owner only)

## Required Environment Variables

- `JWT_SECRET`
- `CONVEX_URL`

Optional:

- `CONVEX_ADMIN_KEY`
- `GRPC_PORT` (default `8080`)
- `HOST` (default `0.0.0.0`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Initialize dedicated Convex deployment for events (inside this folder):

```bash
npx convex dev --once
```

3. Set `EVENTS_CONVEX_URL` (and optional `EVENTS_CONVEX_ADMIN_KEY`) in root environment used by Docker Compose.

## Run

```bash
npm run dev
```

Service listens on gRPC address `0.0.0.0:8080` by default.
