const prisma = require('../utils/prismaClient');

// GET /api/stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany({
      select: { id: true, name: true, email: true, address: true }
    });
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

// GET /api/stores/:id
exports.getStoreById = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, email: true, address: true }
    });
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch store' });
  }
};

// POST /api/stores (admin only)
exports.createStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required.' });
    }
    const store = await prisma.store.create({
      data: { name, email, address },
      select: { id: true, name: true, email: true, address: true }
    });
    res.status(201).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create store' });
  }
};

// PUT /api/stores/:id (admin only)
exports.updateStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const store = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data: { name, email, address },
      select: { id: true, name: true, email: true, address: true }
    });
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update store' });
  }
};

// DELETE /api/stores/:id (admin only)
exports.deleteStore = async (req, res) => {
  try {
    await prisma.store.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete store' });
  }
}; 