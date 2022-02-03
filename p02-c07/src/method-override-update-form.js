require('dotenv').config();

const connect = require('connect');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { PORT } = process.env;

const app = connect();

function edit(req, res, next) {
  const { method } = req;

  if (method.toLowerCase() !== 'get') return next();

  res.setHeader('Content-Type', 'text/html');
  res.write('<form method="POST" action="/?_method=PUT">');
  res.write('<input type="text" name="user[name]" />');
  res.write('<button type="submit">Update</button>');
  res.write('</form>');
  res.end();
}

function update(req, res, next) {
  const {
    method,
    body: { user },
  } = req;

  if (method.toLowerCase() !== 'put') return next();

  res.end(`Updated to "${user.name}"`);
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(edit);
app.use(update);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
