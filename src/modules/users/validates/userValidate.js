const mongoose = require('mongoose');

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }
  next();
};

module.exports = { validateUserId };
