"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema,
      model = mongoose.model;
const photoSchema = new Schema({
  name: String,
  url: String,
  created: {
    type: Date,
    default: Date.now
  }
});
const Photo = model('Photo', photoSchema);
module.exports = Photo;