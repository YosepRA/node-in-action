"use strict";

const http = require('http');

const path = require('path');

const formidable = require('formidable');
/* ========== Helpers ========== */


function isMultipartForm(req) {
  const type = req.headers['content-type'] || '';
  return type.indexOf('multipart/form-data') === 0;
}
/* ========== Routes ========== */


function show(req, res) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css"
          integrity="sha512-GQGU0fMMi238uA+a/bdWJfpUGKUkBdgfFdgBm72SUQ6BeyWjoY/ton0tEjH+OSH9iP4Dfh+7HM0I9f5eR0L/4w=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />

        <title>File Upload - Node in Action</title>
      </head>
      <body>
        <main class="container">
          <h1>File upload</h1>

          <form action="/" method="POST" enctype="multipart/form-data">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" name="name" id="name" class="form-control" />
            </div>

            <div class="mb-3">
              <label for="formFile" class="form-label">File</label>
              <input class="form-control" type="file" id="formFile" name="file" />
            </div>

            <div>
              <button type="submit" class="btn btn-primary px-3">Upload</button>
            </div>
          </form>
        </main>
      </body>
    </html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function upload(req, res) {
  if (!isMultipartForm(req)) {
    res.statusCode = 400;
    res.end('Bad request: Expecting multipart/form-data.');
    return undefined;
  }

  const form = formidable({
    uploadDir: path.join(__dirname, '../data/uploads/'),
    keepExtensions: true
  });
  form.on('progress', (bytesReceived, bytesExpected) => {
    const progress = Math.floor(bytesReceived / bytesExpected * 100);
    console.log(progress);
  });
  form.parse(req, (err, fields, files) => {
    console.log(fields);
    console.log(files);
    res.end('Upload complete.');
  });
}
/* ========== Server instances ========== */


const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      show(req, res);
      break;

    case 'POST':
      upload(req, res);
      break;

    default:
      break;
  }
});
/* ========== Listener ========== */

server.listen(3000, 'localhost', 511, () => {
  console.log('Server is listening on port 3000...');
});