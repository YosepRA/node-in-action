const fs = require('fs');
const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    fs.createReadStream('./image.jpg').pipe(res);
  })
  .listen(3000);

console.log('Server is listening on port 3000...');
