"use strict";

const http = require('http');

const qs = require('querystring');

const items = [];

function show(res) {
  const listItems = items.map(item => `<li>${item}</li>`).join('');
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css" integrity="sha512-GQGU0fMMi238uA+a/bdWJfpUGKUkBdgfFdgBm72SUQ6BeyWjoY/ton0tEjH+OSH9iP4Dfh+7HM0I9f5eR0L/4w==" crossorigin="anonymous" referrerpolicy="no-referrer" />

        <title>Todo with UI - Node in Action</title>
      </head>
      <body>
        <main class="container">
          <h1>Todo List</h1>

          <ul>${listItems}</ul>

          <form action="/" method="POST">
            <p>
              <input type="text" name="item" id="item" class="form-control" autofocus />
            </p>
            <p>
              <button type="submit" class="btn btn-primary px-4">Add</button>
            </p>
          </form>
        </main>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function add(req, res) {
  let body = '';
  req.setEncoding('utf-8');
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const formData = qs.parse(body);
    items.push(formData.item);
    show(res);
  });
}

function badRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad request.');
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Resource not found.');
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    switch (req.method) {
      case 'GET':
        show(res);
        break;

      case 'POST':
        add(req, res);
        break;

      default:
        badRequest(res);
        break;
    }
  } else {
    notFound(res);
  }
});
server.listen(3000, '127.0.0.1', 511, () => {
  console.log('Server is listening on port 3000...');
});