const router = require('express').Router();
const {
  reportCase,
  getAllCases,
  getCaseById,
  updateCaseStatus,
  searchCases
} = require('../controllers/caseController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('photo'), reportCase);
router.get('/', protect, getAllCases);
router.get('/search', protect, searchCases);
router.get('/:id', protect, getCaseById);
router.put('/:id/status', protect, allowRoles('ngo', 'vet', 'volunteer'), updateCaseStatus);

module.exports = router;
