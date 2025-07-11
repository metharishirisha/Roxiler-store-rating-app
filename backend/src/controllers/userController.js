const prisma = require('../utils/prismaClient');

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// GET /api/users/:id (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (Number(req.params.id) !== userId) {
      return res.status(403).json({ message: 'You can only update your own profile.' });
    }
    const { name, address } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, address },
      select: { id: true, name: true, email: true, address: true, role: true }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// DELETE /api/users/:id (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}; 