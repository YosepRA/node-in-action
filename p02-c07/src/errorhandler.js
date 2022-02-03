require('dotenv').config();

const connect = require('connect');
const errorHandler = require('errorhandler');

const { PORT } = process.env;

const app = connect();

app.use((req, res, next) => {
  setTimeout(() => {
    next(new Error('Something bad happened.'));
  }, 2000);
});
app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`Server is now listening on port ${PORT}...`);
});
