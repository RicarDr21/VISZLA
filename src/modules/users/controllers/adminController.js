// src/modules/admin/controllers/adminController.js
const Usuario = require("../../users/models/userModel");

// 📌 Listar usuarios (con búsqueda opcional por nombre o correo)
const getUsers = async (req, res) => {
  try {
    const { nombre, correo } = req.query;
    let filtro = {};

    if (nombre) {
      filtro.nombres = { $regex: nombre, $options: "i" }; // búsqueda insensible a mayúsculas
    }
    if (correo) {
      filtro.email = { $regex: correo, $options: "i" };
    }

    const usuarios = await Usuario.find(filtro); // 🚫 No devolver la contraseña
    res.json({ ok: true, usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error al obtener usuarios", error });
  }
};

// 📌 Cambiar estado del usuario (activo, suspendido, baneado)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // "activo", "suspendido", "baneado"

    if (!["activo", "suspendido", "baneado"].includes(estado)) {
      return res.status(400).json({ ok: false, msg: "Estado inválido" });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    ).select("-contraseña");

    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.json({ ok: true, msg: "Estado actualizado", usuario });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error al cambiar estado", error });
  }
};

// 📌 Eliminar usuario permanentemente
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    res.json({ ok: true, msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error al eliminar usuario", error });
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  deleteUser,
};
