"use strict";

require('dotenv').config();

const connect = require('connect');

const methodOverride = require('method-override');

const PORT = process.env.PORT;
const app = connect(); // Using 'X-' prefix will make it search for request header.
// app.use(methodOverride('X-Method-Override'));
// Without 'X-' prefix, it will search for query.

app.use(methodOverride('_method'));
app.use((req, res) => {
  const method = req.method,
        url = req.url;
  res.end(`${method} ${url}`);
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});