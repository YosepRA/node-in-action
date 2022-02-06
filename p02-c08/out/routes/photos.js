"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const express = require('express');

const multer = require('multer');

const path = require('path');

const Photo = require('../database/models/photo.js');

const router = express.Router();
const photosDirectory = path.join(__dirname, '../../public/photos');
/* ========== Multer configuration ========== */

const storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, photosDirectory);
  },
  filename: function filename(req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}-${file.originalname}`);
  }
});
const upload = multer({
  storage
});
/* ========== Controllers ========== */

function list(_x, _x2) {
  return _list.apply(this, arguments);
}

function _list() {
  _list = _asyncToGenerator(function* (req, res) {
    const photos = yield Photo.find({});
    res.render('photos/index', {
      photos
    });
  });
  return _list.apply(this, arguments);
}

function newForm(req, res) {
  res.render('photos/upload');
}

function uploadPhoto(_x3, _x4) {
  return _uploadPhoto.apply(this, arguments);
}

function _uploadPhoto() {
  _uploadPhoto = _asyncToGenerator(function* (req, res) {
    const name = req.body.name,
          filename = req.file.filename;
    const newPhoto = {
      name,
      url: `/photos/${filename}`
    };
    yield Photo.create(newPhoto);
    res.redirect('/');
  });
  return _uploadPhoto.apply(this, arguments);
}

function download(_x5, _x6) {
  return _download.apply(this, arguments);
}
/* ========== Routes ========== */


function _download() {
  _download = _asyncToGenerator(function* (req, res) {
    const id = req.params.id;
    const photo = yield Photo.findById(id);
    const imgPath = `${path.join(__dirname, '../../public')}${photo.url}`;
    res.download(imgPath);
  });
  return _download.apply(this, arguments);
}

router.get('/', list);
router.get('/new', newForm);
router.post('/', upload.single('photo'), uploadPhoto);
router.get('/:id/download', download);
module.exports = router;