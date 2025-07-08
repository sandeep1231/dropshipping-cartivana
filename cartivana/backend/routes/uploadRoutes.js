const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer storage to save images to /uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST /api/upload - handle image upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the image URL relative to the server
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
