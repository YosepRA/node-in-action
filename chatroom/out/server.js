"use strict";

const http = require('http');

const fs = require('fs');

const path = require('path');

const mime = require('mime');

const chatServer = require('./lib/chat_server');

const cache = {};
/* ========== Helpers ========== */

function send404(res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  res.write('Error 404: resource not found');
  res.end();
}

function sendFile(res, filePath, fileContent) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  });
  res.end(fileContent);
}

function serveStatic(res, cache, absPath) {
  // If it's stored in cache, send the cached file.
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath]);
  } else {
    // Check file existence.
    fs.exists(absPath, exists => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            send404(res);
          } else {
            // If file exists. Store file to cache and send it.
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}
/* ========== Server ========== */


const server = http.createServer((req, res) => {
  const url = req.url;
  let filePath = false;

  if (url === '/') {
    filePath = 'public/index.html';
  } else {
    filePath = `public${url}`;
  }

  const absPath = `./${filePath}`;
  serveStatic(res, cache, absPath);
});
server.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});
chatServer.listen(server);