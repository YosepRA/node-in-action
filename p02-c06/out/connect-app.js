"use strict";

const connect = require('connect');

const middleware = require('./middlewares/connect-app-middleware.js');

const app = connect();
const routes = {
  GET: {
    '/users': function users(req, res) {
      res.end('tobi, loki, ferret');
    },
    '/users/:id': function usersId(req, res, id) {
      res.end('user ' + id);
    }
  },
  DELETE: {
    '/users/:id': function usersId(req, res, id) {
      res.end('deleted user ' + id);
    }
  }
};
/* ========== Middlewares ========== */

app.use(middleware.logger(':method :url'));
app.use('/admin', middleware.restrict);
app.use('/admin', middleware.admin);
app.use(middleware.router(routes));
app.use(middleware.helloWorld);
app.listen(3000, () => {
  console.log('Server is now listening on port 3000...');
});