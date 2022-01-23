"use strict";

require('dotenv').config();

const connect = require('connect');

const middleware = require('./middlewares/connect-error-middleware.js');

const app = connect(); // app.use(middleware.helloWorld);

app.use('/error', middleware.throwError);
app.use(middleware.errorHandler());
app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});