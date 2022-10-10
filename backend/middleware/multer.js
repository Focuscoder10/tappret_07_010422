const multer = require('multer');
const crypto = require('crypto');

const MIMETYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload');
  },
  filename(req, file, cb) {
    const filename = `${crypto.randomUUID()}.${MIMETYPES[file.mimetype]}`;
    cb(null, filename);
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 512 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!Object.hasOwn(MIMETYPES, file.mimetype)) {
      return cb(new Error('Wrong File Type'));
    }
    return cb(null, true);
  },
}).single('file');
