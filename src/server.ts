import '@angular/compiler';
import {
  CommonEngine,
  createNodeRequestHandler,
  isMainModule,
} from '@angular/ssr/node';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { api } from '../api/api';
import bootstrap from './main.server';

function loadEnvFile(): void {
  const envPath = join(process.cwd(), '.env');

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const browserDistFolder = join(import.meta.dirname, '../browser');
const indexHtml = join(browserDistFolder, 'index.csr.html');
const configuredHosts = (process.env['NG_ALLOWED_HOSTS'] || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);
const allowedHosts = Array.from(new Set(['localhost', '127.0.0.1', ...configuredHosts]));

const app = express();
const commonEngine = new CommonEngine({ allowedHosts });
const apiKey = process.env['TOKEN'];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function requireApiKey(res: express.Response): string | undefined {
  if (!apiKey) {
    res.status(500).json({ error: 'The movie service is not configured.' });
    return undefined;
  }

  return apiKey;
}

app.post('/data', async (req, res) => {
  try {
    const token = requireApiKey(res);
    if (!token) return;

    const data = await api.data.getAllMovies(
      req.body.query,
      req.body.genre,
      req.body.pro,
      req.body.cat,
      token,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load /data from TMDB:', error);
    res.status(502).json({ error: 'The movie service is temporarily unavailable.' });
  }
});

app.post('/search', async (req, res) => {
  try {
    const token = requireApiKey(res);
    if (!token) return;

    const data = await api.data.search(
      encodeURIComponent(req.body.query),
      token,
      encodeURIComponent(req.body.cat),
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load /search from TMDB:', error);
    res.status(502).json({ error: 'The movie service is temporarily unavailable.' });
  }
});

app.post('/searchtv', async (req, res) => {
  try {
    const token = requireApiKey(res);
    if (!token) return;

    const data = await api.data.searchtv(encodeURIComponent(req.body.query), token);
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load /searchtv from TMDB:', error);
    res.status(502).json({ error: 'The movie service is temporarily unavailable.' });
  }
});

app.post('/searchtrending', async (req, res) => {
  try {
    const token = requireApiKey(res);
    if (!token) return;

    const data = await api.data.searchTrending(
      encodeURIComponent(req.body.query),
      token,
      encodeURIComponent(req.body.cat),
      encodeURIComponent(req.body.mode || 'title'),
    );
    res.status(200).json(data);
  } catch (error) {
    console.error('Failed to load /searchtrending from TMDB:', error);
    res.status(502).json({ error: 'Failed to run search.' });
  }
});

app.post('/trending', async (_req, res) => {
  try {
    const token = requireApiKey(res);
    if (!token) return;

    res.status(200).json(await api.data.getTrending(token));
  } catch (error) {
    console.error('Failed to load /trending from TMDB:', error);
    res.status(502).json({ error: 'The movie service is temporarily unavailable.' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
