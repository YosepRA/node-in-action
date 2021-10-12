const http = require('http');
const url = require('url');

const items = [];

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      var body = items.map((item, i) => `${i}) ${item}`).join('\n');

      res.setHeader('content-length', Buffer.byteLength(body));
      res.setHeader('content-type', 'text/plain; charset="utf-8"');

      res.end(body);

      break;

    case 'POST':
      var item = '';

      req.setEncoding('utf-8');
      req.on('data', (chunk) => {
        item += chunk;
      });

      req.on('end', () => {
        items.push(item);
        res.end('OK\n');
      });

      break;

    case 'PUT':
      var { pathname } = url.parse(req.url);
      var id = parseInt(pathname.slice(1), 10);
      var updatedItem = '';

      if (Number.isNaN(id)) {
        res.statusCode = 400;
        res.end('Invalid ID.');
      } else if (items[id] === undefined) {
        res.statusCode = 404;
        res.end('Item ID not found.');
      } else {
        req.setEncoding('utf-8');
        req.on('data', (chunk) => (updatedItem += chunk));
        req.on('end', () => {
          items[id] = updatedItem;
        });
        res.end('OK\n');
      }

      break;

    case 'DELETE':
      var { pathname } = url.parse(req.url);
      var id = parseInt(pathname.slice(1), 10);

      if (Number.isNaN(id)) {
        res.statusCode = 400;
        res.end('Invalid ID.');
      } else if (items[id] === undefined) {
        res.statusCode = 404;
        res.end('Item ID not found.');
      } else {
        items.splice(id, 1);
        res.end('OK\n');
      }

      break;

    default:
      break;
  }
});

server.listen(3000, 'localhost', 511, () =>
  console.log('Server is listening on port 3000...'),
);
