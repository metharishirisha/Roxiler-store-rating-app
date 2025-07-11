const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
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

router.get('/me', auth, userController.getMe);
router.get('/:id', auth, role('admin'), userController.getUserById);
router.patch(
  '/:id',
  auth,
  validate([
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('address').optional().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  ]),
  userController.updateUser
);
router.delete('/:id', auth, role('admin'), userController.deleteUser);

module.exports = router; 