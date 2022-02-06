const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const photoSchema = new Schema({
  name: String,
  url: String,
  created: { type: Date, default: Date.now },
});

const Photo = model('Photo', photoSchema);

module.exports = Photo;
