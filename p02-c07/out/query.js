"use strict";

require('dotenv').config();

const connect = require('connect');

const qs = require('qs');

const _require = require('url'),
      URL = _require.URL;

const PORT = process.env.PORT;
const app = connect();

function queryParser(req, res, next) {
  const url = req.url;
  const parsedUrl = new URL(`http://localhost:${PORT}${url}`);
  req.query = qs.parse(parsedUrl.search.slice(1));
  next();
}

app.use(queryParser);
app.use((req, res) => {
  const query = req.query;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(query));
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});