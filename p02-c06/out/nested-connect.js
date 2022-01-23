"use strict";

const connect = require('connect');

const middleware = require('./middlewares/nested-connect-middleware.js');

const app = connect();
const api = connect();
/* ========== Middlewares ========== */

api.use(middleware.users);
api.use(middleware.pets);
api.use(middleware.errorHandler);
app.use(middleware.hello);
app.use('/api', api);
app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});