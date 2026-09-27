# Streaming Lists

Streaming Lists is a movie and TV discovery app that brings catalogs from major streaming services into one place. Browse popular titles, filter by year and genre, search by title or person, watch trailers, and save favorites or reminders without jumping between provider apps.

Version **2.0.0** runs on Angular 22 with server-side rendering, an Express API layer, and Progressive Web App support.

## Features

- Discover movies and TV series available on Netflix, Prime Video, Disney+, Max, Hulu, Apple TV+, and other supported providers
- Filter results by release year, genre, media type, and provider group
- Search by title, actor, or director
- View details, credits, trailers, related recommendations, ratings, and provider availability
- Sign in without a password by email magic link
- Sync favorites and reminders across devices with Supabase
- Retain a local browser cache for fast loading and offline-friendly behavior
- Render pages on the server for faster first loads and shareable metadata
- Cache the production client with an Angular service worker
- Throttle and retry requests to handle TMDB rate limits more gracefully

Movie, TV, artwork, credit, recommendation, and provider data comes from [The Movie Database (TMDB)](https://www.themoviedb.org/). This project is not endorsed or certified by TMDB or the streaming providers it references.

## Technology

- Angular 22 and TypeScript 6
- Angular SSR with an Express server
- Angular service worker
- RxJS
- TMDB API
- Supabase Auth and Postgres
- Resend SMTP for authentication email
- Karma and Jasmine tests
- Heroku-compatible production scripts

## Requirements

- Node.js 24.x
- npm 11.12.1
- A TMDB API key
- A Supabase project on the Free plan
- A Resend account on the Free plan for magic-link email

The required runtime versions are also declared in `package.json`. Using the pinned npm version keeps `package-lock.json` reproducible between local development and deployment.

## Getting Started

Clone the repository and install the exact dependency versions from the lockfile:

```bash
git clone https://github.com/iposton/angular-streaming-movie-lists.git
cd angular-streaming-movie-lists
npm ci
```

Create a `.env` file in the project root:

```env
TOKEN=your_tmdb_api_key
NG_ALLOWED_HOSTS=localhost
```

`TOKEN` is read only by the Express server and is not bundled into the browser application. The server stops during startup when the value is missing.

Angular SSR validates request hostnames. Use a comma-separated list when the app must respond to more than one hostname:

```env
NG_ALLOWED_HOSTS=localhost,streaming-lists.herokuapp.com
```

Do not commit `.env` or use `NG_ALLOWED_HOSTS=*` in production.

## Supabase Setup

Supabase provides user accounts and the `saved_titles` database table. The Angular application connects with the public project URL and publishable key; database security comes from Row-Level Security rather than hiding these public browser values.

### 1. Create the project

Create a project at [Supabase](https://supabase.com/dashboard) using the Free plan. Keep the generated database password private; the Angular application does not need it.

In the Supabase dashboard, open **Connect → App Frameworks** and copy the project URL and publishable key into both environment files:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```ts
export const environment = {
  production: false,
  googleAnalyticsTrackingCode: 'UA-61983807-4',
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabasePublishableKey: 'sb_publishable_...'
};
```

The publishable key is designed for browser use and may be committed. Never put the database password, secret key, or service-role key in browser code.

### 2. Create the saved-titles table

Open **SQL Editor → New query** in Supabase, paste the contents of [`supabase/migrations/202609210001_create_saved_titles.sql`](supabase/migrations/202609210001_create_saved_titles.sql), and run it once.

The migration creates:

- A `saved_titles` row for each favorite or reminder
- A required `user_id` linked to `auth.users`
- A uniqueness constraint preventing duplicate list entries
- Row-Level Security policies restricting every operation to the signed-in user

Do not disable Row-Level Security. The public publishable key is safe only when the policies remain enabled.

### 3. Configure authentication redirects

Open **Authentication → URL Configuration** in Supabase and configure:

```text
Site URL: https://streaming-lists.herokuapp.com
Redirect URL: http://localhost:4200
Redirect URL: https://streaming-lists.herokuapp.com
```

Change the production URL if the application moves to another domain. The app passes its current origin to Supabase when requesting a magic link, so every development or production origin must be on this allow list.

## Resend Magic-Link Email

Supabase's built-in email sender is intended only for initial testing: it sends only to project-team addresses and is heavily rate-limited. Configure [Resend](https://resend.com/) as custom SMTP before inviting users.

### 1. Create a Resend SMTP key

In Resend, create an API key with **Sending access**. Keep the key private and paste it directly into Supabase; do not add it to Angular or commit it.

For production delivery, add and verify a domain in Resend. A sender such as `noreply@streaminglists.com` works only after `streaminglists.com` is verified. During initial testing, Resend's `onboarding@resend.dev` sender can be used with the Resend account owner's email.

### 2. Configure Supabase SMTP

Open **Authentication → Emails → SMTP Settings**, enable custom SMTP, and enter:

| Setting | Value |
| --- | --- |
| Sender email | `noreply@streaminglists.com` or `onboarding@resend.dev` for testing |
| Sender name | `Streaming Lists` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Minimum interval | `60` seconds |
| Username | `resend` |
| Password | Active Resend API key |

If Supabase reports `Error sending confirmation email`, verify the sender domain, confirm that the Resend key is active, and inspect both **Supabase Authentication logs** and **Resend Logs**.

## Cross-Device Sync Behavior

The source of truth for signed-in users is the Supabase `saved_titles` table. Each row belongs to one user through `user_id`, and Row-Level Security prevents users from accessing anyone else's rows.

`localStorage` is retained only as a device cache:

1. On a user's first Supabase login from an existing installation, local favorites and reminders are uploaded once.
2. The user's current Supabase rows are downloaded into the local cache.
3. New additions and removals update the cache immediately and then write to Supabase.
4. Signing in on another device downloads the same saved lists.

Database rows can be inspected in **Supabase → Table Editor → saved_titles**. Registered accounts appear under **Authentication → Users**.

## Free-Tier Capacity

The current free tiers are more than sufficient for a small application with roughly 100 users:

| Service | Free allowance | Important limitation |
| --- | --- | --- |
| [Supabase Free](https://supabase.com/pricing) | 500 MB database, 50,000 monthly active users, 5 GB egress | Low-activity projects may pause after seven days; automatic downloadable backups are not included |
| [Resend Free](https://resend.com/pricing) | 3,000 emails per month, 100 per day, up to 3 domains | Sending stops at the free quota; use a verified domain for production delivery |

Only TMDB IDs and the saved display snapshot are stored. TMDB artwork remains hosted by TMDB and is not copied into Supabase Storage.

## Local Development

Start Angular and the Express/TMDB API together:

```bash
npm run dev
```

Open [http://localhost:4200](http://localhost:4200). Both processes rebuild when their source files change. The Angular development server proxies `/data`, `/search`, `/searchtv`, `/searchtrending`, and `/trending` to Express on port 4000.

For a browser-only Angular development server, run:

```bash
npm run ng -- serve
```

## Build and Run Production Locally

Build the optimized browser bundle, service worker, and Node server:

```bash
npm run build:ssr
```

Start the compiled server on port 4000:

```bash
npm run serve:ssr
```

Set `PORT` to choose another port:

```bash
PORT=8080 npm run serve:ssr
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Express API and Angular development server together |
| `npm run build` | Build the browser application |
| `npm run build:ssr` | Build optimized browser and server bundles |
| `npm run serve:ssr` | Run the compiled SSR server |
| `npm test -- --watch=false --browsers=ChromeHeadless` | Run unit tests once in headless Chrome |
| `npm start` | Start the compiled server in production |

## Server API

The Express layer keeps the TMDB key out of client-side code and exposes these application endpoints:

| Endpoint | Purpose |
| --- | --- |
| `POST /data` | Load provider-based movie or TV lists |
| `POST /search` | Load movie details and recommendations |
| `POST /searchtv` | Load TV details and recommendations |
| `POST /searchtrending` | Search titles, actors, or directors |
| `POST /trending` | Load trending titles |

## Deploying to Heroku

Configure the required environment values:

```bash
heroku config:set TOKEN=your_tmdb_api_key
heroku config:set NG_ALLOWED_HOSTS=streaming-lists.herokuapp.com
```

Deploy the current branch:

```bash
git push heroku master
```

Heroku runs `heroku-postbuild` to create the browser and SSR bundles, then starts the server with the repository's `Procfile`.

Before committing dependency changes, confirm that the lockfile is valid:

```bash
npm ci --dry-run
```

Always commit `package.json` and `package-lock.json` together.

## Project Structure

```text
api/                 TMDB request and aggregation logic
src/app/             Angular components, services, and routing
src/environments/    Browser build environments
src/server.ts        Express and Angular SSR entry point
supabase/migrations/ Supabase schema and Row-Level Security SQL
angular.json         Angular workspace and build configuration
ngsw-config.json     Service-worker caching configuration
Procfile             Heroku process definition
```

## Current Upgrade Notes

Version 2.0 moves the application to Angular 22 and TypeScript 6. The existing Webpack-based Angular builders, Protractor tests, and TSLint configuration still work where used but are deprecated. Moving to Angular's application builder, Vitest, and a modern lint setup should be handled as focused follow-up migrations.
