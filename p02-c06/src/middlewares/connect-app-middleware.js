const { parse } = require('url');

function logger(format) {
  const pattern = /:(\w+)/g;

  return function (req, res, next) {
    const logString = format.replace(
      pattern,
      (match, property) => req[property],
    );

    console.log(logString);

    next();
  };
}

function helloWorld(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}

function restrict(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return next(new Error('Unauthorized'));

  const [scheme, value] = authorization.split(' ');
  const [user, pass] = Buffer.from(value, 'base64').toString().split(':');

  // Use user and pass to for authentication in real project.
  console.log(user, pass);

  next();
}

function admin(req, res) {
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;

    case '/users':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['Mike', 'Jason', 'Clara']));
      break;

    default:
      break;
  }
}

function router(routeModel) {
  return function (req, res, next) {
    const { method, url } = req;

    if (!routeModel[method]) {
      next();
      return undefined;
    }

    const routes = routeModel[method];
    const paths = Object.keys(routes);
    const parsedUrl = parse(url);

    for (let i = 0; i < paths.length; i += 1) {
      let path = paths[i];
      const routeHandler = routes[path];

      path = path.replace(/:(\w+)/g, '([^\\/]+)');
      const pattern = new RegExp(`^${path}$`);
      const capture = parsedUrl.pathname.match(pattern);

      if (capture) {
        const args = [req, res].concat(capture.slice(1));
        routeHandler.apply(null, args);

        return undefined;
      }
    }

    next();
  };
}

module.exports = {
  logger,
  helloWorld,
  restrict,
  admin,
  router,
};
