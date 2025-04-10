const cloudinaryModule = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config(); // Load .env before using environment variables

const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: log only in development to verify ENV variables
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Cloudinary Config:', {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ Loaded' : '❌ Missing',
    API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Loaded' : '❌ Missing',
  });
}

module.exports = cloudinary;
