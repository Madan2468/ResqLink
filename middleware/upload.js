const multer = require('multer');
const path = require('path');

// Memory storage (avoids saving to disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
