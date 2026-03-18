# Angular Streaming Movies Lists

This project shows streaming movie and TV recommendations across platforms such as Netflix, Prime Video, Disney+, HBO Max, Hulu, and Apple TV+.

It is built with Angular 20, uses server-side rendering with `@angular/ssr`, and includes Angular service worker support for PWA behavior.

Data comes from [The Movie Database (TMDB)](https://www.themoviedb.org/?language=en-US) API.

## Requirements

- Node.js 24.x works with the current Angular 20 setup
- npm
- A TMDB API token stored in `.env`

## Environment

Create a `.env` file in the project root with:

```env
TOKEN=your_tmdb_api_token
```

The SSR server reads this token at startup and will fail to boot if it is missing.

## Development

Install dependencies:

```bash
npm install
```

Run the SSR dev server:

```bash
npm run dev:ssr
```

## Production Build

Build the browser app, service worker, and server bundle:

```bash
npm run build:ssr
```

Run the built SSR server:

```bash
npm run serve:ssr
```
