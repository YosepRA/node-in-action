"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const _require = require('url'),
      parse = _require.parse;

function logger(format) {
  const pattern = /:(\w+)/g;
  return function (req, res, next) {
    const logString = format.replace(pattern, (match, property) => req[property]);
    console.log(logString);
    next();
  };
}

function helloWorld(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}

function restrict(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));

  const _authorization$split = authorization.split(' '),
        _authorization$split2 = _slicedToArray(_authorization$split, 2),
        scheme = _authorization$split2[0],
        value = _authorization$split2[1];

  const _Buffer$from$toString = Buffer.from(value, 'base64').toString().split(':'),
        _Buffer$from$toString2 = _slicedToArray(_Buffer$from$toString, 2),
        user = _Buffer$from$toString2[0],
        pass = _Buffer$from$toString2[1]; // Use user and pass to for authentication in real project.


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
    const method = req.method,
          url = req.url;

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
  router
};