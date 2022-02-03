const connect = require('connect');
const bodyParser = require('body-parser');

const app = connect();

function bodyEcho(req, res) {
  const { body } = req;

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function rawHandler(req, res) {
  const { body } = req;
  console.log(body.toString());

  res.end('ok');
}

app.use('/urlencoded', bodyParser.urlencoded({ extended: true }));
app.use('/urlencoded', bodyEcho);

app.use('/json', bodyParser.json());
app.use('/json', bodyEcho);

app.use('/raw', bodyParser.raw({ type: 'application/json' }));
app.use('/raw', rawHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});
