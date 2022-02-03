require('dotenv').config();

const connect = require('connect');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { PORT } = process.env;

const app = connect();
const logStream = fs.createWriteStream(
  path.join(__dirname, '../logs/http-logger.log'),
  { flags: 'a' },
);

// app.use(morgan('tiny'));
app.use(morgan(':method :url :status', { stream: logStream }));
// app.use(morgan('common'));
// app.use(morgan('combined'));

app.use('/posts', (req, res) => {
  res.end('Posts route.');
});

app.use('/contact', (req, res) => {
  res.end('Contact route.');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
