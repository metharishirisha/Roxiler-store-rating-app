const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
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

router.post(
  '/',
  auth,
  role('user'),
  validate([
    body('storeId').isInt().withMessage('storeId must be an integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ]),
  ratingController.createRating
);
router.put(
  '/:id',
  auth,
  role('user'),
  validate([
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ]),
  ratingController.updateRating
);
router.get('/my', auth, role('user'), ratingController.getMyRatings);
router.get('/store/:id', auth, role('owner'), ratingController.getStoreRatings);
router.get('/store/:id/average', auth, role('owner'), ratingController.getStoreAverageRating);

module.exports = router; 