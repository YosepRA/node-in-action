"use strict";

require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const errorHandler = require('errorhandler');

const path = require('path');

const photosRouter = require('./routes/photos.js');

const mongoConnect = require('./database/mongo-connect.js');

const _process$env = process.env,
      NODE_ENV = _process$env.NODE_ENV,
      PORT = _process$env.PORT,
      MONGO_URL = _process$env.MONGO_URL;
const app = express();
const port = PORT || 3000;
const mongoUrl = MONGO_URL || 'mongodb://localhost:27017/photo-sharing-app';
const viewsDirectory = path.join(__dirname, '../views');
const publicDirectory = path.join(__dirname, '../public');
/* ========== Database connection ========== */

mongoConnect(mongoUrl);
/* ========== Configuration ========== */

app.set('views', viewsDirectory);
app.set('view engine', 'ejs');
/* ========== Middlewares ========== */

app.use(morgan('dev'));
app.use(express.static(publicDirectory));
/* ========== Routes ========== */

app.use('/', photosRouter);

if (NODE_ENV === 'development') {
  app.use(errorHandler());
}

app.listen(port, () => {
  console.log(`Server is now listening on port ${port}...`);
});