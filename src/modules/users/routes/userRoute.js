const express = require("express");
const Usuario = require("../models/userModel");
const { verificarToken } = require("../../../middlewares/auth");
const { register, verifyAccount } = require ("../controllers/userController.js");

const router = express.Router();

// 📌 Registro de usuario
router.post("/register", register);

//Verificar cuenta mediante correo
router.get("/verify/:token", verifyAccount);

router.post("/usuarios/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar contraseña
    const validaPassword = await bcrypt.compare(password, usuario.password);
    if (!validaPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET, // 🔑 usa variable de entorno
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      rol: usuario.rol,
      nombres: usuario.nombres
    });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// Obtener perfil del usuario autenticado
router.get("/usuarios/profile", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-password"); 
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuario" });
  }
});

// Actualizar perfil
router.put("/usuarios/perfil", verificarToken, async (req, res) => {
  try {
    const { id } = req.usuario; // viene del token
    const {nombres, apellidos, email, apodo  } = req.body; // datos que actualiza el usuario

    // Buscar y actualizar
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { nombres, apellidos, email, apodo },
      { new: true } // devuelve el usuario ya actualizado
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el perfil" });
  }
});

module.exports = router;

