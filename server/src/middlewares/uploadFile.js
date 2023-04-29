const multer = require('multer');
const path = require('path');

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 1024 * 1024 * 2; // 2MB
const ALLOWED_FILE_TYPES = process.env.ALLOWED_FILE_TYPES || [
  'jpg',
  'jpeg',
  'png',
];
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/images/users';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + '-' + file.originalname.replace(extname, '') + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    const error = new Error('File type not allowed');
    console.log('error: ', error);
    return cb(error);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
