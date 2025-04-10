const router = require('express').Router();
const { getAllUsers, getUserProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, getAllUsers);
router.get('/me', protect, getUserProfile);

module.exports = router;
