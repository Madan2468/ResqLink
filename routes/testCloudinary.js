const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    // Upload from remote URL
    const result = await cloudinary.uploader.upload('https://via.placeholder.com/150');
    res.json({ message: '✅ Cloudinary connected and uploaded', result });
  } catch (error) {
    res.status(500).json({ message: '❌ Cloudinary error', error: error.message });
  }
});

module.exports = router;
