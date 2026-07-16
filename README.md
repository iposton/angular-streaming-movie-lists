# Streaming Lists

Streaming Lists is a movie and TV discovery app that brings catalogs from major streaming services into one place. Browse popular titles, filter by year and genre, search by title or person, watch trailers, and save favorites or reminders without jumping between provider apps.

Version **2.0.0** runs on Angular 22 with server-side rendering, an Express API layer, and Progressive Web App support.

## Features

- Discover movies and TV series available on Netflix, Prime Video, Disney+, Max, Hulu, Apple TV+, and other supported providers
- Filter results by release year, genre, media type, and provider group
- Search by title, actor, or director
- View details, credits, trailers, related recommendations, ratings, and provider availability
- Save favorites and reminders in browser storage
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
- Karma and Jasmine tests
- Heroku-compatible production scripts

## Requirements

- Node.js 24.x
- npm 11.12.1
- A TMDB API key

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

## Local Development

Start the SSR development server:

```bash
npm run dev:ssr
```

Open [http://localhost:4200](http://localhost:4200). The development server rebuilds the browser and server bundles when source files change.

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
| `npm run dev:ssr` | Run browser and SSR development builds |
| `npm run build` | Build the browser application |
| `npm run build:ssr` | Build optimized browser and server bundles |
| `npm run serve:ssr` | Run the compiled SSR server |
| `npm test -- --watch=false --browsers=ChromeHeadless` | Run unit tests once in headless Chrome |
| `npm run prerender` | Prerender configured routes |
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
server.ts            Express and Angular SSR entry point
angular.json         Angular workspace and build configuration
ngsw-config.json     Service-worker caching configuration
Procfile             Heroku process definition
```

## Current Upgrade Notes

Version 2.0 moves the application to Angular 22 and TypeScript 6. The existing Webpack-based Angular builders, Protractor tests, and TSLint configuration still work where used but are deprecated. Moving to Angular's application builder, Vitest, and a modern lint setup should be handled as focused follow-up migrations.
