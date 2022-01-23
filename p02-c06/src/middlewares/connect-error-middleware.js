function helloWorld(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}

function throwError(req, res) {
  throw new Error('This middleware will always throw an error');
}

function errorHandler() {
  const { NODE_ENV } = process.env;
  const env = NODE_ENV || 'development';

  return function (err, req, res, next) {
    res.statusCode = 500;

    switch (env) {
      case 'development': {
        const payload = JSON.stringify(err, Object.getOwnPropertyNames(err));

        res.setHeader('Content-Type', 'application/json');
        res.end(payload);

        next();
        break;
      }

      default:
        res.end('Server Error');
        next();
        break;
    }
  };
}

module.exports = { helloWorld, throwError, errorHandler };
