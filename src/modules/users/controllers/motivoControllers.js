const Motivo = require('../models/motivoModel');

// Crear motivo (solo admin)
const createMotivo = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const motivo = await Motivo.create(req.body);
    return res.status(201).json(motivo);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Listar motivos (cualquiera autenticado puede ver)
const getMotivos = async (_req, res) => {
  try {
    const motivos = await Motivo.find().lean();
    return res.json(motivos);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Actualizar motivo (solo admin)
const updateMotivo = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    const { id } = req.params;
    const motivo = await Motivo.findByIdAndUpdate(id, req.body, { new: true });
    if (!motivo) return res.status(404).json({ message: 'Motivo no encontrado' });
    return res.json(motivo);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createMotivo, getMotivos, updateMotivo };
