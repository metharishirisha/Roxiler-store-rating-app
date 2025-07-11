const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/stats', auth, role('admin'), adminController.getStats);
router.get('/users', auth, role('admin'), adminController.getUsers);
router.get('/stores', auth, role('admin'), adminController.getStores);

module.exports = router; 