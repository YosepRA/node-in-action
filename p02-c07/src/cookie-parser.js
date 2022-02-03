require('dotenv').config();

const connect = require('connect');
const cookieParser = require('cookie-parser');

const { COOKIE_SECRET } = process.env;

const app = connect();

app.use(cookieParser(COOKIE_SECRET));

app.use('/get-cookies', (req, res) => {
  const { cookies, signedCookies } = req;

  console.log('Cookies:', cookies);
  console.log('Signed cookies:', signedCookies);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(cookies));
});

app.use('/set-cookies', (req, res) => {
  res.setHeader('Set-Cookie', [
    'food=bagel',
    'drink=milk; Expires=Thu, Jan 27 2022 19:40:13 GMT;',
  ]);

  res.end('ok');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});
