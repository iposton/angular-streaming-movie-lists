import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import bootstrap from './src/main.server';
import { api } from './api/api';

function loadEnvFile(): void {
  const envPath = join(process.cwd(), '.env');

  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, 'utf8');

  for (const line of contents.split(/\r?\n/)) {
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

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const configuredHosts = (process.env['NG_ALLOWED_HOSTS'] || '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  const allowedHosts = Array.from(new Set([
    'localhost',
    '127.0.0.1',
    ...configuredHosts,
  ]));
  const commonEngine = new CommonEngine({ allowedHosts });
  const apiKey = process.env['TOKEN'];

  if (!apiKey) {
    throw new Error('Missing TOKEN. Add it to the .env file or environment.');
  }

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.post('/data', async (req, res) => {
    try {
      const search = req.body.query;
      const genre = req.body.genre;
      const pro = req.body.pro;
      const cat = req.body.cat;
      const data = await api.data.getAllMovies(search, genre, pro, cat, apiKey);

      res.status(200).json(data);
    } catch (error) {
      console.error('Failed to load /data from TMDB:', error);
      res.status(502).json({ error: 'The movie service is temporarily unavailable.' });
    }
  });

  server.post('/search', async (req, res) => {
    const searchQuery = encodeURIComponent(req.body.query);
    const catQuery = encodeURIComponent(req.body.cat);
    const data = await api.data.search(searchQuery, apiKey, catQuery);

    res.status(200).json(data);
  });

  server.post('/searchtv', async (req, res) => {
    const searchQuery = encodeURIComponent(req.body.query);
    const data = await api.data.searchtv(searchQuery, apiKey);

    res.status(200).json(data);
  });

  server.post('/searchtrending', async (req, res) => {
    try {
      const searchQuery = encodeURIComponent(req.body.query);
      const catQuery = encodeURIComponent(req.body.cat);
      const modeQuery = encodeURIComponent(req.body.mode || 'title');
      const data = await api.data.searchTrending(searchQuery, apiKey, catQuery, modeQuery);

      res.status(200).json(data);
    } catch {
      res.status(500).json({ error: 'Failed to run search.' });
    }
  });

  server.post('/trending', async (_req, res) => {
    const data = await api.data.getTrending(apiKey);

    res.status(200).json(data);
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default bootstrap;
