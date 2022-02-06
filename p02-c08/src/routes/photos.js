const express = require('express');
const multer = require('multer');
const path = require('path');

const Photo = require('../database/models/photo.js');

const router = express.Router();
const photosDirectory = path.join(__dirname, '../../public/photos');

/* ========== Multer configuration ========== */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, photosDirectory);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* ========== Controllers ========== */

async function list(req, res) {
  const photos = await Photo.find({});

  res.render('photos/index', { photos });
}

function newForm(req, res) {
  res.render('photos/upload');
}

async function uploadPhoto(req, res) {
  const {
    body: { name },
    file: { filename },
  } = req;

  const newPhoto = { name, url: `/photos/${filename}` };

  await Photo.create(newPhoto);

  res.redirect('/');
}

async function download(req, res) {
  const {
    params: { id },
  } = req;

  const photo = await Photo.findById(id);
  const imgPath = `${path.join(__dirname, '../../public')}${photo.url}`;

  res.download(imgPath);
}

/* ========== Routes ========== */

router.get('/', list);

router.get('/new', newForm);

router.post('/', upload.single('photo'), uploadPhoto);

router.get('/:id/download', download);

module.exports = router;
