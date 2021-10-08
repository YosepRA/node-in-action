"use strict";

// const http = require('http');
// const fs = require('fs');
// http
//   .createServer((req, res) => {
//     if (req.url === '/') {
//       fs.readFile('./titles.json', (err, jsonBuffer) => {
//         if (err) {
//           console.error(err);
//           res.end('Server error: Error while reading JSON file.');
//         } else {
//           const titles = JSON.parse(jsonBuffer.toString());
//           fs.readFile('./template.html', (err, htmlBuffer) => {
//             if (err) {
//               console.error(err);
//               res.end('Server error: Error while reading HTML file.');
//             } else {
//               const template = htmlBuffer.toString();
//               const html = template.replace('%', titles.join('</li><li>'));
//               res.writeHead(200, { 'Content-Type': 'text/html' });
//               res.end(html);
//             }
//           });
//         }
//       });
//     }
//   })
//   .listen(3000, '127.0.0.1', 511, () => {
//     console.log('Server is listening on port 3000...');
//   });

/* ========== 3.7 ========== */
const http = require('http');

const fs = require('fs');

function hadError(err, res) {
  console.error(err);
  res.send('Server error.');
}

function formatHTML(titles, template, res) {
  const html = template.replace('%', titles.join('</li><li>'));
  res.writeHead(200, {
    'content-type': 'text/html'
  });
  res.end(html);
}

function getTemplate(titles, res) {
  fs.readFile('./data/template.html', (err, buf) => {
    if (err) return hadError(err, res);
    const template = buf.toString();
    formatHTML(titles, template, res);
    return undefined;
  });
}

function getTitles(res) {
  fs.readFile('./data/titles.json', (err, buf) => {
    if (err) return hadError(err, res);
    const titles = JSON.parse(buf.toString());
    getTemplate(titles, res);
    return undefined;
  });
}

http.createServer((req, res) => {
  getTitles(res);
}).listen(3000, '127.0.0.1', 511, () => {
  console.log('Server is now listening on port 3000...');
});