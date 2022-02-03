require('dotenv').config();

const connect = require('connect');
const favicon = require('serve-favicon');
const path = require('path');

const { hello } = require('./middleware/index.js');

const { PORT } = process.env;

const app = connect();

/* It's preferable to use favicon middleware as early as possible so that
the rest of the application won't have to bother with a request as
frequent as GET /favicon. */
app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(hello);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
