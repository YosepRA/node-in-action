"use strict";

const http = require('http');

const path = require('path');

const url = require('url');

const fs = require('fs');

const root = path.join(__dirname, '../data/static-assets');
/* Note: This is only a basic static server used purely to explore Node API.
This is not production as it's vulnerable against Directory Traversal Attack.
Always use a battle-tested static server such as Express static server. */

const server = http.createServer((req, res) => {
  const urlObject = url.parse(req.url);
  const filePath = path.join(root, urlObject.pathname);
  fs.stat(filePath, (err, stat) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found.');
      } else {
        res.statusCode = 500;
        res.end('Internal server error.');
      }
    } else {
      res.setHeader('Content-Length', stat.size);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      /* Unhandled errors will crash a Node process. Always provide an error handler to 
      EventEmitter instances. */

      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Internal server error.');
      });
    }
  });
});
server.listen(3000);