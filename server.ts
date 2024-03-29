import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { api } from './api/api';
const bodyParser = require('body-parser');

enableProdMode();

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const apiKey = process.env.TOKEN 
  server.use(bodyParser.urlencoded({extended: true}));
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  server.post('/data', async (req, res) => {
    try {
      let search = req.body.query;
      let genre = req.body.genre;
      let pro = req.body.pro;
      let cat = req.body.cat;
      const data =  await api.data.getAllMovies(search, genre, pro, cat, apiKey);
      res.status(200).json(data);
    } catch(e) {
      // console.log(e, 'error');
    }
  })

  server.post('/search', async (req, res) => {
    let searchquery = req.body.query;
    let encsearchquery = encodeURIComponent(searchquery);
    let catquery = req.body.cat;
    let enccatquery = encodeURIComponent(catquery);
    const data =  await api.data.search(encsearchquery, apiKey, enccatquery);
    res.status(200).json(data);
  })

  server.post('/searchtv', async (req, res) => {
    let searchquery = req.body.query;
    let encsearchquery = encodeURIComponent(searchquery);
    const data =  await api.data.searchtv(encsearchquery, apiKey);
    res.status(200).json(data);
  })

  server.post('/searchtrending', async (req, res) => {
    let searchquery = req.body.query;
    let encsearchquery = encodeURIComponent(searchquery);
    let catquery = req.body.cat;
    let enccatquery = encodeURIComponent(catquery);
    const data =  await api.data.searchTrending(encsearchquery, apiKey, enccatquery);
    res.status(200).json(data);
  })

  server.post('/trending', async (req, res) => {
    const data =  await api.data.getTrending(apiKey);
    res.status(200).json(data);
  })

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

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

export * from './src/main.server';
