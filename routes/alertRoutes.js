const router = require('express').Router();
const { sendAlert, getAlerts } = require('../controllers/alertController');
const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

router.post('/', protect, allowRoles('ngo', 'vet'), sendAlert);
router.get('/', protect, getAlerts);

module.exports = router;
