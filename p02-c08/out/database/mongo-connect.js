"use strict";

const mongoose = require('mongoose');

function mongoConnect(mongoUrl) {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose.connect(mongoUrl, options);
  const dbConnection = mongoose.connection;
  dbConnection.once('open', () => {
    console.log('Connected to database...');
  });
  dbConnection.on('error', err => {
    console.error('Database connection error.');
    console.error(err.message);
  });
  return {
    dbConnection
  };
}

module.exports = mongoConnect;