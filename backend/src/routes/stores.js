const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const storeController = require('../controllers/storeController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.get('/', auth, storeController.getAllStores);
router.get('/:id', auth, storeController.getStoreById);
router.post(
  '/',
  auth,
  role('admin'),
  validate([
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('address').isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('email').optional().isEmail().withMessage('Invalid email'),
  ]),
  storeController.createStore
);
router.put(
  '/:id',
  auth,
  role('admin'),
  validate([
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('address').optional().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('email').optional().isEmail().withMessage('Invalid email'),
  ]),
  storeController.updateStore
);
router.delete('/:id', auth, role('admin'), storeController.deleteStore);

module.exports = router; 