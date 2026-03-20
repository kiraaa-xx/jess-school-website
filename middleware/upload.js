// middleware/upload.js — Uploads images directly to Cloudinary (not local disk)
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'jess-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation:  [{ width: 1200, quality: 'auto', fetch_format: 'auto' }],
  },
});

function fileFilter(req, file, cb) {
  const ok = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
  ok.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only image files allowed'));
}

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
