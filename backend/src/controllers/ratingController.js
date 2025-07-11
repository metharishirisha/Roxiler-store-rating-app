const prisma = require('../utils/prismaClient');

// POST /api/ratings (user)
exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, rating } = req.body;
    if (!storeId || !rating) {
      return res.status(400).json({ message: 'storeId and rating are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    // Check if user already rated this store
    const existing = await prisma.rating.findFirst({ where: { userId, storeId } });
    if (existing) {
      return res.status(409).json({ message: 'You have already rated this store.' });
    }
    const newRating = await prisma.rating.create({
      data: { userId, storeId, rating },
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};

// PUT /api/ratings/:id (user)
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratingId = Number(req.params.id);
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    // Check if rating belongs to user
    const existing = await prisma.rating.findUnique({ where: { id: ratingId } });
    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: 'You can only update your own rating.' });
    }
    const updated = await prisma.rating.update({ where: { id: ratingId }, data: { rating } });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update rating' });
  }
};

// GET /api/ratings/my (user)
exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: { store: { select: { id: true, name: true } } }
    });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
};

// GET /api/ratings/store/:id (owner)
exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = Number(req.params.id);
    // Optionally, check if req.user owns this store
    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch store ratings' });
  }
};

// GET /api/ratings/store/:id/average (owner)
exports.getStoreAverageRating = async (req, res) => {
  try {
    const storeId = Number(req.params.id);
    const result = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { rating: true }
    });
    res.json({ average: result._avg.rating || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch average rating' });
  }
}; 