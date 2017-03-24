/**
 * Bernd Wessels (https://github.com/BerndWessels/)
 *
 * Copyright © 2016 Bernd Wessels. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

/**
 * Import dependencies.
 */
import fs from 'fs';
import path from 'path';
import net from 'net';
import http from 'http';
import https from 'https';
import express from 'express';
import compression from 'compression';

/**
 * Import local dependencies.
 */
import root from './index.server';

/**
 * Crazy way to redirect http to https.
 * TODO This is not for production.
 */

const basePort = process.env.PORT || 8080;
const redirectPort = basePort + 1;
const httpsPort = basePort + 2;

function tcpConnection(conn) {
  conn.once('data', function (buf) {
    // A TLS handshake record starts with byte 22.
    const address = (buf[0] === 22) ? httpsPort : redirectPort;
    const proxy = net.createConnection(address, function () {
      proxy.write(buf);
      conn.pipe(proxy).pipe(conn);
    });
  });
}

net.createServer(tcpConnection).listen(basePort);
http.createServer(httpConnection).listen(redirectPort);

function httpConnection(req, res) {
  const host = req.headers['host'];
  res.writeHead(301, { "Location": "https://" + host + req.url });
  res.end();
}

/**
 * Read the index.html template.
 */
const indexHtml = fs.readFileSync(path.join(__dirname, '../client/index.html'), 'utf8');

/**
 * Create the express server.
 */
const app = express();

// Log incoming requests.
app.use((req, res, next) => {
  console.log(req.url);
  next()
});

// Remove unnecessary headers.
app.disable('x-powered-by');

// Enable compression.
app.use(compression());

// Serve all static content apart from the index.html.
// TODO Static content should be hosted and requested from a CDN and not from here.
app.use('/', express.static(path.join(__dirname, '../client'), {index: false, maxAge: '365d'}));

// Serve the PWA service worker.
//app.use('/service-worker.js', express.static('build/public/service-worker.js'));

// Serve the index.html for everything else.
app.get('*', (req, res, next) => {
  try {
    root(req).then(({context, html, state}) => {
      res.send(indexHtml
        .replace(/<body>[\s\S]*<\/body>/m, `<body>${html}</body>`)
        .replace(/window.__INITIAL_STATE__ = null;/m, `window.__INITIAL_STATE__ = ${JSON.stringify(state)};`)
      );
    });
  } catch (e) {
    // TODO Better error handling/reporting needed.
    console.log(e);
    next(e);
  }
});

/**
 * Load the ssl certificates.
 */
const privateKey = fs.readFileSync(path.join(__dirname, '../../certificates/localhost.key'));
const certificate = fs.readFileSync(path.join(__dirname, '../../certificates/localhost.crt'));

/**
 * Create and run the server.
 */
const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(httpsPort, () => {
  console.log(`[server] app on https://localhost:${server.address().port} - ${app.settings.env}`)
});

/**
 * Terminate the server on request.
 */
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
});
