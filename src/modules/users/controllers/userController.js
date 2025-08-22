const User = require('../models/userModel');

// --- Crear usuario (para la UI) ---
const postUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    return res.status(400).json({ message: err.message });
  }
};

// --- Listar usuarios (para la UI) ---
const getUsers = async (_req, res) => {
  try {
    const users = await User.find().lean();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- US-06: Baja permanente ---
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    const r = await User.deleteOne({ _id: id });
    if (r.deletedCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json({ message: 'Usuario eliminado permanentemente' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- US-07: Suspender ---
const suspend = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    const user = await User.findByIdAndUpdate(id, { suspended: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ message: 'Usuario suspendido', user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- US-07: Reactivar ---
const reactivate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    const user = await User.findByIdAndUpdate(id, { suspended: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json({ message: 'Usuario reactivado', user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.user || (req.user.role !== 'admin' && req.user.id !== id)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({ message: 'Usuario actualizado', user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }
    return res.status(400).json({ message: err.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { postUser, getUsers, deleteUser, suspend, reactivate, updateUser, getUserById };
