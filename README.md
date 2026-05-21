# StudyNook Client

Next.js frontend for **StudyNook** — browse and book quiet study rooms, list your own space, and manage bookings. Authentication runs on this app (Better Auth + MongoDB); rooms and bookings are served by a separate Express API.

## Features

- **Public** — home, room browse/search, about
- **Auth** — email/password sign-up and sign-in, optional Google OAuth
- **Signed-in** — add/edit listings, my listings, my bookings, room details and booking
- **SEO** — dynamic page titles per route
- **API proxy** — `/api/rooms` and `/api/bookings` rewrite to the Express backend

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Better Auth](https://www.better-auth.com/) with MongoDB adapter
- [HeroUI](https://www.heroui.com/) + [Tailwind CSS](https://tailwindcss.com/) 4
- [MongoDB](https://www.mongodb.com/) (shared with the API for users and data)
- JWT cookie for middleware and API authorization (minted after Better Auth session)

## Prerequisites

- Node.js 18+
- MongoDB (e.g. Atlas) with `MONGODB_URI`
- Running **Express API** (default `http://localhost:5000`) for rooms and bookings

## Getting started

```bash
npm install
# Create .env.local with the variables listed below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script        | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Development server       |
| `npm run build` | Production build       |
| `npm start`   | Run production build     |
| `npm run lint` | ESLint                  |

## Environment variables

Create `.env.local` (or set in your host). Names match `src/lib/app-env.js` and auth setup.

### Required (local dev)

| Variable | Description |
| -------- | ----------- |
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Database name (default: `StudyNook`) |
| `BETTER_AUTH_SECRET` | Secret for Better Auth and JWT signing |
| `BETTER_AUTH_URL` | This app’s origin, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as above for the browser client |
| `API_URL` | Express API base, e.g. `http://localhost:5000` |

### Optional

| Variable | Description |
| -------- | ----------- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Enable Google sign-in |
| `JWT_SECRET` | Override JWT signing (falls back to `BETTER_AUTH_SECRET`) |
| `JWT_EXPIRES_IN` | JWT lifetime (default: `7d`) |
| `API_URL_PROD` | Production API URL (Render, etc.) |
| `BETTER_AUTH_URL_PROD` | Production app URL (Vercel) |
| `NEXT_PUBLIC_BETTER_AUTH_URL_PROD` | Public production auth URL for the client |

Production builds expect runtime env on the host (e.g. Vercel). `MONGODB_URI` is required when auth routes run, not necessarily at `next build` time if lazy-loaded.

## Project structure

```
src/
  app/
    (public)/          # Home, rooms browse, about
    (auth)/            # Login, register
    (private)/         # Add room, my listings, my bookings, room detail
    api/auth/          # Better Auth handler, JWT mint/clear
    api/upload/        # Room image upload
  components/          # UI, layout, rooms, auth, home
  hooks/               # useAuth
  lib/                 # API client, auth, env, routes, MongoDB
  middleware.js        # Protected routes + JWT check (Edge-safe)
```

## Routes

| Path | Access |
| ---- | ------ |
| `/` | Public |
| `/rooms`, `/about` | Public |
| `/login`, `/register` | Guest only (redirect if signed in) |
| `/add-room`, `/my-listings`, `/my-bookings` | Signed in |
| `/rooms/[id]` | Signed in (browse listing is public at `/rooms`) |

## Deployment

Typical split:

- **This repo** — Vercel (Next.js). Set `BETTER_AUTH_URL_PROD`, `NEXT_PUBLIC_BETTER_AUTH_URL_PROD`, and MongoDB/auth secrets.
- **API** — Render or similar. Set `API_URL_PROD` on the client to that service URL.

Room/booking requests from the browser go to `/api/rooms/*` and `/api/bookings/*` on the Next host and are rewritten to the Express API (`next.config.mjs`).

## Related services

- **Express API** — room CRUD, bookings, and business logic (not in this repo).
- **MongoDB** — shared database for Better Auth users and API data.

## License

Private — project (`private: true` in `package.json`).
