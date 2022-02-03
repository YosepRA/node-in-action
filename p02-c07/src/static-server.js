require('dotenv').config();

const connect = require('connect');
const serveStatic = require('serve-static');
const morgan = require('morgan');
const compression = require('compression');
const serveIndex = require('serve-index');
const path = require('path');

const { PORT } = process.env;

const app = connect();
const port = PORT || 3000;
const publicAssetsDirectory = path.join(__dirname, '../public');

app.use(compression());
app.use(morgan('dev'));
app.use(
  '/assets',
  serveIndex(publicAssetsDirectory, { icons: true, view: 'details' }),
);
app.use('/assets', serveStatic(publicAssetsDirectory));

app.listen(port, () => {
  console.log(`Server is now listening on port ${port}...`);
});
