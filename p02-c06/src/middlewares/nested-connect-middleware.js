const db = {
  users: [{ name: 'Loki' }, { name: 'Thor' }, { name: 'Hela' }],
};

function hello(req, res, next) {
  const { url } = req;

  if (url.match(/^\/hello/)) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  } else {
    next();
  }
}

function users(req, res, next) {
  const { url } = req;
  const match = url.match(/^\/users\/(.+)/);

  if (match) {
    const user = db.users[match[1]];

    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      const error = new Error('User not found');
      error.notFound = true;

      next(error);
    }
  } else {
    next();
  }
}

function pets(req, res, next) {
  const { url } = req;

  if (url.match(/^\/pets/)) {
    foo();
  } else {
    next();
  }
}

/* Error handlers MUST have four parameters assigned to it, even if you are
not using the "next" function. Otherwise, if you give it less than four 
parameters, this function will be read as "normal middleware". */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');

  if (err.notFound) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: err.message }));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = { hello, users, pets, errorHandler };
