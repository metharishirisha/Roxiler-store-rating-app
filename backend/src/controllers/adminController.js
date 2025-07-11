const prisma = require('../utils/prismaClient');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const users = await prisma.user.count();
    const stores = await prisma.store.count();
    const ratings = await prisma.rating.count();
    res.json({ users, stores, ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// GET /api/admin/users?role=role
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// GET /api/admin/stores?name=...&address=...
exports.getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    const stores = await prisma.store.findMany({
      where,
      select: { id: true, name: true, email: true, address: true }
    });
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
}; 