"use strict";

require('dotenv').config();

const connect = require('connect');

const session = require('express-session');

const bodyParser = require('body-parser');

const _process$env = process.env,
      PORT = _process$env.PORT,
      SESSION_SECRET = _process$env.SESSION_SECRET;
const app = connect();
let sessionSecret = SESSION_SECRET;

if (!sessionSecret) {
  sessionSecret = 'unsafe_session_secret';
  console.log('You are currently using an unsafe session secret. Store your session secret as environment variable on production.');
}

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000
  }
};
/* ========== Controllers ========== */

function pageCount(req, res) {
  const session = req.session;

  if (session.views) {
    res.setHeader('Content-Type', 'text/html');
    res.write(`<p>Current page views: <b>${session.views}</b></p>`);
    session.views++;
    res.end();
  } else {
    session.views = 1;
    res.end('Welcome to session demo. Please refresh() to start.');
  }
}

function showCart(req, res, next) {
  const session = req.session;
  const form = `
      <form action="/cart" method="POST">
        <input type="text" name="newItem" placeholder="Add new item" />
        <button type="submit">Add</button>
      </form>
    `;

  if (session.cart) {
    res.setHeader('Content-Type', 'text/html');
    res.write(form);
    res.write(`<p>Cart: ${JSON.stringify(session.cart)}</p>`);
    res.end();
  } else {
    session.cart = [];
    res.setHeader('Content-Type', 'text/html');
    res.write(form);
    res.write('<p>Cart: <b><i>Empty</i></b></p>');
    res.end();
  }
}

function addNewItem(req, res, next) {
  const newItem = req.body.newItem,
        session = req.session;
  session.cart = session.cart.concat(newItem);
  showCart(req, res, next);
}
/* ========== Middlewares ========== */


app.use(session(sessionOptions));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});
app.use('/page-count', pageCount);
app.use('/cart', (req, res, next) => {
  switch (req.method) {
    case 'GET':
      showCart(req, res, next);
      break;

    case 'POST':
      addNewItem(req, res, next);
      break;

    default:
      next();
      break;
  }
});
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});